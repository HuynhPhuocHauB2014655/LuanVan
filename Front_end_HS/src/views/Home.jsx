import { useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useEffect } from "react";
import { useUserContext } from "../context/userContext";
import pusher from "../pusher";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
export default function Home() {
    const { userName, info } = useUserContext();
    library.add(fas);
    const menu_items = [
        { id: 1, route: "/info", label: 'Thông tin cá nhân', icon: <FontAwesomeIcon icon="fa-solid fa-user" /> },
        { id: 2, route: "/result", label: 'Kết quả học tập', icon: <FontAwesomeIcon icon="fa-solid fa-book-open-reader" /> },
        { id: 3, route: "/tkb", label: 'Thời khóa biểu', icon: <FontAwesomeIcon icon="fa-solid fa-calendar-days" /> },
    ];
    return (
        <div>
            <Header />
            <div className="main-content">
                <div className="w-full p-10 mx-auto">
                    <div className="text-center md:w-[60%] mx-auto">
                        <p className="md:text-4xl text-2xl font-extrabold text-blue-600">Chào mừng bạn đến với hệ thống quản lí Trường THPT Cần Thơ</p>
                    </div>
                    <p className="text-xl text-center mt-16 mb-10">Danh sách các chức năng</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                </div>
            </div>
        </div>
    )
}