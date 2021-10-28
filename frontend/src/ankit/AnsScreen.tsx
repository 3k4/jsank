import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router"
import { Notify } from "../components/tools/notifagation"
import { AnkResponse, AnkChoiceResponse, AnkVoteResponse } from "../handlers/ankresponse"
import { APIAddress } from "../components/tools/info"

interface ParamTypes {
    ankid: string
}

export function Ans(): JSX.Element {

    let ankData: AnkResponse
    let choiceData: AnkChoiceResponse[]

    const [ankTitle, setAnkTitle] = useState<String>();
    const [ankElements, setAnkElements] = useState<JSX.Element[]>([])

    const freeTextAreaRef = useRef<HTMLInputElement>(null)
    const radioNameAreaRef = useRef<HTMLInputElement>(null)

    //urlのidを取得
    const { ankid } = useParams<ParamTypes>()

    async function vote(choiceid: string) {
        try {
            const response = await axios.post<AnkVoteResponse>(APIAddress() + "/vote", {
                choiceid: choiceid
            })
        } catch (error) {
            Notify("うまく投票できません")
        }
    }

    async function voteFT(text: string, rname: string) {
        try {
            const response = await axios.post<AnkVoteResponse>(APIAddress() + "/freetext", {
                ankid: ankid,
                text: text,
                radioname: rname
            })
        } catch (error) {
            Notify("うまく投票できません")
            return
        }
        Notify("できた")
    }

    async function getTargetAnkAndChoices() {
        try {
            //Ankの取得
            const ankresponse = await axios.get<AnkResponse>(APIAddress() + "/ank", {
                params: {
                    ankid: ankid,
                }
            })

            if (ankresponse.data) {
                ankData = ankresponse.data

                setAnkTitle(ankData.title)
            } else {
                Notify("アンケートを読み込めませんでした。このアンケートは終了しているかもしれません。")

                return
            }

            if (! ankData.isfreetextank) {
                //選択肢の取得
                const choicesresponse = await axios.get<AnkChoiceResponse[]>(APIAddress() + "/ank/choices", {
                    params: {
                        ankid: ankid,
                    }
                })
                

                if (choicesresponse.data) {
                    choiceData = choicesresponse.data

                    
                    //選択肢をDOMに反映

                    let newAnkChoiceElements: JSX.Element[] = []
                    let coloringcounter = 1
                    choiceData.forEach((data) => {
                        if (coloringcounter == 3) {
                            newAnkChoiceElements.push(
                                <li className="ankchoice third" onClick={() => {
                                    vote(data.choiceid)
                                }}>
                                    <p className="ankchoicetitle">{data.title}</p>
                                </li>
                            )

                            coloringcounter = 0
                        } else if (coloringcounter == 2) {
                            newAnkChoiceElements.push(
                                <li className="ankchoice second" onClick={() => {
                                    vote(data.choiceid)
                                }}>
                                    <p className="ankchoicetitle">{data.title}</p>
                                </li>
                            )
                        } else {
                            newAnkChoiceElements.push(
                                <li className="ankchoice first" onClick={() => {
                                    vote(data.choiceid)
                                }}>
                                    <p className="ankchoicetitle">{data.title}</p>
                                </li>
                            )
                        }

                        coloringcounter ++
                    })
                    setAnkElements(newAnkChoiceElements)
                    
                } else {
                    Notify("うまくできません")
                }
            } else {
                
                let newAnkFTElements: JSX.Element[] = []
                    newAnkFTElements.push(
                        <>
                            <p>ラジオネーム</p>
                            <input className="ansinput" ref={radioNameAreaRef} />
                            <p>メッセージ</p>
                            <input className="ansinput" ref={freeTextAreaRef} />
                            <button onClick={() => {
                                if (radioNameAreaRef.current?.value && freeTextAreaRef.current?.value) {
                                    console.log(radioNameAreaRef.current?.value, freeTextAreaRef.current?.value)
                                    voteFT(freeTextAreaRef.current?.value, radioNameAreaRef.current?.value)
                                }
                            }} className="button">送信</button>
                        </>
                    )
                setAnkElements(newAnkFTElements)
            }
            
        } catch (error) {
            Notify("アンケートを読み込めませんでした。")
        }
    }

    useEffect(() => {
        getTargetAnkAndChoices();
    }, [null])

    return (
        <div className="answrapper">
            <div className="anscontainer">
                <h1 className="anktitle">{ankTitle}</h1>
                <ul className="ankchoicelist">
                    {ankElements}
                </ul>   
            </div>
        </div>
    )
}