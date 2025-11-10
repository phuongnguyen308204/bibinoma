package models

type Qrcode struct {
	ID           int    `json:"id" gorm:"column:id"`
	UserID       int    `json:"user_id" gorm:"column:user_id"`
	QrcodeString string `json:"qrcode" gorm:"column:qrcode"`
	Description  string `json:"description" gorm:"column:description"`
	Amount       int    `json:"amount" gorm:"column:amount"`
}

func (Qrcode) TableName() string {
	return "qr_codes"
}
