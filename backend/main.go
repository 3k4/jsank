package main

import (
	"flag"
	"fmt"
	"log"
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
	var rdata models.AnkRequest
	var ndata models.Ank
	if err := c.BindJSON(&rdata); err != nil {
		log.Println("Error! at makeAnk")
		c.String(500, "error!")

		return
	}

	//Check login
	if authkey.CheckKey(db, rdata.DID, rdata.Key) {
		ankid, err := dbman.MakeRandomStr(10)
		if err != nil {
			log.Println("Error! at makeAnk")
			c.String(500, "error!")

			return
		}

		var gdata = models.Ank{
			AnkID:         ankid,
			Title:         rdata.Title,
			IsFreeTextAnk: rdata.IsFreeTextAnk,
			IsAllowView:   rdata.IsAllowView,
		}

		db.Create(&gdata).First(&ndata)

		c.String(200, gdata.AnkID)

		return
	} else {
		c.String(401, "please, login")
	}
}

func makeAnkChoice(c *gin.Context) {
	var rdata models.ChoiceAnkChoiceRequest
	if err := c.BindJSON(&rdata); err != nil {
		log.Println("Error! at makeAnkChoice")
		c.JSON(500, gin.H{
			"details": "error!",
		})

		return
	}

	if authkey.CheckKey(db, rdata.DID, rdata.Key) {

		choiceid, err := dbman.MakeRandomStr(10)
		if err != nil {
			c.String(500, "server error")
			return
		}

		var ndata = models.ChoiceAnkChoice{
			Title:    rdata.Title,
			AID:      rdata.AnkID,
			ChoiceID: choiceid,
		}

		db.Create(&ndata)

		c.JSON(200, gin.H{
			"details": "success",
		})
	} else {
		c.String(401, "please, login")
	}
}

func getAnks(c *gin.Context) {
	//認証不要
	var anks []models.Ank

	if err := db.Find(&anks).Error; err != nil {
		c.String(500, "cannot find")
		return
	}

	c.JSON(200, anks)
}

func getAnk(c *gin.Context) {
	//認証不要
	var ank models.Ank

	req_ank_id := c.Query("ankid")
	if req_ank_id != "" {
		if err := db.Where("ank_id = ?", req_ank_id).First(&ank).Error; err != nil {
			c.JSON(404, "not found")
			return
		}

		c.JSON(200, ank)
	} else {
		c.String(400, "bad request")
	}
}

func getChoices(c *gin.Context) {
	//認証不要
	var choices []models.ChoiceAnkChoice

	req_ank_id := c.Query("ankid")
	if req_ank_id != "" {
		if err := db.Where("a_id = ?", req_ank_id).Find(&choices).Error; err != nil {
			c.JSON(404, "not found")
			return
		}

		c.JSON(200, choices)
	} else {
		c.String(400, "bad request")
	}
}

func vote(c *gin.Context) {
	//認証不要
	var votehyo models.ChoiceAnkVote
	var req_c models.ChoiceAnkVote
	err := c.BindJSON(&req_c)

	if err == nil {
		votehyo.CID = req_c.CID
		db.Create(&votehyo)

		c.JSON(200, gin.H{
			"details": "success",
		})
		return
	} else {
		c.String(400, "bad request")
		return
	}
}

func howManyVote(c *gin.Context) {
	//認証不要 /?choiceid=
	var count int64
	req_cid := c.Query("choiceid")
	if req_cid != "" {
		db.Model(&models.ChoiceAnkVote{}).Where("c_id = ?", req_cid).Count(&count)

		c.JSON(200, gin.H{
			"count": count,
		})
	} else {
		c.String(400, "bad request")
		return
	}
}

func ftVote(c *gin.Context) {
	//認証不要
	var ftdata models.AnkFT

	err := c.BindJSON(&ftdata)
	if err == nil {
		if err := db.Create(&ftdata).Error; err != nil {
			c.String(500, "bad request")
			return
		}

		c.JSON(200, gin.H{
			"details": "success",
		})
		return
	} else {
		c.String(400, "bad request")
		return
	}
}

func getFTVote(c *gin.Context) {
	//認証不要
	var fts = []models.AnkFT{}

	req_aid := c.Query("ankid")
	if req_aid != "" {
		if err := db.Find(&fts).Error; err != nil {
			c.String(500, "server error")
			return
		}

		c.JSON(200, fts)
	} else {
		c.String(400, "bad request")
		return
	}
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
		//Return AuthKey
		c.JSON(200, gin.H{
			"authkey": authkey,
			"did":     userRequest.DID,
		})
	} else {
		c.String(401, "Cannot login")

		return
	}
}

func isLoginedMe(c *gin.Context) {
	if isLogined(c) {
		c.JSON(200, gin.H{
			"details": "yes",
		})
	} else {
		c.JSON(401, gin.H{
			"details": "no",
		})
	}
}

func isLogined(c *gin.Context) bool {
	var data models.AuthkeyRequest

	if err := c.BindJSON(&data); err != nil {
		return false
	}

	if authkey.CheckKey(db, data.DID, data.Key) {
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
				"http://192.168.2.101:3000",
			},
			// アクセスを許可したいHTTPメソッド(以下の例だとPUTやDELETEはアクセスできません)
			AllowMethods: []string{
				"POST",
				"GET",
				"HEAD",
			},
			// 許可したいHTTPリクエストヘッダ
			AllowHeaders: []string{
				"Origin",
				"Content-Type",
			},
			AllowCredentials: false,
			MaxAge:           1 * time.Hour,
		}))

		r.POST("/login", login)
		r.POST("/login/check", isLoginedMe)
		//Ank
		r.GET("/anks", getAnks)
		r.GET("/ank", getAnk)
		r.GET("/vote", howManyVote)
		r.POST("/vote", vote)
		r.GET("/ank/choices", getChoices)
		r.POST("/createank", makeAnk)
		r.POST("/createank/choice", makeAnkChoice)
		r.GET("/freetext", getFTVote)
		r.POST("/freetext", ftVote)
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
