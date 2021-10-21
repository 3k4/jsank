import axios, { Axios } from "axios";

import { APIAddress } from "../components/tools/info";

export function SendData() {

    console.log("sending")

    const title: HTMLInputElement = <HTMLInputElement>document.getElementById("akctitle")
    const c1 = <HTMLInputElement>document.getElementById("akcchoice1")
    const c2 = <HTMLInputElement>document.getElementById("akcchoice2")

    let parentID = ""

    interface PostChoiceAnk{
        title: string,
        isallowview: boolean
    }

    axios.post<string>(APIAddress() + "/createchoiceank",  {
        title: title.value,
        isallowview: true
    }).then((res) => {
        parentID = res.data
    })

    axios.post<string>(APIAddress() + "/createchoiceankchoice",  {
        title: c1.value,
        ankid: parentID
    })

    axios.post<string>(APIAddress() + "/createchoiceankchoice",  {
        title: c2.value,
        ankid: parentID
    })
    
}