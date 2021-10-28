import axios from "axios"
import { useParams } from "react-router"
import { useEffect, useState } from "react"
import QRCode from "qrcode.react"

import { AnkFTResponse } from "../../handlers/ankresponse"
import { AnkCheckIntervalMSec, APIAddress, FrontendAddress } from "../../components/tools/info"

interface ParamTypes {
    ankid: string
}

export function CheckAnkFT(): JSX.Element {

    const { ankid } = useParams<ParamTypes>()

    const [ftElement, setFTElement] = useState<JSX.Element[]>([])
    let oldFtCount: number

    function showComment(message: string) {
        const wrapper = document.getElementById("commentswrapper")
        const newComment = document.createElement("div")
        newComment.classList.add("comment")
        newComment.textContent = message
        //ランダムの画面上高さ
        newComment.style.top = Math.floor(Math.random() * window.innerHeight) + "px"
        wrapper?.appendChild(newComment)

        //CSSアニメーションと同じ10病後にエレメントを消す
        setTimeout(() => {
            wrapper?.removeChild(newComment)
        }, 10000)
    }

    function genResult() {
        axios.get<AnkFTResponse[]>(APIAddress() + "/freetext", {
            params: {
                ankid: ankid
            }
        }).then((response) => {
            if (response.data.length > oldFtCount) {
                var newFTElement: JSX.Element[] = []
                for (let i: number = oldFtCount; i < response.data.length; i++) {
                    showComment(response.data[i].text)
                }
                setFTElement(newFTElement)
            }
            oldFtCount = response.data.length
        })
    }

    useEffect(() => {
        const interval = setInterval(() => {
            genResult()
        }, AnkCheckIntervalMSec)

        return () => clearInterval(interval);
    }, [])

    return (
        <div className="ftwrapper">
            <QRCode className="ansqrcode" renderAs="svg" size={window.innerWidth} value={FrontendAddress + "/ans/" + ankid} />
            <div id="commentswrapper">

            </div>
        </div>
    )
}