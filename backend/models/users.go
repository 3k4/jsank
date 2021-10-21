package models

type User struct {
	ID       uint64
	Name     string `json:"name"`
	DID      string `json:"did"`
	Password string `json:"string"`
}

type LoginUserRequest struct {
	DID      string `json:"did"`
	Password string `json:"password"`
}
