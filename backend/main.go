package main

import (
	"backend/config"
	"backend/models"
	"backend/routes"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	gormDB, err := config.InitDB()
	if err != nil {
		log.Fatal(err)
	}

	gormDB.AutoMigrate(&models.ChatWithNoma{}, &models.ChatWithBibi{}, &models.NomaMemories{}, &models.BibiMemories{}, &models.SessionToken{}, &models.GoogleUserInfoDB{}, &models.Qrcode{}, &models.TransactionHistory{})
	r := gin.Default()
	r.Static("/uploads", "./uploads")
	r.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			if origin == "http://localhost:3000" {
				return true
			}
			if origin == "https://bibinoma.com" || origin == "https://www.bibinoma.com" {
				return true
			}
			if origin == "https://glanke.com" || origin == "https://www.glanke.com" {
				return true
			}
			return false
		},
		AllowMethods:     []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))
	r.Use(config.SetupSession("example-session-secret-key"))

	routes.UserRoutes(r, gormDB)
	r.Run()
}
