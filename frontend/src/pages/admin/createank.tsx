import { useRef } from "react"
import { Link } from "react-router-dom"

import { AdminFrame } from "../../components/admin/frame"
import { SendData } from "../../handlers/sendChoiceAnk"
import { IsMeLogined } from "../../components/tools/checklogin"
import { Notify } from "../../components/tools/notifagation"

export function CreateAnk(): JSX.Element {

    const AnkTitle = useRef<HTMLInputElement>(null)
    const AnkChoices = useRef<HTMLInputElement>(null)

    return (
        <AdminFrame>
            <IsMeLogined />
            <h1>アンケートを作成</h1>
            <p>必要事項を入力し開始させてください</p>
            <h2>アンケートのタイトル</h2>
            <p>あんまり長いのは...</p>
            <input type="text" ref={AnkTitle} id="akctitle" />
            <h2>アンケートの選択肢</h2>
            <p>いくつでもどうぞ。コンマ(,)を使って、区切ります。(例: 選択肢1,選択肢2 ) 空白にするとフリーテキストで回答のアンケートになります</p>
            <input type="text" ref={AnkChoices} placeholder="選択肢1,選択肢2,選択肢3" id="akcs" />
            <h2>その他オプション</h2>
            <label>
                <input type="checkbox" name="一回のみ" id="a" />
                <span>
                1回のみの投票
                </span>
            </label>
            <label>
                <input type="checkbox" name="一回のみ" id="a" />
                <span>
                再投票不可
                </span>
            </label>
            <label>
                <input type="checkbox" name="一回のみ" id="a" />
                <span>
                予約
                </span>
            </label>
            <h2>登録</h2>
            <button className="button" onClick={() => {
                Notify("送信しています.")
                if (AnkTitle.current && AnkChoices.current)
                    SendData(AnkTitle.current.value, AnkChoices.current.value)
            }}>Let's get started</button>
        </AdminFrame>
    )
}