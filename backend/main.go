package main

import (
	"flag"
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/3k4/hjans-backend/authkey"
	"github.com/3k4/hjans-backend/dbman"
	"github.com/3k4/hjans-backend/models"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Pub Variables

var db *gorm.DB

//ChoiceAnk
func makeAnk(c *gin.Context) {
	if isLogined(c) {
		var data models.Choiceank
		var ndata models.Choiceank
		if err := c.BindJSON(&data); err != nil {
			log.Println("Error! at makeAnk")
			c.JSON(500, gin.H{
				"details": "error!",
			})

			return
		}

		db.Create(&data).First(&ndata)

		c.String(200, strconv.FormatUint(ndata.ID, 10))

		return
	}
}

func makeAnkChoice(c *gin.Context) {
	var data models.ChoiceAnkChoice
	if err := c.BindJSON(&data); err != nil {
		log.Println("Error! at makeAnkChoice")
		c.JSON(500, gin.H{
			"details": "error!",
		})

		return
	}

	db.Create(&data)

	c.JSON(200, gin.H{
		"details": "success",
	})
}

func getAnk(c *gin.Context) {
	//
}

//Auth
func login(c *gin.Context) {
	var userRequest models.LoginUserRequest

	if err := c.BindJSON(&userRequest); err != nil {
		log.Println("Error! at login")
		c.JSON(500, gin.H{
			"details": "error!",
		})
	}

	authkey, ok := authkey.LoginAndRegistAuthKey(db, userRequest.DID, userRequest.Password)
	if ok {
		//Save to cookie
		c.SetCookie(models.AuthKeySaveCookieKeyName, authkey, models.AuthKeyTimeLimitHour*60, "/", models.Domain, true, true)
		c.SetCookie(models.AuthKeySaveCookieKeyName, userRequest.DID, models.AuthKeyTimeLimitHour*60, "/", models.Domain, true, true)
		c.JSON(200, gin.H{
			"details": "done",
			"authkey": authkey,
			"did":     userRequest.DID,
		})
	} else {
		c.JSON(401, gin.H{
			"details": "cannot login",
		})

		return
	}
}

func isLoginedMe(c *gin.Context) {
	if isLogined(c) {
		c.JSON(200, gin.H{
			"details": "yes",
		})
	}
}

func isLogined(c *gin.Context) bool {
	//Cookieから情報を出す
	nauthkey, err := c.Cookie(models.AuthKeySaveCookieKeyName)
	if err != nil {
		log.Println("Error! at isLogined")
		c.JSON(500, gin.H{
			"details": "error!",
		})

		return false
	}

	did, err := c.Cookie(models.UserNameSaveCookieKeyName)
	if err != nil {
		log.Println("Error! at isLogined")
		c.JSON(500, gin.H{
			"details": "error!",
		})

		return false
	}

	if authkey.CheckKey(db, did, nauthkey) {
		return true
	} else {
		return false
	}
}

func main() {
	flag.Parse()
	mode := flag.Arg(0)

	//init db
	db = dbman.Conn()

	if mode == "server" {
		r := gin.Default()

		r.Use(cors.New(cors.Config{
			// アクセスを許可したいアクセス元
			AllowOrigins: []string{
				"https://jsank.3k4.org",
				"http://localhost:3000",
			},
			// アクセスを許可したいHTTPメソッド(以下の例だとPUTやDELETEはアクセスできません)
			AllowMethods: []string{
				"POST",
				"GET",
			},
			// 許可したいHTTPリクエストヘッダ
			AllowHeaders: []string{
				"Access-Control-Allow-Credentials",
				"Access-Control-Allow-Headers",
				"Content-Type",
				"Content-Length",
				"Accept-Encoding",
				"Authorization",
			},
			// cookieなどの情報を必要とするかどうか
			AllowCredentials: true,
			// preflightリクエストの結果をキャッシュする時間
			MaxAge: 1 * time.Hour,
		}))

		r.POST("/login", login)
		r.GET("/login", isLoginedMe)
		//ChoiceAnk
		r.GET("/choiceank", getAnk)
		r.POST("/createchoiceank", makeAnk)
		r.POST("/createchoiceankchoice", makeAnkChoice)
		r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
	} else if mode == "migrate" {
		var yn string
		fmt.Scan(&yn)

		if yn == "Y" {
			dbman.MigrateAll(db)
		}
	} else if mode == "adduser" {
		var did string
		var name string
		var password string

		fmt.Print("Display ID > ")
		fmt.Scan(&did)
		fmt.Print("Name > ")
		fmt.Scan(&name)
		fmt.Print("Password > ")
		fmt.Scan(&password)

		dbman.AddUser(db, name, did, password)
	} else {
		fmt.Println("Unknown command.")
	}
}
