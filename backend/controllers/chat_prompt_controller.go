package controllers

import (
	"backend/models"
	"backend/utils"
	"bytes"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type newDayPromptRequest struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

func SaveNewDayPrompt(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := c.MustGet("user").(models.GoogleUserInfoDB)

		var req newDayPromptRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		chatType := req.Type
		if chatType == "" {
			chatType = "planning"
		}
		botText := strings.TrimSpace(req.Text)

		tx := db.Begin()
		defer func() {
			if r := recover(); r != nil {
				tx.Rollback()
			}
		}()

		if botText == "" {
			if chatType == "heart_to_heart" {
				var bibiMem models.BibiMemories
				_ = db.Where("google_id = ?", user.GoogleID).First(&bibiMem)

				requestBody := map[string]interface{}{
					"message":      "daily_greeting",
					"memories":     bibiMem.Memories,
					"chat_history": []models.ChatMessage{},
				}
				payload, _ := json.Marshal(requestBody)

				modelURL := "http://model:8000/heart_to_heart_greeting"

				if resp, err := http.Post(modelURL, "application/json", bytes.NewBuffer(payload)); err == nil {
					defer resp.Body.Close()
					var modelResp models.ChatResponse
					if err := json.NewDecoder(resp.Body).Decode(&modelResp); err == nil && strings.TrimSpace(modelResp.Noma) != "" {
						botText = modelResp.Noma
					}
				}

				if strings.TrimSpace(botText) == "" {
					botText = "Xin chào! Mình là Bibi, người bạn tâm sự của bạn. Hãy chia sẻ những gì đang làm bạn buồn phiền, mình sẽ lắng nghe và cùng bạn vượt qua nhé! 💙"
				}
			} else {
				var memories models.NomaMemories
				_ = db.Where("google_id = ?", user.GoogleID).First(&memories)
				existingIssue := ""
				if memories.Issue != nil {
					existingIssue = *memories.Issue
				}

				reqBody := map[string]interface{}{
					"message":        "daily_greeting",
					"memories":       memories.Memories,
					"chat_history":   []models.ChatMessage{},
					"existing_issue": existingIssue,
				}
				payload, _ := json.Marshal(reqBody)

				modelURL := "http://model:8000/planning_greeting"

				if resp, err := http.Post(modelURL, "application/json", bytes.NewBuffer(payload)); err == nil {
					defer resp.Body.Close()
					var modelResp models.ChatResponse
					if err := json.NewDecoder(resp.Body).Decode(&modelResp); err == nil && strings.TrimSpace(modelResp.Noma) != "" {
						botText = modelResp.Noma
					}
				}

				if strings.TrimSpace(botText) == "" {
					botText = "Xin chào! Tôi là Noma, trợ lý lập kế hoạch của bạn. Hãy cho tôi biết bạn đang gặp khó khăn gì để tôi có thể giúp bạn lên kế hoạch vượt qua nhé! 💪"
				}
			}
		}

		keyVersion := utils.GetCurrentKeyVersion()

		userCipher, userIV, err := utils.EncryptUserData("", user.GoogleID, keyVersion)
		if err != nil {
			tx.Rollback()
			c.JSON(500, gin.H{"error": "Failed to encrypt user data"})
			return
		}
		botCipher, botIV, err := utils.EncryptUserData(botText, user.GoogleID, keyVersion)
		if err != nil {
			tx.Rollback()
			c.JSON(500, gin.H{"error": "Failed to encrypt bot data"})
			return
		}

		if chatType == "heart_to_heart" {
			record := models.ChatWithBibi{GoogleID: user.GoogleID, UserCipher: userCipher, UserIV: userIV, BotCipher: botCipher, BotIV: botIV, KeyVersion: keyVersion, CreatedBy: user.GoogleID}
			if err := tx.Create(&record).Error; err != nil {
				tx.Rollback()
				c.JSON(500, gin.H{"error": "Failed to save prompt"})
				return
			}
		} else {
			record := models.ChatWithNoma{GoogleID: user.GoogleID, UserCipher: userCipher, UserIV: userIV, BotCipher: botCipher, BotIV: botIV, KeyVersion: keyVersion, CreatedBy: user.GoogleID}
			if err := tx.Create(&record).Error; err != nil {
				tx.Rollback()
				c.JSON(500, gin.H{"error": "Failed to save prompt"})
				return
			}
		}

		if err := tx.Commit().Error; err != nil {
			c.JSON(500, gin.H{"error": "Failed to commit transaction"})
			return
		}

		c.JSON(200, gin.H{"status": "ok", "text": botText})
	}
}
