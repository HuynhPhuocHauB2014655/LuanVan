import { useState } from "react";
import classNames from 'classnames';
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axiosClient from "../axios-client";
import { useUserContext } from "../context/userContext";
import pusher from "../pusher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
export default function Menu({ update }) {
    const { userName, info } = useUserContext();
    const [tbCount, setTbCount] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [tnCount, setTnCount] = useState(0);
    const [active, setActive] = useState(0);
    library.add(fas);
    const menu_items = [
        { id: 1, route: "/", label: 'Trang chủ', icon:<FontAwesomeIcon icon="fa-solid fa-house"/> },
        { id: 2, route: "/info", label: 'Thông tin cá nhân',icon: <FontAwesomeIcon icon="fa-solid fa-user" />},
        { id: 3, route: "/nk", label: "Niên Khóa", icon: <FontAwesomeIcon icon="fa-solid fa-calendar" /> },
        { id: 4, route: "/cn", label: 'Chủ nhiệm',icon: <FontAwesomeIcon icon="fa-solid fa-briefcase" />},
        { id: 5, route: "/class", label: 'Quản lí lớp dạy',icon:<FontAwesomeIcon icon="fa-solid fa-book-open" /> },
        { id: 6, route: "/tkb", label: 'Thời khóa biểu',icon: <FontAwesomeIcon icon="fa-solid fa-calendar-days" /> },
        { id: 7, route: "/teach", label: 'Dạy học',icon:<FontAwesomeIcon icon="fa-solid fa-person-chalkboard" /> },
    ];
    const activeItem = (id) => {
        setActive(id);
    }
    useEffect(() => {
        const url = window.location.pathname;
        const id = menu_items.findIndex(item => item.route === url);
        setActive(id + 1);
    }, []);
    return (
        <div className={`md:w-1/5 w-1/2 md:p-2 fixed md:static md:z-0 z-10 bottom-2  md:bg-white md:shadow-none md:border-2 ${(menuOpen && onMd) && "shadow-lg bg-white border-2 border-cyan-300"}`}>
            <ul className={` ${menuOpen ? "block" : "hidden"} md:block`}>
                {menu_items.map((item) => (
                    <li
                        key={item.id}
                        className={classNames('menu-item', { 'bg-slate-100 border-b-2 border-cyan-200': active === item.id })}
                    >
                        <Link
                            className="py-2 ps-2 border-2 border-transparent hover:border-b-cyan-200 hover:bg-slate-100 relative flex space-x-3"
                            to={item.route} onClick={() => activeItem(item.id)}
                        >
                            <p>{item.icon}</p>
                            <p>{item.label}</p>
                        </Link>
                    </li>
                ))}
            </ul>
            <button className="md:hidden px-2 py-1 bg-blue-500 text-white mt-3 m-1 relative" onClick={() => setMenuOpen(!menuOpen)}>
                <FontAwesomeIcon icon={faBars} />
            </button>
        </div>
    )
}