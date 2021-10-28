import { Link } from "react-router-dom"

export function AdminHeader():JSX.Element {
    return (
        <div className="header">
            <Link to="/adm/jsadm" className="header_logo">JsAnkアンケートシステム</Link>
            <Link to="/adm/createank" className="button">Add</Link>
        </div>
    )
}