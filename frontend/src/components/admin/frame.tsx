import React from "react"

import { AdminHeader } from "./header"

interface AdminFrameIntf {
    children: React.ReactNode
}

export function AdminFrame(props: AdminFrameIntf): JSX.Element {
    return (
        <div className="adminframe">
            <AdminHeader />
            <div className="admincontainer">
                {props.children}
            </div>
        </div>
    )
}