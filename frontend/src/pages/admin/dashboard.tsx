import { Link } from "react-router-dom"

import { AdminFrame } from "../../components/admin/frame"

export function Dashboard(): JSX.Element {
    return (
        <AdminFrame>
            <h1>ダッシュボード</h1>
            <h2>現在開始中のアンケート</h2>
            <p>何も表示されとらんかったらなんもないよ</p>
            <h2>操作</h2>
            <ul>
                <li>
                    <Link to="/adm/createank">ログイン処理</Link>
                    <Link to="/adm/createank">アンケートを作成</Link>
                </li>
            </ul>
        </AdminFrame>
    )
}