package models

import (
	"time"
)

type AuthKey struct {
	ID        uint64
	UID       uint64
	Key       string `gorm:"unique"`
	TimeLimit time.Time
	User      User `gorm:"foreignKey:UID;references:ID;"`
}

type AuthkeyRequest struct {
	Key string `json:"authkey"`
	DID string `json:"did"`
}
