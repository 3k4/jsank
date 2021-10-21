package models

type Choiceank struct {
	ID          uint64
	Title       string `json:"title"`
	IsAllowView bool   `json:"isallowview"`
}

type ChoiceAnkChoice struct {
	ID uint64

	Title string `json:"title"`
	AnkID uint   `json:"ankid"`

	Choiceank Choiceank `gorm:"foreignKey:AnkID;references:ID;"`
}
