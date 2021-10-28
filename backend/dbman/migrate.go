package dbman

import (
	"log"

	"github.com/3k4/hjans-backend/models"
	"gorm.io/gorm"
)

func MigrateAll(db *gorm.DB) {
	err := db.AutoMigrate(&models.User{}, &models.ChoiceAnkChoice{}, &models.Ank{}, &models.AuthKey{}, &models.ChoiceAnkVote{}, &models.AnkFT{})
	if err != nil {
		log.Fatal("Cannot migrate")
	}
}
