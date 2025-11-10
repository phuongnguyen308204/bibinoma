package models

import "time"

type PayosRequest struct {
	OrderCode   int64  `json:"orderCode"`
	Amount      int    `json:"amount"`
	Description string `json:"description"`
	Signature   string `json:"signature"`
	CancelUrl   string `json:"cancelUrl"`
	ReturnUrl   string `json:"returnUrl"`
}

type TransactionHistory struct {
	ID                     uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID                 int       `json:"user_id" gorm:"column:user_id;not null;index"`
	OrderCode              int64     `json:"order_code" gorm:"column:order_code;not null;unique"`
	Amount                 int64     `json:"amount" gorm:"column:amount;not null"`
	Description            string    `json:"description" gorm:"column:description"`
	TransactionDateTime    string    `json:"transaction_date_time" gorm:"column:transaction_date_time"`
	VirtualAccountNumber   string    `json:"virtual_account_number" gorm:"column:virtual_account_number"`
	CounterAccountBankId   string    `json:"counter_account_bank_id" gorm:"column:counter_account_bank_id"`
	CounterAccountBankName string    `json:"counter_account_bank_name" gorm:"column:counter_account_bank_name"`
	CounterAccountName     string    `json:"counter_account_name" gorm:"column:counter_account_name"`
	CounterAccountNumber   string    `json:"counter_account_number" gorm:"column:counter_account_number"`
	VirtualAccountName     string    `json:"virtual_account_name" gorm:"column:virtual_account_name"`
	Currency               string    `json:"currency" gorm:"column:currency"`
	PaymentLinkId          string    `json:"payment_link_id" gorm:"column:payment_link_id"`
	Code                   string    `json:"code" gorm:"column:code"`
	Desc                   string    `json:"desc" gorm:"column:desc"`
	CreatedAt              time.Time `json:"created_at" gorm:"column:created_at"`
}

func (TransactionHistory) TableName() string {
	return "transaction_history"
}
