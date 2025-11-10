package routes

import (
	"backend/controllers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func UserRoutes(r *gin.Engine, db *gorm.DB) {
	v1 := r.Group("/api/v1")

	auth := v1.Group("/auth")
	{
		auth.POST("/logout", controllers.Logout(db))
		auth.POST("/logout-all", controllers.AuthRequired(db), controllers.LogoutAll(db))
		auth.GET("/status", controllers.CheckAuth())
	}
	payment := v1.Group("/payment")
	{
		payment.POST("/create", controllers.AuthRequired(db), controllers.Payment(db))
		payment.POST("/webhook", controllers.Webhook(db))
	}
	user := v1.Group("/user")
	{
		user.GET("/info", controllers.AuthRequired(db), controllers.My_Info(db))
	}
	chat := v1.Group("/chat")
	{
		chat.POST("/noma", controllers.AuthRequired(db), controllers.ChatWithNoma(db))
		chat.POST("/bibi", controllers.AuthRequired(db), controllers.ChatWithBibi(db))
		chat.GET("/history", controllers.AuthRequired(db), controllers.GetChatHistory(db))
		chat.GET("/memories", controllers.AuthRequired(db), controllers.GetMemories(db))
		chat.DELETE("/memory", controllers.AuthRequired(db), controllers.DeleteMemory(db))
		chat.DELETE("/habit", controllers.AuthRequired(db), controllers.DeleteHabit(db))
		chat.DELETE("/data", controllers.AuthRequired(db), controllers.DeleteChatData(db))
		chat.DELETE("/bibi-data", controllers.AuthRequired(db), controllers.DeleteBibiData(db))
		chat.DELETE("/noma-data", controllers.AuthRequired(db), controllers.DeleteNomaData(db))
		chat.POST("/new-day-prompt", controllers.AuthRequired(db), controllers.SaveNewDayPrompt(db))
	}
	oauth := r.Group("/oauth2")
	{
		oauth.GET("/login", controllers.GoogleLogin())
		oauth.GET("/callback", controllers.GoogleCallback(db))
	}
}
