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
        <div className="px-2 bg-amber-100 ">
            {message && <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white w-[90%] text-center py-3 rounded">{message}</div>}
            <header className="bg-cyan-400 py-4 rounded text-center text-3xl">
                Hệ thống quản lí trường học
            </header>
            <div className="flex ps-1">
                <ul className="w-1/6 border-e-4 border-cyan-200 me-2">
                    <li>
                        <a className="py-2 block border-2 border-transparent hover:border-b-cyan-200 hover:bg-slate-100" href="/">Trang chủ</a>
                    </li>
                    <li>
                        <a className="py-2 block border-2 border-transparent hover:border-b-cyan-200 hover:bg-slate-100" href="/student">Học sinh</a>
                    </li>
                    <li>
                        <a className="py-2 block border-2 border-transparent hover:border-b-cyan-200 hover:bg-slate-100" href="/nk">Niên Khóa</a>
                    </li>
                </ul>
                <div className="w-5/6 main">
                    <Outlet />
                </div>
            </div>
            <div className="footer">
                Footer
            </div>
        </div>
    )
}