import { useState } from "react";
import classNames from 'classnames';
import { Link } from "react-router-dom";
export default function Menu() {
    const [active, setActive] = useState(0);
    const menu_items = [
        { id: 1, route: "/home", label: 'Trang chủ' },
        { id: 2, route: "/student", label: 'Học sinh' },
        { id: 3, route: "/nk", label: 'Niên Khóa' },
        { id: 4, route: "/subject", label: 'Môn học' },
        { id: 5, route: "/teacher", label: 'Giáo Viên' },
        { id: 6, route: "/class", label: 'Lớp Học' },
        { id: 7, route: "/tkb", label: 'Thời Khóa Biểu' },
    ];
    const activeItem = (id) => {
        setActive(id);
    }

    return (
        <ul className="border-e-4 border-cyan-200 px-2 w-[15%]">
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
    )
}