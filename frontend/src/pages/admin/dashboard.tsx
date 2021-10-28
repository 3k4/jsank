import { useState } from "react"
import { Link } from "react-router-dom"

import { AdminFrame } from "../../components/admin/frame"
import { Logined } from "../../handlers/login"
import { IsMeLogined } from "../../components/tools/checklogin"
import axios from "axios"
import { APIAddress, AuthkeyCookieName, UserDIDCookieName } from "../../components/tools/info"
import { Notify } from "../../components/tools/notifagation"
import { useEffect } from "react"
import { AnkResponse } from "../../handlers/ankresponse"
function IsLoginedSwitch(): JSX.Element {
    if (!Logined()) {
        return (
            <li>
                <Link to="/adm/login">ログイン処理</Link>
            </li>
        )
    }

    return (
        <>
            <li>
                    <Link to="/adm/createank">アンケートを作成</Link>
            </li>
        </>
    )
}

export function Dashboard(): JSX.Element {

    const [list, setList] = useState<JSX.Element[]>([])

    async function AnkList() {
        try {
            const responses = await axios.get<AnkResponse[]>(APIAddress() + "/anks");
            if (responses.data) {
                const resplist: JSX.Element[] = []

                responses.data.forEach((resp) => {
                    let link = ""
                    if (resp.isfreetextank) {
                        link = "/adm/checkankft/" + resp.ankid
                    } else {
                        link = "/adm/checkank/" + resp.ankid
                    }
                    resplist.push(<li><Link to={link}>{resp.title} ({resp.ankid})</Link></li>)
                })

                setList(resplist)
            }
        } catch {
            Notify("一覧をうまく取得できません")
        }
    }

    useEffect(() => {
        AnkList();
    }, [null])

    return (
        <AdminFrame>
            <IsMeLogined />
            <h1>ダッシュボード</h1>
            <h2>現在開始中のアンケート</h2>
            {list}
            <h2>操作</h2>
            <ul>
                <IsLoginedSwitch />
            </ul>
        </AdminFrame>
    )
}