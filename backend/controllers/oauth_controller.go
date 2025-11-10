package controllers

import (
	"backend/models"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"gorm.io/gorm"
)

var (
	googleOauthConfig = &oauth2.Config{
		RedirectURL:  "https://bibinoma.com/oauth2/callback",
		ClientID:     "example-client-id.apps.googleusercontent.com",
		ClientSecret: "example-client-secret",
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}
)

func generateState() string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}

func GoogleLogin() gin.HandlerFunc {
	return func(c *gin.Context) {
		state := generateState()
		session := sessions.Default(c)
		session.Set("oauth_state", state)
		session.Save()
		http.SetCookie(c.Writer, &http.Cookie{
			Name:     "oauth_state",
			Value:    state,
			Path:     "/",
			MaxAge:   300,
			HttpOnly: true,
			Secure:   false,
			SameSite: http.SameSiteLaxMode,
		})
		url := googleOauthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)
		c.Redirect(http.StatusTemporaryRedirect, url)
	}
}

func GoogleCallback(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		code := c.Query("code")
		state := c.Query("state")
		session := sessions.Default(c)
		storedState := session.Get("oauth_state")
		_ = storedState
		cookieState := ""
		if cookie, err := c.Request.Cookie("oauth_state"); err == nil {
			cookieState = cookie.Value
		}
		storedStateStr := ""
		if storedState != nil {
			storedStateStr = fmt.Sprint(storedState)
		}
		if state != "" {
			if state != storedStateStr && state != cookieState {
				c.Redirect(http.StatusTemporaryRedirect, "https://bibinoma.com/auth/login?error=invalid_state")
				return
			}
		} else {
			if cookieState == "" {
			}
		}
		token, err := googleOauthConfig.Exchange(oauth2.NoContext, code)
		if err != nil {
			c.Redirect(http.StatusTemporaryRedirect, "https://bibinoma.com/auth/login?error=token_exchange_failed")
			return
		}
		userInfo, err := getUserInfoFromGoogle(token.AccessToken)
		if err != nil {
			c.Redirect(http.StatusTemporaryRedirect, "https://bibinoma.com/auth/login?error=user_info_failed")
			return
		}
		var existingGoogleUser models.GoogleUserInfoDB
		err = db.Where("google_id = ?", userInfo.ID).First(&existingGoogleUser).Error
		if err == gorm.ErrRecordNotFound {
			googleUserInfo := models.GoogleUserInfoDB{
				GoogleID:  userInfo.ID,
				Email:     userInfo.Email,
				Name:      userInfo.Name,
				Money:     20000,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			}
			if err := db.Create(&googleUserInfo).Error; err != nil {
				c.Redirect(http.StatusTemporaryRedirect, "https://bibinoma.com/auth/login?error=user_creation_failed")
				return
			}
			session.Set("user_id", googleUserInfo.ID)
		} else if err != nil {
			c.Redirect(http.StatusTemporaryRedirect, "https://bibinoma.com/auth/login?error=database_error")
			return
		} else {
			session.Set("user_id", existingGoogleUser.ID)
		}
		tokenIDBytes := make([]byte, 16)
		_, _ = rand.Read(tokenIDBytes)
		tokenID := hex.EncodeToString(tokenIDBytes)

		var uidInt int
		if session.Get("user_id") != nil {
			uidInt = session.Get("user_id").(int)
		}

		userAgent := c.Request.UserAgent()
		ip := c.ClientIP()

		db.Create(&models.SessionToken{UserID: uidInt, TokenID: tokenID, UserAgent: userAgent, IP: ip, CreatedAt: time.Now()})
		session.Set("token_id", tokenID)

		if err := session.Save(); err != nil {
			c.Redirect(http.StatusTemporaryRedirect, "https://bibinoma.com/auth/login?error=session_failed")
			return
		}
		session.Delete("oauth_state")
		session.Save()
		http.SetCookie(c.Writer, &http.Cookie{
			Name:     "oauth_state",
			Value:    "",
			Path:     "/",
			MaxAge:   -1,
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteLaxMode,
		})
		c.Redirect(http.StatusTemporaryRedirect, "https://bibinoma.com/")
	}
}

func getUserInfoFromGoogle(accessToken string) (*models.GoogleUserInfo, error) {
	resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + accessToken)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	var userInfo models.GoogleUserInfo
	err = json.Unmarshal(body, &userInfo)
	if err != nil {
		return nil, err
	}
	return &userInfo, nil
}
