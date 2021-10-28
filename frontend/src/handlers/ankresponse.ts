export interface AnkResponse {
    ankid: string,
    title: string,
    isallowview: boolean,
    isfreetextank: boolean
}

export interface AnkChoiceResponse {
    title: string,
    ankid: string,
    choiceid: string,
}

export interface AnkFTResponse {
    ankid: string,
    radioname: string,
    text: string
}

export interface  AnkVoteResponse {
    choiceid: string
}

export interface HowManyVoteResponse {
    count: number
}