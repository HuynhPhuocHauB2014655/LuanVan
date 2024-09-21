import { useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useEffect } from "react";
import { useUserContext } from "../context/userContext";
import pusher from "../pusher";
export default function Home() {
    const {userName,info} = useUserContext();
    const [tbCount,setTbCount] = useState(0);
    const [tnCount,setTnCount] = useState(0);
    useEffect(()=>{
        const fetchTB = async () => {
            const TB = await axiosClient.get(`/tb/hs/${userName}`);
            const count = TB.data.filter(item => item.TrangThai == 0).length;
            setTbCount(count);
        }
        fetchTB();
    },[userName]);
    const fetchTN = async () => {
        const c = await axiosClient.get(`tn/count/${userName}`);
        let n = 0;
        c.data.map((data)=>{
            n += data.unread_count;
        })
        setTnCount(n);
    }
    useEffect(()=>{
        fetchTN();
    },[userName]);
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
        { id: 1, route: "/info", label: 'Thông tin cá nhân' },
        { id: 2, route: "/result", label: 'Kết quả học tập' },
        { id: 3, route: "/tkb", label: 'Thời khóa biểu' },
        { id: 4 , route: "/notify", label: 'Thông báo'},
        { id: 5 , route: "/tn", label: 'Tin nhắn'}
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
                            className="border-2 border-slate-500 rounded-lg mx-1 py-2 hover:bg-cyan-400 button-animation text-center block mb-2 relative"
                            to={item.route}
                        >
                            {item.label} 
                            {item.id == 4 && tbCount > 0 && 
                                <span className="absolute top-0 right-0 bg-red-500 px-2 rounded-full text-white text-sm">{tbCount}</span>
                            }
                            {item.id == 5 && tnCount > 0 && 
                                <span className="absolute top-1 right-0 bg-red-500 px-2 rounded-full text-white text-sm">{tnCount}</span>
                            }
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}