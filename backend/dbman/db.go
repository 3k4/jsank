package dbman

import (
	"log"

	"github.com/3k4/hjans-backend/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Conn() *gorm.DB {
	dsn := "user=" + models.DB_UserName + " password=" + models.DB_Password + " dbname=" + models.DB_DBName + " port=" + models.DB_PORT + " sslmode=disable TimeZone=Asia/Tokyo"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		//DisableForeignKeyConstraintWhenMigrating: true,
	})

	if err != nil {
		log.Fatal("Cannnot load db")
	}

	return db
}
