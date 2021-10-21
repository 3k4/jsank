import axios from "axios"

import { APIAddress } from "../components/tools/info"

export function DoLoginFromForm() {
    const didf = <HTMLInputElement>document.getElementById("did")
    const pwdf = <HTMLInputElement>document.getElementById("password")

    DoLogin(didf.value, pwdf.value)
}

export function DoLogin(did: string, password: string) {
    console.log("login")

    axios.post<string>(APIAddress() + "/login",  {
        did: did,
        password: password
    }).then((res) => {
        if (res.status != 200) {
            window.alert("正常にログインできなかった可能性があります")
        }
    })
}