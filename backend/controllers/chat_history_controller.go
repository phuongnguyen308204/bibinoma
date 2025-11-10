package controllers

import (
	"backend/models"
	"backend/utils"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetChatHistory(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := c.MustGet("user").(models.GoogleUserInfoDB)
		chatType := c.Query("type")
		if chatType == "" {
			chatType = "planning"
		}

		var messages []gin.H
		if chatType == "heart_to_heart" {
			var chatRecords []models.ChatWithBibi
			if err := db.Where("google_id = ?", user.GoogleID).Order("created_at ASC").Find(&chatRecords).Error; err != nil {
				c.JSON(404, gin.H{"error": "No chat history found"})
				return
			}

			if len(chatRecords) == 0 {
				greeting := "Bibi đây. Bibi luôn ở đây lắng nghe bạn. Hôm nay bạn muốn tâm sự điều gì?"
				keyVersion := utils.GetCurrentKeyVersion()
				userCipher, userIV, err := utils.EncryptUserData("", user.GoogleID, keyVersion)
				if err == nil {
					botCipher, botIV, err2 := utils.EncryptUserData(greeting, user.GoogleID, keyVersion)
					if err2 == nil {
						record := models.ChatWithBibi{GoogleID: user.GoogleID, UserCipher: userCipher, UserIV: userIV, BotCipher: botCipher, BotIV: botIV, KeyVersion: keyVersion, CreatedBy: user.GoogleID}
						_ = db.Create(&record).Error
						chatRecords = append(chatRecords, record)
					}
				}
			}
			for _, record := range chatRecords {
				userMessage, err := utils.DecryptUserData(record.UserCipher, record.UserIV, user.GoogleID, record.KeyVersion)
				if err != nil {
					userMessage = "[Decryption Error]"
				}
				botMessage, err := utils.DecryptUserData(record.BotCipher, record.BotIV, user.GoogleID, record.KeyVersion)
				if err != nil {
					botMessage = "[Decryption Error]"
				}
				if strings.TrimSpace(userMessage) != "" {
					messages = append(messages, gin.H{
						"id":         record.ID,
						"user":       userMessage,
						"noma":       botMessage,
						"created_at": record.CreatedAt,
					})
				} else {
					messages = append(messages, gin.H{
						"id":         record.ID,
						"user":       "",
						"noma":       botMessage,
						"created_at": record.CreatedAt,
					})
				}
			}
		} else {
			var chatRecords []models.ChatWithNoma
			if err := db.Where("google_id = ?", user.GoogleID).Order("created_at ASC").Find(&chatRecords).Error; err != nil {
				c.JSON(404, gin.H{"error": "No chat history found"})
				return
			}

			if len(chatRecords) == 0 {
				greeting := "Noma đây. Cho Noma biết bạn đang gặp vấn đề gì để cùng lập kế hoạch hôm nay nhé."
				keyVersion := utils.GetCurrentKeyVersion()
				userCipher, userIV, err := utils.EncryptUserData("", user.GoogleID, keyVersion)
				if err == nil {
					botCipher, botIV, err2 := utils.EncryptUserData(greeting, user.GoogleID, keyVersion)
					if err2 == nil {
						record := models.ChatWithNoma{GoogleID: user.GoogleID, UserCipher: userCipher, UserIV: userIV, BotCipher: botCipher, BotIV: botIV, KeyVersion: keyVersion, CreatedBy: user.GoogleID}
						_ = db.Create(&record).Error
						chatRecords = append(chatRecords, record)
					}
				}
			}
			for _, record := range chatRecords {
				userMessage, err := utils.DecryptUserData(record.UserCipher, record.UserIV, user.GoogleID, record.KeyVersion)
				if err != nil {
					userMessage = "[Decryption Error]"
				}
				botMessage, err := utils.DecryptUserData(record.BotCipher, record.BotIV, user.GoogleID, record.KeyVersion)
				if err != nil {
					botMessage = "[Decryption Error]"
				}
				if strings.TrimSpace(userMessage) != "" {
					messages = append(messages, gin.H{
						"id":         record.ID,
						"user":       userMessage,
						"noma":       botMessage,
						"created_at": record.CreatedAt,
					})
				} else {
					messages = append(messages, gin.H{
						"id":         record.ID,
						"user":       "",
						"noma":       botMessage,
						"created_at": record.CreatedAt,
					})
				}
			}
		}

		c.JSON(200, gin.H{"messages": messages})
	}
}
