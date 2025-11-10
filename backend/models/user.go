package models

import (
	"time"
)

type GoogleUserInfo struct {
	ID    string `json:"id"`
	Sub   string `json:"sub"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

type GoogleUserInfoDB struct {
	ID        int       `json:"id" gorm:"column:id;primaryKey;autoIncrement"`
	GoogleID  string    `json:"google_id" gorm:"column:google_id;not null;unique"`
	Email     string    `json:"email" gorm:"column:email;not null"`
	Name      string    `json:"name" gorm:"column:name;not null"`
	Money     int64     `json:"money" gorm:"column:money;not null"`
	CreatedAt time.Time `json:"created_at" gorm:"column:created_at"`
	UpdatedAt time.Time `json:"updated_at" gorm:"column:updated_at"`
}

func (GoogleUserInfoDB) TableName() string {
	return "google_user_info_db"
}

type SessionToken struct {
	ID        uint       `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID    int        `json:"user_id" gorm:"index;not null"`
	TokenID   string     `json:"token_id" gorm:"uniqueIndex;size:64;not null"`
	UserAgent string     `json:"user_agent" gorm:"size:255"`
	IP        string     `json:"ip" gorm:"size:64"`
	CreatedAt time.Time  `json:"created_at"`
	RevokedAt *time.Time `json:"revoked_at"`
}

func (SessionToken) TableName() string {
	return "session_tokens"
}
