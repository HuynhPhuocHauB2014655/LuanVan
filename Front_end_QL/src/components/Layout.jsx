import { Outlet, Link } from "react-router-dom";
import axiosClient from "../axios-client"
import { useStateContext } from "../context/alterContext";
import { useEffect, useState } from "react";
import classNames from 'classnames';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp  } from "@fortawesome/free-solid-svg-icons";
export default function Layout() {
    const { message, setMessage } = useStateContext();
    const [active, setActive] = useState(0);
    const {nienKhoa,setNienKhoa} = useStateContext();
    const menu_items = [
        { id: 1, route: "/", label: 'Trang chủ' },
        { id: 2, route: "/student", label: 'Học sinh' },
        { id: 3, route: "/nk", label: 'Niên Khóa' },
        { id: 4, route: "/subject", label: 'Môn học' },
        { id: 5, route: "/teacher", label: 'Giáo Viên' },
        { id: 6, route: "/class", label: 'Lớp Học' },
    ];
    const fetchData = async () => {
        try {
            const NKNow = await axiosClient.get("/nk/getNow");
            setNienKhoa(NKNow.data[0]);
        }catch(error){
            console.log(error);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);
    const activeItem = (id) => {

        setActive(id);
    }
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
            }, 3000);

            return () => clearTimeout(timer); // Cleanup timer on component unmount
        }
    }, [message]);
    const goToTop = () => {
        window.scrollTo(0, 0);
    }
    return (
        <div className="px-2 bg-amber-100 relative">
            {message && <div className="fixed bg-blue-600 text-white w-[90%] text-center py-3 rounded bottom-0 z-10 left-[5%]">{message}</div>}
            <header className="bg-cyan-400 py-4 rounded text-center text-3xl header">
                Hệ thống quản lí <br/> Trường THPT Cần Thơ
            </header>
            <div className="flex ps-1">
                <ul className="w-[10%] border-e-4 border-cyan-200 me-2">
                    {menu_items.map((item) => (
                        <li
                            key={item.id}
                            className={classNames('menu-item', { 'bg-slate-100 border-b-2 border-cyan-200': active === item.id })}
                        >
                            <Link
                                className="py-2 ps-2 block border-2 border-transparent hover:border-b-cyan-200 hover:bg-slate-100"
                                to={item.route} onClick={() => activeItem(item.id)}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="w-[90%]">
                    <Outlet />
                </div>
            </div>
            <footer className="footer bg-cyan-200 rounded flex items-center justify-center">
                Footer
            </footer>
            <button className="border-2 border-blue-600 px-3 py-1 text-2xl fixed bottom-1 right-1 rounded" onClick={goToTop}><FontAwesomeIcon icon={faArrowUp} color="blue"/></button>
        </div>
    )
}