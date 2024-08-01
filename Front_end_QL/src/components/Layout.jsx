import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="container">
            <header className="header">
                Hệ thống quản lí trường học
            </header>
            <ul className="menu">
                <li className="menu-item">
                    <a className="menu-link" href="/">Trang chủ</a>
                </li>
                <li className="menu-item">
                    <a className="menu-link" href="/student">Học sinh</a>
                </li>
                <li className="menu-item">
                    <a className="menu-link" href="/nk">Niên Khóa</a>
                </li>
            </ul>
            <div className="main">
                <Outlet />
            </div>
            <div className="footer">
                Footer
            </div>
        </div>
    )
}