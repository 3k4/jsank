export function NotifElm(): JSX.Element {
    return (
        <div id="notifwrapper">
            
        </div>
    )
}

export function Notify(message: string) {
    const notifelm = document.createElement("div")
    notifelm.classList.add("notif")
    const notifelmmes = document.createElement("p")
    const notifwrapper = document.getElementById("notifwrapper")

    notifelmmes.textContent = message
    notifelm.appendChild(notifelmmes)

    notifwrapper?.appendChild(notifelm)

    const removenotif = () => {
        notifwrapper?.removeChild(notifelm)
    }

    window.setTimeout(removenotif, 3000)
}