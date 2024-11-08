import { Link } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import { useState, useEffect } from "react";
import axiosClient from "../axios-client";
import pusher from "../pusher";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Calendar from "../components/Calender";
export default function Home() {
    const { userName } = useUserContext();
    const [menu, setMenu] = useState([]);

    library.add(fas);
    useEffect(() => {
        let menu_items = [];
        if (userName === "admin") {
            menu_items = [
                { id: 2, route: "/student", label: "Học sinh", icon: <FontAwesomeIcon icon="fa-solid fa-user-graduate" /> },
                { id: 3, route: "/nk", label: "Niên Khóa", icon: <FontAwesomeIcon icon="fa-solid fa-calendar" /> },
                { id: 4, route: "/subject", label: "Môn học", icon: <FontAwesomeIcon icon="fa-solid fa-book" /> },
                { id: 5, route: "/teacher", label: "Giáo Viên", icon: <FontAwesomeIcon icon="fa-solid fa-chalkboard-user" /> },
                { id: 6, route: "/class", label: "Lớp Học", icon: <FontAwesomeIcon icon="fa-solid fa-book-open" /> },
                { id: 7, route: "/tkb", label: "Thời Khóa Biểu", icon: <FontAwesomeIcon icon="fa-solid fa-calendar-days" /> },
                { id: 8, route: "/account", label: "Tài khoản", icon: <FontAwesomeIcon icon="fa-solid fa-users" /> },
                { id: 9, route: "/rs", label: "Kết quả học tập", icon: <FontAwesomeIcon icon="fa-solid fa-book-open-reader" /> },
            ];
        } else if (userName === "daotao") {
            menu_items = [
                { id: 2, route: "/subject", label: "Môn học", icon: <FontAwesomeIcon icon="fa-solid fa-book" /> },
                { id: 3, route: "/rs", label: "Kết quả học tập", icon: <FontAwesomeIcon icon="fa-solid fa-book-open-reader" /> },
                { id: 5, route: "/class", label: "Lớp Học", icon: <FontAwesomeIcon icon="fa-solid fa-book-open" /> },
                { id: 6, route: "/tkb", label: "Thời Khóa Biểu", icon: <FontAwesomeIcon icon="fa-solid fa-calendar-days" /> },
            ];
        } else if (userName === "nhansu") {
            menu_items = [
                { id: 2, route: "/student", label: "Học sinh", icon: <FontAwesomeIcon icon="fa-solid fa-user-graduate" /> },
                { id: 3, route: "/teacher", label: "Giáo Viên", icon: <FontAwesomeIcon icon="fa-solid fa-chalkboard-user" /> },
            ];
        }
        setMenu(menu_items);
    }, [userName]);

    return (
        <div>
            <Header />
            <div className="main-content">
                <div className="w-full mx-3 space-y-10 my-10">
                    <div className="text-center bg-white border rounded p-5 shadow-lg">
                        <p className="md:text-2xl text-xl font-extrabold text-red-600">
                            {userName === "daotao"
                                ? "Phòng đào tạo"
                                : userName === "nhansu"
                                    ? "Phòng nhân sự"
                                    : "Tài khoản Quản lí"}
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <div className="grid grid-cols-1 w-1/3 gap-3">
                            {menu?.map((item) => (
                                <Link
                                    key={item.id}
                                    className="space-y-3 text-center relative bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300"
                                    to={item.route}
                                >
                                    <p className="text-3xl">{item.icon}</p>
                                    <p className="md:text-lg  font-semibold text-gray-700">{item.label}</p>
                                </Link>
                            ))}
                        </div>
                        <div className="w-2/3">
                            <Calendar/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
