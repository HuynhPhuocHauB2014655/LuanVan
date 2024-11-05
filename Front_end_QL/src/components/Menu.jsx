import { useState } from "react";
import classNames from 'classnames';
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useUserContext } from "../context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../axios-client";
export default function Menu({ update }) {
    const [active, setActive] = useState(0);
    const { userName } = useUserContext();
    const [menu, setMenu] = useState();
    const [tnCount, setTnCount] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [onMd, setOnMd] = useState(false);
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
    useEffect((() => {
        if (userName == "admin") {
            const menu_items = [
                { id: 1, route: "/", label: 'Trang chủ', icon:<FontAwesomeIcon icon="fa-solid fa-house" className="text-xl"/> },
                { id: 2, route: "/student", label: 'Học sinh',icon:<FontAwesomeIcon icon="fa-solid fa-user-graduate" className="text-xl" /> },
                { id: 3, route: "/nk", label: 'Niên Khóa',icon: <FontAwesomeIcon icon="fa-solid fa-calendar" className="text-xl" /> },
                { id: 4, route: "/subject", label: 'Môn học',icon: <FontAwesomeIcon icon="fa-solid fa-book" className="text-xl" /> },
                { id: 5, route: "/teacher", label: 'Giáo Viên',icon: <FontAwesomeIcon icon="fa-solid fa-chalkboard-user" className="text-xl" /> },
                { id: 6, route: "/class", label: 'Lớp Học', icon: <FontAwesomeIcon icon="fa-solid fa-book-open" className="text-xl" /> },
                { id: 7, route: "/tkb", label: 'Thời Khóa Biểu', icon: <FontAwesomeIcon icon="fa-solid fa-calendar-days" className="text-xl" /> },
                { id: 8, route: "/account", label: 'Tài khoản',icon: <FontAwesomeIcon icon="fa-solid fa-users" className="text-xl" /> },
                { id: 9, route: "/rs", label: 'Kết quả học tập',icon: <FontAwesomeIcon icon="fa-solid fa-book-open-reader" className="text-xl" /> },
            ];
            setMenu(menu_items);
        }
        if (userName == "daotao") {
            const menu_items = [
                { id: 1, route: "/", label: 'Trang chủ', icon:<FontAwesomeIcon icon="fa-solid fa-house" className="text-xl"/> },
                { id: 2, route: "/subject", label: 'Môn học',icon: <FontAwesomeIcon icon="fa-solid fa-book" className="text-xl" /> },
                { id: 3, route: "/rs", label: 'Kết quả học tập',icon: <FontAwesomeIcon icon="fa-solid fa-book-open-reader" className="text-xl" /> },
                { id: 5, route: "/class", label: 'Lớp Học', icon: <FontAwesomeIcon icon="fa-solid fa-book-open" className="text-xl" /> },
                { id: 6, route: "/tkb", label: 'Thời Khóa Biểu', icon: <FontAwesomeIcon icon="fa-solid fa-calendar-days" className="text-xl" /> },
            ];
            setMenu(menu_items);
        }
        if (userName == "nhansu") {
            const menu_items = [
                { id: 1, route: "/", label: 'Trang chủ' , icon:<FontAwesomeIcon icon="fa-solid fa-house" className="text-xl"/>},
                { id: 2, route: "/student", label: 'Học sinh' ,icon:<FontAwesomeIcon icon="fa-solid fa-user-graduate" className="text-xl" />},
                { id: 3, route: "/teacher", label: 'Giáo Viên',icon: <FontAwesomeIcon icon="fa-solid fa-chalkboard-user" className="text-xl" /> },
            ];
            setMenu(menu_items);
        }
    }), [userName])
    const activeItem = (id) => {
        setActive(id);
    }
    useEffect(() => {
        if (menu) {
            const url = window.location.pathname;
            if (url == "/class-info") {
                setActive(9);
            }
            else {
                const id = menu.findIndex(item => item.route === url);
                setActive(id + 1);
            }
        }
    }, [menu]);
    return (
        <div className={`md:w-1/5 w-1/2 md:p-2 fixed md:static md:z-0 z-10 bottom-2  md:bg-white md:shadow-none md:border-2 ${(menuOpen && onMd) && "shadow-lg bg-white border-2 border-cyan-300"}`}>
            <p className="font-extrabold text-center bg-slate-300 py-2 ">
                {userName === "daotao"
                    ? "Phòng đào tạo"
                    : userName === "nhansu"
                        ? "Phòng nhân sự"
                        : "Tài khoản Quản lí"}
            </p>
            <ul className={` ${menuOpen ? "block" : "hidden"} md:block`}>
                {menu?.map((item) => (
                    <li
                        key={item.id}
                        className={classNames('menu-item', { 'bg-slate-100 border-b-2 border-cyan-200': active === item.id })}
                    >
                        <Link
                            className="py-2 ps-2 block border-2 border-transparent hover:border-b-cyan-200 hover:bg-slate-100 relative flex space-x-3"
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