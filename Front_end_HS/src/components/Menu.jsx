import { useState } from "react";
import classNames from 'classnames';
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useUserContext } from "../context/userContext";
import axiosClient from "../axios-client";
import pusher from "../pusher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
export default function Menu({ update }) {
    const [active, setActive] = useState(0);
    const { userName, info } = useUserContext();
    const [onMd, setOnMd] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    library.add(fas);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setOnMd(true);
            } else {
                setOnMd(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    useEffect(() => {
        const channel = pusher.subscribe(`chat.${userName}`);

        channel.bind('App\\Events\\sendMessage', (data) => {
            fetchTN();
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [userName]);
    const menu_items = [
        { id: 1, route: "/", label: 'Trang chủ',icon:<FontAwesomeIcon icon="fa-solid fa-home" /> },
        { id: 2, route: "/info", label: 'Thông tin cá nhân',icon:<FontAwesomeIcon icon="fa-solid fa-user" /> },
        { id: 3, route: "/result", label: 'Kết quả học tập',icon:<FontAwesomeIcon icon="fa-solid fa-book-open-reader" /> },
        { id: 4, route: "/tkb", label: 'Thời khóa biểu',icon:<FontAwesomeIcon icon="fa-solid fa-calendar-days" /> },
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
        <div className={`md:w-1/5 w-1/2 md:p-2 fixed md:static md:z-0 z-10 bottom-2 left-2  md:bg-white md:shadow-none md:border-2 ${(menuOpen && onMd) && "shadow-lg bg-white border-2 border-cyan-300"}`}>
            <ul className={` ${menuOpen ? "block" : "hidden"} md:block`}>
                {menu_items.map((item) => (
                    <li
                        key={item.id}
                        className={classNames('menu-item', { 'bg-slate-100 border-b-2 border-cyan-200': active === item.id })}
                    >
                        <Link
                            className="py-2 flex space-x-2 items-center ps-2 border-2 border-transparent hover:border-b-cyan-200 hover:bg-slate-100 relative"
                            to={item.route} onClick={() => activeItem(item.id)}
                        >
                            <p className="flex items-end">{item.icon}</p>
                            <p className="md:text-lg font-semibold text-gray-700 flex items-end">{item.label}</p>
                        </Link>
                    </li>
                ))}
            </ul>
            <button className="md:hidden px-2 py-1 bg-blue-500 text-white mt-3 m-1 relative" onClick={() => setMenuOpen(!menuOpen)}>
                <FontAwesomeIcon icon={faBars} className="text-3xl"/>
            </button>
        </div>
    )
}