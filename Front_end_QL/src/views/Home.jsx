import { Link } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import { useState, useEffect } from "react";

export default function Home() {
    const { userName } = useUserContext();
    const [menu, setMenu] = useState([]);

    useEffect(() => {
        let menu_items = [];
        if (userName === "admin") {
            menu_items = [
                { id: 1, route: "/", label: "Trang chủ" },
                { id: 2, route: "/student", label: "Học sinh" },
                { id: 3, route: "/nk", label: "Niên Khóa" },
                { id: 4, route: "/subject", label: "Môn học" },
                { id: 5, route: "/teacher", label: "Giáo Viên" },
                { id: 6, route: "/class", label: "Lớp Học" },
                { id: 7, route: "/tkb", label: "Thời Khóa Biểu" },
                { id: 8, route: "/account", label: "Tài khoản" },
                { id: 9, route: "/rs", label: "Kết quả học tập" },
                { id: 10, route: "/notify", label: "Thông báo" },
                { id: 11, route: "/ms", label: "Tin nhắn" },
            ];
        } else if (userName === "daotao") {
            menu_items = [
                { id: 1, route: "/", label: "Trang chủ" },
                { id: 2, route: "/subject", label: "Môn học" },
                { id: 3, route: "/rs", label: "Kết quả học tập" },
                { id: 4, route: "/notify", label: "Thông báo" },
                { id: 5, route: "/class", label: "Lớp Học" },
                { id: 6, route: "/tkb", label: "Thời Khóa Biểu" },
            ];
        } else if (userName === "nhansu") {
            menu_items = [
                { id: 1, route: "/", label: "Trang chủ" },
                { id: 2, route: "/student", label: "Học sinh" },
                { id: 3, route: "/teacher", label: "Giáo Viên" },
                { id: 5, route: "/notify", label: "Thông báo" },
            ];
        }
        setMenu(menu_items);
    }, [userName]);

    return (
        <div className="main-content">
            <div className="w-full p-10">
                <div className="text-center mt-8">
                    <p className="md:text-2xl text-xl font-extrabold text-red-600">
                        {userName === "daotao"
                            ? "Phòng đào tạo"
                            : userName === "nhansu"
                            ? "Phòng nhân sự"
                            : "Tài khoản Quản lí"}
                    </p>
                </div>
                <p className="text-xl text-center mt-16 mb-10 font-semibold">
                    Danh sách các chức năng
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-screen-lg mx-auto">
                    {menu?.map((item) => (
                        <Link
                            key={item.id}
                            className="border-2 border-gray-300 rounded-lg p-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300 text-center"
                            to={item.route}
                        >
                            <p className="text-lg font-semibold text-gray-700">{item.label}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
