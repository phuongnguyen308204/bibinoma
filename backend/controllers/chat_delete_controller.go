package controllers

import (
	"backend/models"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

func DeleteMemory(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := c.MustGet("user").(models.GoogleUserInfoDB)
		chatType := c.Query("type")
		if chatType == "" {
			chatType = "planning"
		}

		indexStr := c.Query("index")
		if indexStr == "" {
			c.JSON(400, gin.H{"error": "index is required"})
			return
		}

		idx := -1
		if n, err := fmt.Sscanf(indexStr, "%d", &idx); n != 1 || err != nil || idx < 0 {
			c.JSON(400, gin.H{"error": "invalid index"})
			return
		}

		if chatType == "heart_to_heart" {
			var memories models.BibiMemories
			if err := db.Where("google_id = ?", user.GoogleID).Order("created_at DESC").First(&memories).Error; err != nil {
				c.JSON(404, gin.H{"error": "no memories found"})
				return
			}
			if idx >= len(memories.Memories) {
				c.JSON(400, gin.H{"error": "index out of range"})
				return
			}
			updated := append([]string{}, memories.Memories[:idx]...)
			if idx+1 < len(memories.Memories) {
				updated = append(updated, memories.Memories[idx+1:]...)
			}
			db.Where("google_id = ?", user.GoogleID).Delete(&models.BibiMemories{})
			newMem := models.BibiMemories{GoogleID: user.GoogleID, Memories: pq.StringArray(updated)}
			db.Create(&newMem)
			c.JSON(200, gin.H{"message": "deleted", "memories": updated})
			return
		}

		var memories models.NomaMemories
		if err := db.Where("google_id = ?", user.GoogleID).Order("created_at DESC").First(&memories).Error; err != nil {
			c.JSON(404, gin.H{"error": "no memories found"})
			return
		}
		if idx >= len(memories.Memories) {
			c.JSON(400, gin.H{"error": "index out of range"})
			return
		}
		updated := append([]string{}, memories.Memories[:idx]...)
		if idx+1 < len(memories.Memories) {
			updated = append(updated, memories.Memories[idx+1:]...)
		}
		db.Where("google_id = ?", user.GoogleID).Delete(&models.NomaMemories{})
		newMem := models.NomaMemories{GoogleID: user.GoogleID, Memories: pq.StringArray(updated)}
		db.Create(&newMem)
		c.JSON(200, gin.H{"message": "deleted", "memories": updated})
	}
}

func DeleteChatData(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := c.MustGet("user").(models.GoogleUserInfoDB)

		db.Where("google_id = ?", user.GoogleID).Delete(&models.ChatWithNoma{})
		db.Where("google_id = ?", user.GoogleID).Delete(&models.ChatWithBibi{})
		db.Where("google_id = ?", user.GoogleID).Delete(&models.NomaMemories{})
		db.Where("google_id = ?", user.GoogleID).Delete(&models.BibiMemories{})

		c.JSON(200, gin.H{"message": "Chat data deleted successfully"})
	}
}

func DeleteHabit(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := c.MustGet("user").(models.GoogleUserInfoDB)

		weekday := c.Query("weekday")
		habitIndex := c.Query("habit_index")

		if weekday == "" || habitIndex == "" {
			c.JSON(400, gin.H{"error": "weekday and habit_index are required"})
			return
		}

		idx := -1
		if n, err := fmt.Sscanf(habitIndex, "%d", &idx); n != 1 || err != nil || idx < 0 {
			c.JSON(400, gin.H{"error": "invalid habit_index"})
			return
		}

		var memories models.NomaMemories
		if err := db.Where("google_id = ?", user.GoogleID).First(&memories).Error; err != nil {
			c.JSON(404, gin.H{"error": "no memories found"})
			return
		}

		var updatedMemories []string
		habitFound := false

		for _, memory := range memories.Memories {
			if strings.HasPrefix(memory, "habits:") {
				habitsStr := strings.TrimPrefix(memory, "habits:")
				var habitsArray []map[string]interface{}

				if err := json.Unmarshal([]byte(habitsStr), &habitsArray); err == nil {
					for i, habitDay := range habitsArray {
						if habitDay["weekday"] == weekday {
							if habits, ok := habitDay["habits"].([]interface{}); ok {
								if idx < len(habits) {
									newHabits := append(habits[:idx], habits[idx+1:]...)
									habitsArray[i]["habits"] = newHabits
									habitFound = true

									if len(newHabits) == 0 {
										habitsArray = append(habitsArray[:i], habitsArray[i+1:]...)
									}
									break
								}
							}
						}
					}

					if len(habitsArray) > 0 {
						if updatedHabitsJSON, err := json.Marshal(habitsArray); err == nil {
							updatedMemories = append(updatedMemories, "habits:"+string(updatedHabitsJSON))
						}
					}
				} else {
					updatedMemories = append(updatedMemories, memory)
				}
			} else {
				updatedMemories = append(updatedMemories, memory)
			}
		}

		if !habitFound {
			c.JSON(404, gin.H{"error": "habit not found"})
			return
		}

		if err := db.Model(&memories).Where("google_id = ?", user.GoogleID).Update("memories", pq.StringArray(updatedMemories)).Error; err != nil {
			c.JSON(500, gin.H{"error": "failed to update habits"})
			return
		}

		c.JSON(200, gin.H{"message": "habit deleted successfully"})
	}
}
