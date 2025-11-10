package controllers

import (
	"backend/models"
	"fmt"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetMemories(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := c.MustGet("user").(models.GoogleUserInfoDB)
		chatType := c.Query("type")
		if chatType == "" {
			chatType = "planning"
		}

		if chatType == "heart_to_heart" {
			var memories models.BibiMemories
			if err := db.Where("google_id = ?", user.GoogleID).Order("created_at ASC").First(&memories).Error; err != nil {
				c.JSON(200, gin.H{"memories": []string{}})
				return
			}
			c.JSON(200, gin.H{"memories": memories.Memories})
			return
		}

		var memories models.NomaMemories
		if err := db.Where("google_id = ?", user.GoogleID).Order("created_at ASC").First(&memories).Error; err != nil {
			c.JSON(200, gin.H{"memories": []string{}})
			return
		}

		var allMemories []string
		allMemories = append(allMemories, memories.Memories...)

		if memories.Issue != nil && *memories.Issue != "" {
			issueData := fmt.Sprintf("issue_data:%s", *memories.Issue)
			allMemories = append(allMemories, issueData)
		}

		if memories.Plans != nil && *memories.Plans != "" {
			plansData := fmt.Sprintf("plans_data:%s", *memories.Plans)
			allMemories = append(allMemories, plansData)
		}

		for _, memory := range memories.Memories {
			if strings.HasPrefix(memory, "habits:") {
				allMemories = append(allMemories, memory)
			}
		}

		c.JSON(200, gin.H{"memories": allMemories})
	}
}
