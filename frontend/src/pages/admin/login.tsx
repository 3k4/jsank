import { AdminFrame } from "../../components/admin/frame"
import { DoLoginFromForm } from "../../handlers/login"

function login() {
    DoLoginFromForm()
}

export function LoginScreen() : JSX.Element{

    return (
        <AdminFrame>
            <h2>ユーザID</h2>
            <input type="text" id="did" />
            <h2>パスワーぢ</h2>
            <input type="password" id="password" />

            <p onClick={login}>ログインするにはココをクリック</p>
        </AdminFrame>
    )

}