import { Outlet } from "react-router-dom";
import { useStateContext } from "../context/alterContext";
import { useEffect, useState } from "react";
export default function Layout() {
    const {message,setMessage} = useStateContext();
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
            }, 3000);

            return () => clearTimeout(timer); // Cleanup timer on component unmount
        }
    }, [message]);
    return (
        <div className="px-2 bg-amber-100 relative">
            {message && <div className="fixed bg-blue-600 text-white w-[90%] text-center py-3 rounded bottom-0 z-10 left-[5%]">{message}</div>}
            <header className="bg-cyan-400 py-4 rounded text-center text-3xl header">
                Hệ thống quản lí trường học
            </header>
            <div className="flex ps-1">
                <ul className="w-[10%] border-e-4 border-cyan-200 me-2">
                    <li>
                        <a className="py-2 block border-2 border-transparent hover:border-b-cyan-200 hover:bg-slate-100" href="/">Trang chủ</a>
                    </li>
                    <li>
                        <a className="py-2 block border-2 border-transparent hover:border-b-cyan-200 hover:bg-slate-100" href="/student">Học sinh</a>
                    </li>
                    <li>
                        <a className="py-2 block border-2 border-transparent hover:border-b-cyan-200 hover:bg-slate-100" href="/nk">Niên Khóa</a>
                    </li>
                    <li>
                        <a className="py-2 block border-2 border-transparent hover:border-b-cyan-200 hover:bg-slate-100" href="/subject">Môn Học</a>
                    </li>
                    <li>
                        <a className="py-2 block border-2 border-transparent hover:border-b-cyan-200 hover:bg-slate-100" href="/teacher">Giáo Viên</a>
                    </li>
                </ul>
                <div className="w-[90%]">
                    <Outlet />
                </div>
            </div>
            <footer className="footer bg-cyan-200 rounded flex items-center justify-center">
                Footer
            </footer>
        </div>
    )
}