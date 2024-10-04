import { useState } from "react";
import classNames from 'classnames';
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axiosClient from "../axios-client";
import { useUserContext } from "../context/userContext";
import pusher from "../pusher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
export default function Menu({ update }) {
    const { userName, info } = useUserContext();
    const [tbCount, setTbCount] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [tnCount, setTnCount] = useState(0);
    const [active, setActive] = useState(0);
    const fetchTB = async () => {
        const TB = await axiosClient.get(`/tb/gv/${userName}`);
        const count = TB.data.filter(item => item.TrangThai == 0).length;
        setTbCount(count);
    }
    const fetchTN = async () => {
        const c = await axiosClient.get(`tn/count/${userName}`);
        let n = 0;
        c.data.map((data) => {
            n += data.unread_count;
        })
        setTnCount(n);
    }
    useEffect(() => {
        if (userName) {
            fetchTB();
            fetchTN();
        }
    }, [userName]);
    if (update == 1) {
        fetchTB();
    }
    if (update == 2) {
        fetchTN();
    }
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
        { id: 1, route: "/", label: 'Trang chủ' },
        { id: 2, route: "/info", label: 'Thông tin cá nhân' },
        { id: 3, route: "/cn", label: 'Chủ nhiệm' },
        { id: 4, route: "/class", label: 'Quản lí lớp dạy' },
        { id: 5, route: "/tkb", label: 'Thời khóa biểu' },
        { id: 6, route: "/tb", label: 'Thông báo' },
        { id: 7, route: "/ms", label: 'Tin nhắn' },
        { id: 8, route: "/teach", label: 'Dạy học' },
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
        <div className={`md:w-1/5 w-1/2  fixed md:static md:z-0 z-10 bottom-2 md:shadow-none md:border-e-4 md:border-cyan-200 ${menuOpen && "shadow-lg shadow-cyan-400 bg-white border-2 border-cyan-300"} md:bg-transparent`}>
            <ul className={` ${menuOpen ? "block" : "hidden"} md:block`}>
                {menu_items.map((item) => (
                    <li
                        key={item.id}
                        className={classNames('menu-item', { 'bg-slate-100 border-b-2 border-cyan-200': active === item.id })}
                    >
                        <Link
                            className="py-2 px-2 block border-2 border-transparent hover:border-b-cyan-200 hover:bg-slate-100 relative"
                            to={item.route} onClick={() => activeItem(item.id)}
                        >
                            {item.label}
                            {item.id == 6 && tbCount > 0 &&
                                <span className="absolute top-1 right-0 bg-red-500 px-2 rounded-full text-white text-sm">{tbCount}</span>
                            }
                            {item.id == 7 && tnCount > 0 &&
                                <span className="absolute top-1 right-0 bg-red-500 px-2 rounded-full text-white text-sm">{tnCount}</span>
                            }
                        </Link>
                    </li>
                ))}
            </ul>
            <button className="md:hidden px-2 py-1 bg-blue-500 text-white mt-3 m-1 relative" onClick={() => setMenuOpen(!menuOpen)}>
                <FontAwesomeIcon icon={faBars} />
                {tnCount > 0 &&
                    <span className="absolute top-0 right-0 text-red-500 font-bold text-sm">{tnCount}</span>
                }
            </button>
        </div>
    )
}