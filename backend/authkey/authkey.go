package authkey

import (
	"log"
	"time"

	"github.com/3k4/hjans-backend/dbman"
	"github.com/3k4/hjans-backend/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

//true パスワード認証成功
func passwordCheck(hashed string, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashed), []byte(password))
	if err == nil {
		return true
	} else {
		return false
	}
}

//bool password うまく行ったか true パスワード認証成功
func LoginAndRegistAuthKey(db *gorm.DB, did string, password string) (string, bool) {
	var authkey string

	nkey, err := dbman.MakeRandomStr(50)
	if err != nil {
		log.Println("Error! Cannnot login")
	}

	var owner models.User

	db.Where("D_ID = ?", did).First(&owner)

	if passwordCheck(owner.Password, password) {
		/*=====================
		   Regist Authkey!!!!
		======================*/
		var limit_time = time.Now()
		limit_time.Add(models.AuthKeyTimeLimitHour * time.Hour)

		authkeystruct := models.AuthKey{
			UID:       owner.ID,
			Key:       nkey,
			TimeLimit: limit_time,
		}

		//Regist to db
		db.Create(&authkeystruct)

		authkey = authkeystruct.Key

		log.Println("Someuser logined.")

		return authkey, true
	} else {
		return "", false
	}
}

//true:あってること確認できました
func CheckKey(db *gorm.DB, did string, key string) bool {
	var nauthkey models.AuthKey
	var user models.User
	currenttime := time.Now()

	db.Where("Key = ?", key).First(&nauthkey)
	db.Where("D_ID = ?", did).First(&user)

	//ユーザーのデータが正しく入っているか（これをかくにんしないと本当にユーザーあるのかわからｎ
	if user.DID != "" {
		if nauthkey.UID == user.ID {
			if currenttime.After(nauthkey.TimeLimit) {
				return true
			} else {
				return false
			}
		} else {
			return false
		}
	} else {
		return false
	}
}
