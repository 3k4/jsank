import { Link } from "react-router-dom"

import { AdminFrame } from "../../components/admin/frame"

import { SendData } from "../../handlers/sendChoiceAnk"

export function CreateAnk(): JSX.Element {
    return (
        <AdminFrame>
            <h1>アンケートを作成</h1>
            <p>必要事項を入力し開始させてください</p>
            <h2>アンケートのタイトル</h2>
            <input type="text" id="akctitle" />
            <h2>アンケートの選択肢</h2>
            <p>コンマ(,)は使わないでください</p>
            <input type="text" id="akcchoice1" />
            <input type="text" id="akcchoice2" />
            <p onClick={SendData}>ココをクリックして、登録します</p>
        </AdminFrame>
    )
}