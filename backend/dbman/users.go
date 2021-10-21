package dbman

import (
	"log"

	"github.com/3k4/hjans-backend/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func AddUser(db *gorm.DB, name string, did string, password string) {

	hashed, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		log.Fatal("Cannnot create user")
	}

	usr := models.User{
		Name:     name,
		DID:      did,
		Password: string(hashed),
	}

	db.Create(&usr)

	log.Println("Success.")
}
