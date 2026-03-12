import React from "react";
import  Link  from "next/link";

const Sidebar = () => {
    return (
        <>
            <div className="sidebar">
                <ul>
                    <li>
                        <Link href="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                        <Link href="/profile">Profile</Link>
                    </li>
                    <li>
                        <Link href="/settings">Settings</Link>
                    </li>
                </ul>
            </div>

        </>
    )
}

export default Sidebar;