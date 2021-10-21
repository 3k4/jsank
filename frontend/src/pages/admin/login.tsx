import { AdminFrame } from "../../components/admin/frame"
import { DoLogin } from "../../handlers/login"

export function LoginScreen() : JSX.Element{

    function login() {
        const didf = document.getElementById("did")
        const pwdf = document.getElementById("password")
    }

    return (
        <AdminFrame>
            <h2>ユーザID</h2>
            <input type="text" id="did" />
            <h2>パスワーぢ</h2>
            <input type="password" id="password" />

            <p>ログインするにはココをクリック</p>
        </AdminFrame>
    )

}