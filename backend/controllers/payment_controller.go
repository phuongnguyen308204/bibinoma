package controllers

import (
	"backend/models"
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Payment(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := c.MustGet("user").(models.GoogleUserInfoDB)
		var payload struct {
			Amount int `json:"amount"`
		}
		if err := c.ShouldBindJSON(&payload); err != nil || payload.Amount <= 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid amount"})
			return
		}

		var existingQrcode models.Qrcode
		if err := db.Where("user_id = ? AND amount = ?", user.ID, payload.Amount).First(&existingQrcode).Error; err == nil {
			c.JSON(http.StatusOK, existingQrcode)
			return
		}
		orderCode := time.Now().Unix()
		amount := payload.Amount
		description := user.GoogleID
		clientID := "example-client-id"
		apiKey := "example-api-key"
		checksumKey := "example-checksum-key"

		if clientID == "" || apiKey == "" || checksumKey == "" {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "missing payos env vars"})
			return
		}

		cancelURL := "https://glanke.com"
		returnURL := "https://glanke.com/ckspro"
		dataString := fmt.Sprintf(
			"amount=%d&cancelUrl=%s&description=%s&orderCode=%d&returnUrl=%s",
			amount,
			cancelURL,
			description,
			orderCode,
			returnURL,
		)

		mac := hmac.New(sha256.New, []byte(checksumKey))
		mac.Write([]byte(dataString))
		signature := hex.EncodeToString(mac.Sum(nil))
		reqPayload := models.PayosRequest{
			OrderCode:   orderCode,
			Amount:      amount,
			Description: description,
			Signature:   signature,
			CancelUrl:   cancelURL,
			ReturnUrl:   returnURL,
		}

		reqBody, _ := json.Marshal(reqPayload)
		req, _ := http.NewRequest("POST", "https://api-merchant.payos.vn/v2/payment-requests", bytes.NewReader(reqBody))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("x-client-id", clientID)
		req.Header.Set("x-api-key", apiKey)

		client := &http.Client{Timeout: 15 * time.Second}
		resp, err := client.Do(req)
		if err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
			return
		}
		defer resp.Body.Close()

		body, _ := io.ReadAll(resp.Body)

		var qrcodeStr string
		var parsed map[string]interface{}
		if err := json.Unmarshal(body, &parsed); err == nil {
			if data, ok := parsed["data"].(map[string]interface{}); ok {
				if v, ok := data["qrcode"].(string); ok {
					qrcodeStr = v
				} else if v, ok := data["qrCode"].(string); ok {
					qrcodeStr = v
				}
			}
		}
		if qrcodeStr == "" {
			qrcodeStr = string(body)
		}

		newQ := models.Qrcode{
			UserID:       int(user.ID),
			QrcodeString: qrcodeStr,
			Description:  description,
			Amount:       amount,
		}
		if err := db.Create(&newQ).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, newQ)
	}
}
