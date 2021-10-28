import axios, { AxiosResponse } from "axios"
import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router"
import { Bar } from "react-chartjs-2"
import QRCode from "qrcode.react"

import { AdminFrame } from "../../components/admin/frame"
import { IsMeLogined } from "../../components/tools/checklogin"
import { APIAddress, AnkCheckIntervalMSec, FrontendAddress } from "../../components/tools/info"
import { AnkResponse, AnkChoiceResponse, HowManyVoteResponse } from "../../handlers/ankresponse"
import { Notify } from "../../components/tools/notifagation"


interface ParamTypes {
    ankid: string
}

export function CheckAnk(): JSX.Element {
    const [dummy, setDummy] = useState<number>(0);
    const [ankTitle, setAnkTitle] = useState<String>();
    const [choices, setChoices] = useState<AnkChoiceResponse[]>([])
    const [counts, setCounts] = useState<Number[]>([])

    const [graphData, setGraphData] = useState<any>({
        datasets: [
            {
                

            }
        ]
    })

    const { ankid } = useParams<ParamTypes>()

    function getAnkData() {
        //Ankの取得

        let ankData: AnkResponse

        axios.get<AnkResponse>(APIAddress() + "/ank", {
            params: {
                ankid: ankid,
            }
        }).then((ankresponse) => {
            if (ankresponse.data) {
                ankData = ankresponse.data
    
                setAnkTitle(ankData.title)
            } else {
                Notify("アンケートを読み込めませんでした。このアンケートは終了しているかもしれません。")
    
                return
            }
    
            //選択肢の取得
            axios.get<AnkChoiceResponse[]>(APIAddress() + "/ank/choices", {
                params: {
                    ankid: ankid,
                }
            }).then((choicesresponse) => {
                if (choicesresponse.data) {
                    console.log(choicesresponse.data)
                    setChoices(choicesresponse.data)
                } else {
                    Notify("アンケートを読み込めませんでした。")
        
                    return
                }
            })
        })
    }

    function genResult() {
        var reqs = [];
        for (let choice of choices) {
            reqs.push(
                axios.get<HowManyVoteResponse>(APIAddress() + "/vote", {
                    params: {
                        choiceid: choice.choiceid
                    }
                })
            )
        }

        Promise.all(reqs).then((response) => {
            var newCounts: Number[] = []
            response.forEach((e) => {
                newCounts.push(e.data.count)
            })

            setCounts(newCounts)
        })
    }

    //負荷軽減のため初回のみアンケ内容の確認

    useEffect(() => {
        getAnkData()
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            genResult()
        }, AnkCheckIntervalMSec)

        return () => clearInterval(interval);
    }, [choices])

    useEffect(() => {
        //グラフ更新

        //グラフデータの設定
        //ラベル
        let labels: string[] = []
        //背景色
        let backGroundColor: string[] = []
        let c = 0
        choices.forEach((choice) => {
            labels.push(choice.title)

            c++

            if (c == 3) {
                backGroundColor.push("#e6cb36")
                c = 0
            } else if (c == 2) {
                backGroundColor.push("#44aeec")
            } else {
                backGroundColor.push("#b80b0b")
            }
        })

        const NewGraphData = {
            labels: labels,
            datasets: [
                {
                    label: "投票数",
                    data: counts,
                    backgroundColor: backGroundColor
                },
            ],
            options: {
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                family: "serif"
                            }
                        }
                    }
                }
            }
        }

        setGraphData(NewGraphData)
    }, [counts])

    return (
        <div className="answrapper">
            <div className="anscontainer">
            <QRCode className="ansqrcode" renderAs="svg" size={window.innerWidth} value={FrontendAddress + "/ans/" + ankid} />
                
                <h1 className="anktitle">{ankTitle}の結果</h1>
            
                <Bar  data={graphData} options={{
                    scales: {
                        xAxes: {
                            ticks: {
                                font: {
                                    size: 34
                                }
                            }
                        }
                    }
                }} />
            </div>
        </div>
    )
}