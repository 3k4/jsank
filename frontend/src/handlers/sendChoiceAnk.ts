import axios, { Axios } from "axios";

import { APIAddress, AuthkeyCookieName, UserDIDCookieName } from "../components/tools/info";
import { Notify } from "../components/tools/notifagation";
import { GetCookies } from "./cookies";

export function SendData(title: string, choiceslist: string) {
    const cookies = GetCookies()

    if (title != "") {
        if (choiceslist != "") {
            var parentID: string;

            axios.post<string>(APIAddress() + "/createank",  {
                authkey: cookies[AuthkeyCookieName],
                did: cookies[UserDIDCookieName],
                //
                title: title,
                isallowview: true,
                isfreetextank: false,
            }).then((res) => {
                parentID = res.data

                //選択肢を追加
                const choices = choiceslist.split(",")
                choices.forEach((c: string) => {
                    axios.post<string>(APIAddress() + "/createank/choice",  {
                        authkey: cookies[AuthkeyCookieName],
                        did: cookies[UserDIDCookieName],
                        //
                        title: c,
                        ankid: parentID
                    }).catch((error) => {
                        if (error.response) {
                            Notify("アンケート選択肢作成時エラー　サーバーからの応答:" + error.response)
                            return
                        } else {
                            Notify("アンケート選択肢作成時エラー")
                            return
                        }
                    })

                    Notify("選択肢アンケート、正常に登録しました")
                })
            }).catch((error) => {
                if (error.response) {
                    Notify("アンケート作成時エラー　サーバーからの応答:" + error.response.data)
                    return
                } else {
                    Notify("アンケート作成時エラー")
                    return
                }
            })
        } else {
            axios.post<string>(APIAddress() + "/createank",  {
                authkey: cookies[AuthkeyCookieName],
                did: cookies[UserDIDCookieName],
                //
                title: title,
                isallowview: true,
                isfreetextank: true,
            }).catch((error) => {
                if (error.response) {
                    Notify("アンケート作成時エラー　サーバーからの応答:" + error.response)
                    return
                } else {
                    Notify("アンケート作成時エラー")
                    return
                }
            })

            Notify("フリーテキストアンケート、正常に登録しました")
        }
    
    } else {
        Notify("タイトル空やねんな")
    }
    
}