import { Link } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import pusher from "../pusher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Calendar from "../components/Calender";
import Header from "../components/Header";
export default function Home() {
    const { userName, info } = useUserContext();
    library.add(fas);
    const menu_items = [
        { id: 1, route: "/info", label: 'Thông tin cá nhân', icon: <FontAwesomeIcon icon="fa-solid fa-user" /> },
        { id: 2, route: "/cn", label: 'Chủ nhiệm', icon: <FontAwesomeIcon icon="fa-solid fa-briefcase" /> },
        { id: 3, route: "/class", label: 'Quản lí lớp dạy', icon: <FontAwesomeIcon icon="fa-solid fa-book-open" /> },
        { id: 4, route: "/tkb", label: 'Thời khóa biểu', icon: <FontAwesomeIcon icon="fa-solid fa-calendar-days" /> },
        { id: 7, route: "/teach", label: 'Dạy học', icon: <FontAwesomeIcon icon="fa-solid fa-person-chalkboard" /> },
    ];
    return (
        <div>
            <Header />
            <div className="main-content">
                <div className="w-full p-10">
                    <div className="text-center w-[60%] mx-auto">
                        <p className="text-4xl font-extrabold text-blue-600 mb-10">Chào mừng bạn đến với hệ thống quản lí Trường THPT Cần Thơ</p> <br />
                    </div>
                    <div className="flex space-x-2">
                        <div className="grid grid-cols-1 w-1/3 gap-3">
                            {menu_items?.map((item) => (
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
                            <Calendar />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}