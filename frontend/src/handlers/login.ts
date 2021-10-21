import axios from "axios"

import { APIAddress } from "../components/tools/info"

export function DoLogin(did: string, password: string) {
    console.log("login")

    axios.post<string>(APIAddress() + "/createchoiceank",  {
        did: did,
        password: password
    }).then((res) => {
        if (res.status != 200) {
            window.alert("正常にログインできなかった可能性があります")
        }
    })
}