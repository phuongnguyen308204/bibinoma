package controllers

import (
	"backend/models"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net/http"
	"sort"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func convertObjToQueryStr(obj interface{}) (string, error) {
	var m map[string]interface{}
	b, err := json.Marshal(obj)
	if err != nil {
		return "", err
	}
	if err := json.Unmarshal(b, &m); err != nil {
		return "", err
	}

	parts := make([]string, 0, len(m))
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	for _, k := range keys {
		v := m[k]
		valStr, err := valueToString(v)
		if err != nil {
			return "", err
		}
		parts = append(parts, fmt.Sprintf("%s=%s", k, valStr))
	}

	return strings.Join(parts, "&"), nil
}

func valueToString(v interface{}) (string, error) {
	switch vv := v.(type) {
	case nil:
		return "", nil
	case string:
		if vv == "null" || vv == "NULL" {
			return "", nil
		}
		return vv, nil
	case bool:
		return fmt.Sprintf("%v", vv), nil
	case float64:
		if math.Mod(vv, 1) == 0 {
			return fmt.Sprintf("%.0f", vv), nil
		}
		return fmt.Sprintf("%v", vv), nil
	case []interface{}:
		items := make([]string, 0, len(vv))
		for _, item := range vv {
			itemJson, err := marshalSortedJSON(item)
			if err != nil {
				return "", err
			}
			items = append(items, itemJson)
		}
		return "[" + strings.Join(items, ",") + "]", nil
	case map[string]interface{}:
		s, err := marshalSortedJSON(vv)
		if err != nil {
			return "", err
		}
		return s, nil
	default:
		b, err := json.Marshal(vv)
		if err != nil {
			return fmt.Sprintf("%v", vv), nil
		}
		return string(b), nil
	}
}

func marshalSortedJSON(obj interface{}) (string, error) {
	switch v := obj.(type) {
	case nil:
		return "null", nil
	case bool, float64, string:
		b, err := json.Marshal(v)
		if err != nil {
			return "", err
		}
		return string(b), nil
	case map[string]interface{}:
		keys := make([]string, 0, len(v))
		for k := range v {
			keys = append(keys, k)
		}
		sort.Strings(keys)
		parts := make([]string, 0, len(keys))
		for _, k := range keys {
			val := v[k]
			valJson, err := marshalSortedJSON(val)
			if err != nil {
				return "", err
			}
			parts = append(parts, `"`+escapeJSONKey(k)+`:`+valJson)
		}
		return "{" + strings.Join(parts, ",") + "}", nil
	case []interface{}:
		items := make([]string, 0, len(v))
		for _, it := range v {
			itemJson, err := marshalSortedJSON(it)
			if err != nil {
				return "", err
			}
			items = append(items, itemJson)
		}
		return "[" + strings.Join(items, ",") + "]", nil
	default:
		b, err := json.Marshal(v)
		if err != nil {
			return "", err
		}
		return string(b), nil
	}
}

func escapeJSONKey(s string) string {
	b, _ := json.Marshal(s)
	qs := string(b)
	if len(qs) >= 2 && qs[0] == '"' && qs[len(qs)-1] == '"' {
		return qs[1 : len(qs)-1]
	}
	return s
}

func isValidData(data interface{}, signature string, key string) (bool, error) {
	dataQueryStr, err := convertObjToQueryStr(data)
	if err != nil {
		return false, err
	}
	fmt.Println(dataQueryStr)

	h := hmac.New(sha256.New, []byte(key))
	_, _ = h.Write([]byte(dataQueryStr))
	computed := hex.EncodeToString(h.Sum(nil))

	match := hmac.Equal([]byte(computed), []byte(signature))
	return match, nil
}

func Webhook(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		body, err := io.ReadAll(c.Request.Body)
		if err != nil {
			c.Status(http.StatusBadRequest)
			return
		}
		var payload struct {
			Code      string `json:"code"`
			Desc      string `json:"desc"`
			Success   bool   `json:"success"`
			Signature string `json:"signature"`
			Data      struct {
				AccountNumber          string `json:"accountNumber"`
				Amount                 int64  `json:"amount"`
				Description            string `json:"description"`
				Reference              string `json:"reference"`
				TransactionDateTime    string `json:"transactionDateTime"`
				VirtualAccountNumber   string `json:"virtualAccountNumber"`
				CounterAccountBankId   string `json:"counterAccountBankId"`
				CounterAccountBankName string `json:"counterAccountBankName"`
				CounterAccountName     string `json:"counterAccountName"`
				CounterAccountNumber   string `json:"counterAccountNumber"`
				VirtualAccountName     string `json:"virtualAccountName"`
				Currency               string `json:"currency"`
				OrderCode              int64  `json:"orderCode"`
				PaymentLinkId          string `json:"paymentLinkId"`
				Code                   string `json:"code"`
				Desc                   string `json:"desc"`
			} `json:"data"`
		}
		if err := json.Unmarshal(body, &payload); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON"})
			return
		}
		checksumKey := "example-checksum-key"
		isValid, err := isValidData(payload.Data, payload.Signature, checksumKey)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid data"})
			return
		}
		if !isValid {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid signature"})
			return
		}
		if payload.Data.Description == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid description"})
			return
		}
		if payload.Success {
			descriptionParts := strings.Fields(payload.Data.Description)
			var googleID string
			if len(descriptionParts) >= 2 {
				googleID = descriptionParts[1]
			} else {
				googleID = payload.Data.Description
			}

			var user models.GoogleUserInfoDB
			if err := db.Where("google_id = ?", googleID).First(&user).Error; err != nil {
				c.JSON(http.StatusUnauthorized, gin.H{"message": "Error username"})
				return
			}
			if err := db.Model(&models.GoogleUserInfoDB{}).
				Where("id = ?", user.ID).
				UpdateColumn("money", gorm.Expr("money + ?", payload.Data.Amount)).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"message": "failed to update money"})
				return
			}
			if err := db.Where("description = ? AND amount = ?", googleID, int(payload.Data.Amount)).Delete(&models.Qrcode{}).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"message": "delete qrcode failed"})
				return
			}
		}
		c.Status(http.StatusOK)
	}
}
