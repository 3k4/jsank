import axios from "axios"
import { useEffect } from "react"

import { Notify } from "./notifagation"
import { Logined } from "../../handlers/login"

export function IsMeLogined(): JSX.Element {
    useEffect(() => {
        if (!Logined()) {
            Notify("ログインしていません")
        }
    })

    return (
        <>
        </>
    )
}