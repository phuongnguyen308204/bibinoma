package controllers

import (
	"backend/models"
	"backend/utils"
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

func shouldAllowIssueChange(message string) bool {
	m := strings.ToLower(strings.TrimSpace(message))
	if m == "" {
		return false
	}
	explicitPhrases := []string{
		"bắt đầu vấn đề mới",
		"bắt đầu chủ đề mới",
		"đổi vấn đề",
		"đổi chủ đề",
		"tạo issue mới",
		"tạo vấn đề mới",
		"start new issue",
		"new issue",
		"change issue",
		"switch topic",
	}
	for _, p := range explicitPhrases {
		if strings.Contains(m, p) {
			return true
		}
	}
	return false
}

func ChatWithNoma(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := c.MustGet("user").(models.GoogleUserInfoDB)

		if user.Money <= 0 {
			c.JSON(http.StatusPaymentRequired, gin.H{"error": "insufficient_funds"})
			return
		}

		var req models.ChatRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var memories models.NomaMemories
		result := db.Where("google_id = ?", user.GoogleID).First(&memories)

		memoriesList := []string{}
		if result.Error == nil && memories.Memories != nil {
			memoriesList = memories.Memories
		}

		existingIssue := ""
		if result.Error == nil && memories.Issue != nil {
			existingIssue = *memories.Issue
		}

		requestBody := map[string]interface{}{
			"message":        req.Message,
			"memories":       memoriesList,
			"chat_history":   req.ChatHistory,
			"existing_issue": existingIssue,
		}

		jsonData, err := json.Marshal(requestBody)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal request"})
			return
		}

		modelURL := os.Getenv("MODEL_URL")
		if modelURL == "" {
			modelURL = "http://model:8000/planning"
		}

		resp, err := http.Post(modelURL, "application/json", bytes.NewBuffer(jsonData))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to model"})
			return
		}
		defer resp.Body.Close()

		var modelResponse models.ChatResponse
		if err := json.NewDecoder(resp.Body).Decode(&modelResponse); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode model response"})
			return
		}

		keyVersion := utils.GetCurrentKeyVersion()

		userCipher, userIV, err := utils.EncryptUserData(modelResponse.User, user.GoogleID, keyVersion)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to encrypt user data"})
			return
		}

		botCipher, botIV, err := utils.EncryptUserData(modelResponse.Noma, user.GoogleID, keyVersion)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to encrypt bot data"})
			return
		}

		tx := db.Begin()
		defer func() {
			if r := recover(); r != nil {
				tx.Rollback()
			}
		}()

		chatRecord := models.ChatWithNoma{
			GoogleID:   user.GoogleID,
			UserCipher: userCipher,
			UserIV:     userIV,
			BotCipher:  botCipher,
			BotIV:      botIV,
			KeyVersion: keyVersion,
			CreatedBy:  user.GoogleID,
		}

		if err := tx.Create(&chatRecord).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save chat record"})
			return
		}

		if err := tx.Model(&models.GoogleUserInfoDB{}).
			Where("google_id = ?", user.GoogleID).
			UpdateColumn("money", gorm.Expr("money - ?", 100)).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user money"})
			return
		}

		var newIssue string
		var newPlans []map[string]interface{}
		var newHabits []map[string]interface{}
		hasNewIssue := false
		hasNewPlans := false
		hasNewHabits := false

		if issueValue, exists := modelResponse.Memories["issue"]; exists {
			if issueStr, ok := issueValue.(string); ok && issueStr != "" {
				newIssue = issueStr
				if shouldAllowIssueChange(req.Message) {
					hasNewIssue = true
				} else if existingIssue == "" {
					hasNewIssue = true
				} else {
					hasNewIssue = false
				}
			}
		}
		if plansValue, exists := modelResponse.Memories["plans"]; exists {
			if plansArray, ok := plansValue.([]interface{}); ok && len(plansArray) > 0 {
				for _, dayItem := range plansArray {
					if dayObj, ok := dayItem.(map[string]interface{}); ok {
						newPlans = append(newPlans, dayObj)
					}
				}
				hasNewPlans = true
			}
		}
		if habitsValue, exists := modelResponse.Memories["habits"]; exists {
			if habitsArray, ok := habitsValue.([]interface{}); ok && len(habitsArray) > 0 {
				isArrayOfMaps := true
				for _, item := range habitsArray {
					if _, ok := item.(map[string]interface{}); !ok {
						isArrayOfMaps = false
						break
					}
				}
				if isArrayOfMaps {
					for _, dayItem := range habitsArray {
						if dayObj, ok := dayItem.(map[string]interface{}); ok {
							newHabits = append(newHabits, dayObj)
						}
					}
					hasNewHabits = true
				} else {
					var flatHabits []string
					for _, item := range habitsArray {
						if s, ok := item.(string); ok && strings.TrimSpace(s) != "" {
							flatHabits = append(flatHabits, s)
						}
					}
					if len(flatHabits) > 0 {
						newHabits = append(newHabits, map[string]interface{}{"habits": flatHabits})
						hasNewHabits = true
					}
				}
			}
		}

		if hasNewIssue && existingIssue != "" && newIssue != existingIssue {
			c.JSON(http.StatusOK, gin.H{
				"user":     req.Message,
				"noma":     fmt.Sprintf("Tôi thấy bạn đang muốn bắt đầu một vấn đề mới: '%s'. Tuy nhiên, bạn đã có một vấn đề đang được xử lý: '%s'. Để bắt đầu với vấn đề mới, bạn cần xóa dữ liệu cũ trước. Bạn có muốn xóa dữ liệu cũ để bắt đầu với vấn đề mới không?", newIssue, existingIssue),
				"memories": map[string]interface{}{},
			})
			return
		}

		memoriesArray := convertMemoriesToStringArrayExcludingIssuePlansAndHabits(modelResponse.Memories)
		hasNewMemories := len(memoriesArray) > 0

		var oldMemories models.NomaMemories
		tx.Where("google_id = ?", user.GoogleID).First(&oldMemories)

		var finalMemories []string
		if oldMemories.GoogleID != "" {
			finalMemories = append(finalMemories, oldMemories.Memories...)
		}
		if hasNewMemories {
			finalMemories = append(finalMemories, memoriesArray...)
		}

		updateData := map[string]interface{}{
			"memories": pq.StringArray(finalMemories),
		}

		if hasNewIssue {
			updateData["issue"] = newIssue
		}

		if hasNewPlans {
			var existingPlans []map[string]interface{}
			if oldMemories.GoogleID != "" && oldMemories.Plans != nil && *oldMemories.Plans != "" {
				if err := json.Unmarshal([]byte(*oldMemories.Plans), &existingPlans); err != nil {
					existingPlans = []map[string]interface{}{}
				}
			}

			if len(existingPlans) == 0 && len(oldMemories.Memories) > 0 {
				for _, m := range oldMemories.Memories {
					if strings.HasPrefix(m, "plans_data:") {
						plansStr := strings.TrimPrefix(m, "plans_data:")
						var parsed []map[string]interface{}
						if err := json.Unmarshal([]byte(plansStr), &parsed); err == nil {
							existingPlans = parsed
							break
						}
					}
				}
			}

			shouldUpdatePlans := len(existingPlans) == 0

			if !shouldUpdatePlans && len(existingPlans) > 0 {
				plansChanged := false

				if len(newPlans) != len(existingPlans) {
					plansChanged = true
				} else {
					for _, newPlan := range newPlans {
						found := false
						newDate, _ := newPlan["date"].(string)
						newPlansList, _ := newPlan["plans"].([]interface{})

						for _, existingPlan := range existingPlans {
							existingDate, _ := existingPlan["date"].(string)
							existingPlansList, _ := existingPlan["plans"].([]interface{})

							if newDate == existingDate {
								found = true
								if len(newPlansList) != len(existingPlansList) {
									plansChanged = true
									break
								}
								for i, newPlanItem := range newPlansList {
									if i < len(existingPlansList) {
										newPlanStr := fmt.Sprintf("%v", newPlanItem)
										existingPlanStr := fmt.Sprintf("%v", existingPlansList[i])
										if newPlanStr != existingPlanStr {
											plansChanged = true
											break
										}
									}
								}
								break
							}
						}

						if !found {
							plansChanged = true
							break
						}

						if plansChanged {
							break
						}
					}
				}

				shouldUpdatePlans = plansChanged
			}

			if shouldUpdatePlans {
				var allPlans []map[string]interface{}
				for _, existingPlan := range existingPlans {
					shouldKeep := true
					if existingDate, ok := existingPlan["date"].(string); ok {
						for _, newPlan := range newPlans {
							if newDate, ok := newPlan["date"].(string); ok {
								if existingDate == newDate {
									shouldKeep = false
									break
								}
							}
						}
					}
					if shouldKeep {
						allPlans = append(allPlans, existingPlan)
					}
				}
				allPlans = append(allPlans, newPlans...)

				plansJSON, err := json.Marshal(allPlans)
				if err == nil {
					updateData["plans"] = string(plansJSON)
				}
			}
		}

		if hasNewHabits {
			var existingHabitsAsMaps []map[string]interface{}
			var existingHabitsAsStrings []string
			for _, memory := range oldMemories.Memories {
				if strings.HasPrefix(memory, "habits:") {
					habitsStr := strings.TrimPrefix(memory, "habits:")
					_ = json.Unmarshal([]byte(habitsStr), &existingHabitsAsStrings)
					if len(existingHabitsAsStrings) == 0 {
						_ = json.Unmarshal([]byte(habitsStr), &existingHabitsAsMaps)
					}
					break
				}
			}

			var incomingFlat []string
			for _, h := range newHabits {
				if arr, ok := h["habits"].([]interface{}); ok {
					for _, it := range arr {
						if s, ok := it.(string); ok && strings.TrimSpace(s) != "" {
							incomingFlat = append(incomingFlat, s)
						}
					}
				} else if arrS, ok := h["habits"].([]string); ok {
					for _, s := range arrS {
						if strings.TrimSpace(s) != "" {
							incomingFlat = append(incomingFlat, s)
						}
					}
				}
			}

			if len(existingHabitsAsStrings) == 0 && len(existingHabitsAsMaps) > 0 {
				for _, m := range existingHabitsAsMaps {
					if arr, ok := m["habits"].([]interface{}); ok {
						for _, it := range arr {
							if s, ok := it.(string); ok && strings.TrimSpace(s) != "" {
								existingHabitsAsStrings = append(existingHabitsAsStrings, s)
							}
						}
					}
				}
			}

			dedupe := map[string]bool{}
			var merged []string
			for _, s := range existingHabitsAsStrings {
				key := strings.ToLower(strings.TrimSpace(s))
				if key == "" || dedupe[key] {
					continue
				}
				dedupe[key] = true
				merged = append(merged, strings.TrimSpace(s))
			}
			for _, s := range incomingFlat {
				key := strings.ToLower(strings.TrimSpace(s))
				if key == "" || dedupe[key] {
					continue
				}
				dedupe[key] = true
				merged = append(merged, strings.TrimSpace(s))
			}

			habitsJSON, err := json.Marshal(merged)
			if err == nil {
				habitsMemory := fmt.Sprintf("habits:%s", string(habitsJSON))
				var filteredMemories []string
				for _, memory := range finalMemories {
					if !strings.HasPrefix(memory, "habits:") {
						filteredMemories = append(filteredMemories, memory)
					}
				}
				filteredMemories = append(filteredMemories, habitsMemory)
				updateData["memories"] = pq.StringArray(filteredMemories)
			}
		}

		if oldMemories.GoogleID != "" {
			if err := tx.Model(&oldMemories).Where("google_id = ?", user.GoogleID).Updates(updateData).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update memories"})
				return
			}
		} else {
			newMemories := models.NomaMemories{
				GoogleID: user.GoogleID,
				Memories: pq.StringArray(finalMemories),
			}
			if hasNewIssue {
				newMemories.Issue = &newIssue
			}
			if hasNewPlans {
				plansJSON, err := json.Marshal(newPlans)
				if err == nil {
					plansStr := string(plansJSON)
					newMemories.Plans = &plansStr
				}
			}
			if hasNewHabits {
				habitsJSON, err := json.Marshal(newHabits)
				if err == nil {
					habitsMemory := fmt.Sprintf("habits:%s", string(habitsJSON))
					newMemories.Memories = append(newMemories.Memories, habitsMemory)
				}
			}
			if err := tx.Create(&newMemories).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create memories"})
				return
			}
		}

		plansCount := 0
		if plansVal, ok := modelResponse.Memories["plans"]; ok {
			if arr, ok := plansVal.([]interface{}); ok {
				for _, dayItem := range arr {
					if dayObj, ok := dayItem.(map[string]interface{}); ok {
						if dayPlans, ok := dayObj["plans"].([]interface{}); ok {
							plansCount += len(dayPlans)
						}
					}
				}
			}
		}
		totalCost := 100 + plansCount*10
		if err := tx.Model(&models.GoogleUserInfoDB{}).
			Where("google_id = ?", user.GoogleID).
			UpdateColumn("money", gorm.Expr("money - ?", totalCost)).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update final money"})
			return
		}

		if err := tx.Commit().Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
			return
		}

		c.JSON(http.StatusOK, modelResponse)
	}
}

func DeleteNomaData(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := c.MustGet("user").(models.GoogleUserInfoDB)

		db.Where("google_id = ?", user.GoogleID).Delete(&models.ChatWithNoma{})
		db.Where("google_id = ?", user.GoogleID).Delete(&models.NomaMemories{})

		c.JSON(http.StatusOK, gin.H{"message": "Noma data deleted successfully"})
	}
}

func convertMemoriesToStringArrayExcludingIssuePlansAndHabits(memories map[string]interface{}) []string {
	var result []string
	for key, value := range memories {
		if key == "plans" || key == "issue" || key == "habits" {
			continue
		}
		memoryStr := fmt.Sprintf("%s:%v", key, value)
		result = append(result, memoryStr)
	}
	return result
}

func comparePlansArrays(plans1, plans2 []interface{}) bool {
	if len(plans1) != len(plans2) {
		return false
	}
	for i, plan1 := range plans1 {
		plan1Str := fmt.Sprintf("%v", plan1)
		plan2Str := fmt.Sprintf("%v", plans2[i])
		if plan1Str != plan2Str {
			return false
		}
	}
	return true
}
