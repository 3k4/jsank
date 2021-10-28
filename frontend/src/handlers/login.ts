import axios from "axios"
import { JsxEmit } from "typescript"

import { APIAddress, AuthkeyCookieName, UserDIDCookieName } from "../components/tools/info"
import { Notify } from "../components/tools/notifagation"
import { AddCookie, GetCookies } from "./cookies"

export interface LoginRequest {
    authkey: string,
    did: string
}

export function Logined(): boolean {
    if (document.cookie) {
        const cookies = GetCookies()

        axios.post(APIAddress() + "/login/check", {
            authkey: cookies[AuthkeyCookieName],
            did: cookies[UserDIDCookieName]
        }).catch(() => {
            return false
        })

        return true
    }
    return false
}

export function DoLoginFromForm() {
    const didf = <HTMLInputElement>document.getElementById("did")
    const pwdf = <HTMLInputElement>document.getElementById("password")

    DoLogin(didf.value, pwdf.value)
}

export function DoLogin(did: string, password: string) {
    console.log("login")

    axios.post<LoginRequest>(APIAddress() + "/login",  {
        did: did,
        password: password
    }).then((res) => {
        AddCookie(AuthkeyCookieName, res.data.authkey)
        AddCookie(UserDIDCookieName, res.data.did)
        Notify("ログインしました.")
        return
    }).catch((err) => {
        Notify("ログインできない")
        return
    })
}