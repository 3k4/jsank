package dbman

import (
	"log"

	"github.com/3k4/hjans-backend/models"
	"gorm.io/gorm"
)

func MigrateAll(db *gorm.DB) {
	err := db.AutoMigrate(&models.User{}, &models.Choiceank{}, &models.ChoiceAnkChoice{}, &models.AuthKey{})
	if err != nil {
		log.Fatal("Cannot migrate")
	}
}
