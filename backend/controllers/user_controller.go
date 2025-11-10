package controllers

import (
	"backend/models"
	"net/http"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AuthRequired(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		uid := session.Get("user_id")
		tokenID := session.Get("token_id")
		if uid == nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Login please"})
			return
		}
		if tokenID == nil {
			session.Clear()
			session.Save()
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Invalid session"})
			return
		}
		var user models.GoogleUserInfoDB
		if err := db.First(&user, uid.(int)).Error; err != nil {
			session.Clear()
			session.Save()
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Session isn't accepted"})
			return
		}
		var token models.SessionToken
		if err := db.Where("user_id = ? AND token_id = ? AND revoked_at IS NULL", uid.(int), tokenID.(string)).First(&token).Error; err != nil {
			session.Clear()
			session.Save()
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Session expired"})
			return
		}
		c.Set("user", user)
		c.Next()
	}
}

func My_Info(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := c.MustGet("user").(models.GoogleUserInfoDB)
		c.JSON(http.StatusOK, gin.H{
			"username": user.Name,
			"email":    user.Email,
			"money":    user.Money,
		})
	}
}

func CheckAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		uid := session.Get("user_id")
		if uid == nil {
			c.Status(http.StatusUnauthorized)
			return
		}
		c.Status(http.StatusOK)
	}
}
func Logout(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		tokenID := session.Get("token_id")
		uid := session.Get("user_id")
		session.Clear()
		session.Options(sessions.Options{
			Path:     "/",
			MaxAge:   -1,
			HttpOnly: true,
			Secure:   false,
			SameSite: http.SameSiteLaxMode,
		})
		session.Save()
		if db != nil && tokenID != nil && uid != nil {
			now := time.Now()
			db.Model(&models.SessionToken{}).Where("user_id = ? AND token_id = ?", uid.(int), tokenID.(string)).Update("revoked_at", now)
		}
		c.SetCookie("mysession", "", -1, "/", "localhost", false, true)

		c.Status(http.StatusOK)
	}
}

func LogoutAll(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		uid := session.Get("user_id")
		if uid == nil {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		now := time.Now()
		db.Model(&models.SessionToken{}).Where("user_id = ? AND revoked_at IS NULL", uid.(int)).Update("revoked_at", now)
		session.Clear()
		session.Options(sessions.Options{
			Path:     "/",
			MaxAge:   -1,
			HttpOnly: true,
			Secure:   false,
			SameSite: http.SameSiteLaxMode,
		})
		session.Save()
		c.SetCookie("mysession", "", -1, "/", "localhost", false, true)
		c.Status(http.StatusOK)
	}
}
