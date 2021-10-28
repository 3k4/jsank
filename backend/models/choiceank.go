package models

type Ank struct {
	ID            uint64
	AnkID         string `gorm:"unique;" json:"ankid"`
	Title         string `json:"title"`
	IsAllowView   bool   `json:"isallowview"`
	IsFreeTextAnk bool   `json:"isfreetextank"`
}

type AnkRequest struct {
	Title         string `json:"title"`
	IsAllowView   bool   `json:"isallowview"`
	IsFreeTextAnk bool   `json:"isfreetextank"`
	AuthkeyRequest
}

type ChoiceAnkChoice struct {
	Title    string `json:"title"`
	AID      string `json:"ankid"`
	ChoiceID string `gorm:"unique" json:"choiceid"`

	Ank Ank `gorm:"foreignKey:AID;references:AnkID;"`
}

type ChoiceAnkChoiceRequest struct {
	Title string `json:"title"`
	AnkID string `json:"ankid"`
	AuthkeyRequest
}

type ChoiceAnkVote struct {
	CID             string          `json:"choiceid"`
	ChoiceAnkChoice ChoiceAnkChoice `gorm:"foreignKey:CID;references:ChoiceID;"`
}

type AnkFT struct {
	AID       string `json:"ankid"`
	RadioName string `gorm:"not null;" json:"radioname"`
	Text      string `gorm:"not null;" json:"text"`
	Ank       Ank    `gorm:"foreignKey:AID;references:AnkID;"`
}
