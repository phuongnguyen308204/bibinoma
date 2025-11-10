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

func ChatWithBibi(db *gorm.DB) gin.HandlerFunc {
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

		var memories models.BibiMemories
		result := db.Where("google_id = ?", user.GoogleID).First(&memories)

		memoriesList := []string{}
		if result.Error == nil && memories.Memories != nil {
			memoriesList = memories.Memories
		}

		requestBody := map[string]interface{}{
			"message":      req.Message,
			"memories":     memoriesList,
			"chat_history": req.ChatHistory,
		}

		jsonData, err := json.Marshal(requestBody)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal request"})
			return
		}

		modelURL := os.Getenv("MODEL_URL")
		if modelURL == "" {
			modelURL = "http://model:8000/heart_to_heart"
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

		chatRecord := models.ChatWithBibi{
			GoogleID:   user.GoogleID,
			UserCipher: userCipher,
			UserIV:     userIV,
			BotCipher:  botCipher,
			BotIV:      botIV,
			KeyVersion: keyVersion,
			CreatedBy:  user.GoogleID,
		}
		result = db.Create(&chatRecord)
		if result.Error != nil {
		}

		if result.Error == nil {
			db.Model(&models.GoogleUserInfoDB{}).
				Where("google_id = ?", user.GoogleID).
				UpdateColumn("money", gorm.Expr("money - ?", 100))
		}

		var oldMemories models.BibiMemories
		db.Where("google_id = ?", user.GoogleID).First(&oldMemories)

		var candidate string
		if modelResponse.Memories != nil {
			isEmpty := len(modelResponse.Memories) == 0
			if !isEmpty {
				if mem, ok := modelResponse.Memories["memory"]; ok {
					memStr := fmt.Sprintf("%v", mem)
					if strings.TrimSpace(memStr) == "" {
						isEmpty = true
					}
				} else {
					isEmpty = true
				}
			}

			if !isEmpty {
				if b, err := json.Marshal(modelResponse.Memories); err == nil {
					candidate = string(b)
				}
			}
		}

		if candidate != "" {
			shouldAppend := true
			for _, existing := range oldMemories.Memories {
				if existing == candidate {
					shouldAppend = false
					break
				}
			}
			if shouldAppend {
				updated := append([]string{}, oldMemories.Memories...)
				updated = append(updated, candidate)

				if oldMemories.GoogleID != "" {
					result = db.Model(&oldMemories).Where("google_id = ?", user.GoogleID).Update("memories", pq.StringArray(updated))
				} else {
					newMemories := models.BibiMemories{
						GoogleID: user.GoogleID,
						Memories: pq.StringArray(updated),
					}
					result = db.Create(&newMemories)
				}
				if result.Error != nil {
				}

				existingCount := len(oldMemories.Memories)
				additionalCost := (100 + existingCount*2) * 1
				db.Model(&models.GoogleUserInfoDB{}).
					Where("google_id = ?", user.GoogleID).
					UpdateColumn("money", gorm.Expr("money - ?", additionalCost))
			}
		}

		c.JSON(http.StatusOK, modelResponse)
	}
}

func DeleteBibiData(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := c.MustGet("user").(models.GoogleUserInfoDB)

		db.Where("google_id = ?", user.GoogleID).Delete(&models.ChatWithBibi{})
		db.Where("google_id = ?", user.GoogleID).Delete(&models.BibiMemories{})

		c.JSON(http.StatusOK, gin.H{"message": "Bibi data deleted successfully"})
	}
}
