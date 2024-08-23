import { Link } from "react-router-dom";
export default function Home() {
    const menu_items = [
        { id: 1, route: "/student", label: 'Học sinh' },
        { id: 2, route: "/nk", label: 'Niên Khóa' },
        { id: 3, route: "/subject", label: 'Môn học' },
        { id: 4, route: "/teacher", label: 'Giáo Viên' },
        { id: 5, route: "/class", label: 'Lớp Học' },
        { id: 6, route: "/tkb", label: 'Thời Khóa Biểu' },
        { id: 7, route: "/account", label: 'Tài khoản' },
        { id: 8, route: "/rs", label: 'Kết quả học tập' },
    ];
    return (
        <div className="main-content">
            <div className="w-full p-20 mx-auto">
                <div className="text-center w-[60%] mx-auto">
                    <p className="text-4xl font-extrabold text-blue-600">Chào mừng bạn đến với hệ thống quản lí Trường THPT Cần Thơ</p> <br/>
                </div>
                <p className="text-xl text-center mt-16 mb-10">Danh sách các chức năng</p>
                <div className="grid grid-cols-3 gap-4 w-[70%] mx-auto">
                    {menu_items.map((item) => (
                        <Link key={item.id}
                            className="border-2 border-slate-500 rounded-lg mx-1 py-2 hover:bg-cyan-400 button-animation text-center block mb-2"
                            to={item.route}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}