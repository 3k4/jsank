export function AddCookie(key:string, value:string) {
    document.cookie = `${key}=${value}`
}

export function GetCookies(): { [name: string]: string } {

    let cookies: { [name: string]: string } = {};

    if (document.cookie != "") {
        const cs = document.cookie.split('; ')
        for (let i = 0; i < cs.length; i++) {
            var keydata: string[] = cs[i].split("=")
            cookies[keydata[0]] = decodeURIComponent(keydata[1])
        }
    }

    return cookies
}