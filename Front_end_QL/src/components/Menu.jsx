import { useState } from "react";
import classNames from 'classnames';
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useUserContext } from "../context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
export default function Menu() {
    const [active, setActive] = useState(0);
    const { userName } = useUserContext();
    const [menu, setMenu] = useState();
    const [menuOpen, setMenuOpen] = useState(false);
    useEffect((() => {
        if (userName == "admin") {
            const menu_items = [
                { id: 1, route: "/", label: 'Trang chủ' },
                { id: 2, route: "/student", label: 'Học sinh' },
                { id: 3, route: "/nk", label: 'Niên Khóa' },
                { id: 4, route: "/subject", label: 'Môn học' },
                { id: 5, route: "/teacher", label: 'Giáo Viên' },
                { id: 6, route: "/class", label: 'Lớp Học' },
                { id: 7, route: "/tkb", label: 'Thời Khóa Biểu' },
                { id: 8, route: "/account", label: 'Tài khoản' },
                { id: 9, route: "/rs", label: 'Kết quả học tập' },
                { id: 10, route: "/notify", label: 'Thông báo' },
                { id: 11, route: "/ms", label: 'Tin nhắn' },
            ];
            setMenu(menu_items);
        }
        if (userName == "daotao") {
            const menu_items = [
                { id: 1, route: "/", label: 'Trang chủ' },
                { id: 2, route: "/subject", label: 'Môn học' },
                { id: 3, route: "/rs", label: 'Kết quả học tập' },
                { id: 4, route: "/notify", label: 'Thông báo' },
                { id: 5, route: "/class", label: 'Lớp Học' },
                { id: 6, route: "/tkb", label: 'Thời Khóa Biểu' },
            ];
            setMenu(menu_items);
        }
        if (userName == "nhansu") {
            const menu_items = [
                { id: 1, route: "/", label: 'Trang chủ' },
                { id: 2, route: "/student", label: 'Học sinh' },
                { id: 3, route: "/teacher", label: 'Giáo Viên' },
                { id: 4, route: "/account", label: 'Tài khoản' },
                { id: 5, route: "/notify", label: 'Thông báo' },
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
        <div className={`md:w-1/5 w-1/2  fixed md:static md:z-0 z-10 bottom-2 md:border-e-4 md:shadow-none md:border-cyan-200 ${menuOpen && "shadow-lg shadow-cyan-400 bg-white border-2 border-cyan-300"} md:bg-transparent`}>
            <ul className={` ${menuOpen ? "block" : "hidden"} md:block`}>
                {menu?.map((item) => (
                    <li
                        key={item.id}
                        className={classNames('menu-item', { 'bg-slate-100 border-b-2 border-cyan-200': active === item.id })}
                    >
                        <Link
                            className="py-2 ps-2 block border-2 border-transparent hover:border-b-cyan-200 hover:bg-slate-100 relative"
                            to={item.route} onClick={() => activeItem(item.id)}
                        >
                            {item.label}
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