package models

import (
	"time"

	"github.com/lib/pq"
)

type ChatWithNoma struct {
	ID         uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	GoogleID   string    `json:"google_id" gorm:"column:google_id;not null"`
	CreatedAt  time.Time `json:"created_at" gorm:"column:created_at"`
	BotCipher  []byte    `json:"-" gorm:"column:bot_cipher;type:bytea"`
	BotIV      []byte    `json:"-" gorm:"column:bot_iv;type:bytea"`
	UserCipher []byte    `json:"-" gorm:"column:user_cipher;type:bytea"`
	UserIV     []byte    `json:"-" gorm:"column:user_iv;type:bytea"`
	KeyVersion string    `json:"key_version" gorm:"column:key_version"`
	CreatedBy  string    `json:"created_by" gorm:"column:created_by"`
}

func (ChatWithNoma) TableName() string {
	return "chat_with_noma"
}

type ChatWithBibi struct {
	ID         uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	GoogleID   string    `json:"google_id" gorm:"column:google_id;not null"`
	CreatedAt  time.Time `json:"created_at" gorm:"column:created_at"`
	BotCipher  []byte    `json:"-" gorm:"column:bot_cipher;type:bytea"`
	BotIV      []byte    `json:"-" gorm:"column:bot_iv;type:bytea"`
	UserCipher []byte    `json:"-" gorm:"column:user_cipher;type:bytea"`
	UserIV     []byte    `json:"-" gorm:"column:user_iv;type:bytea"`
	KeyVersion string    `json:"key_version" gorm:"column:key_version"`
	CreatedBy  string    `json:"created_by" gorm:"column:created_by"`
}

func (ChatWithBibi) TableName() string {
	return "chat_with_bibi"
}

type NomaMemories struct {
	GoogleID  string         `json:"google_id" gorm:"column:google_id;primaryKey;not null"`
	Memories  pq.StringArray `json:"memories" gorm:"column:memories;type:text[]"`
	CreatedAt time.Time      `json:"created_at" gorm:"column:created_at"`
	Issue     *string        `json:"issue" gorm:"column:issue"`
	Plans     *string        `json:"plans" gorm:"column:plans;type:text"`
}

func (NomaMemories) TableName() string {
	return "noma_memories"
}

type BibiMemories struct {
	GoogleID  string         `json:"google_id" gorm:"column:google_id;primaryKey;not null"`
	Memories  pq.StringArray `json:"memories" gorm:"column:memories;type:text[]"`
	CreatedAt time.Time      `json:"created_at" gorm:"column:created_at"`
}

func (BibiMemories) TableName() string {
	return "bibi_memories"
}

type ChatMessage struct {
	Role      string `json:"role"`
	Content   string `json:"content"`
	Timestamp string `json:"timestamp,omitempty"`
}

type ChatRequest struct {
	Message     string        `json:"message" binding:"required"`
	Memories    []string      `json:"memories"`
	ChatHistory []ChatMessage `json:"chat_history"`
}

type ChatResponse struct {
	User     string                 `json:"user"`
	Noma     string                 `json:"noma"`
	Memories map[string]interface{} `json:"memories"`
}
