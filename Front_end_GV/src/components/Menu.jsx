import { useState } from "react";
import classNames from 'classnames';
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axiosClient from "../axios-client";
import { useUserContext } from "../context/userContext";
import pusher from "../pusher";
export default function Menu({update}) {
    const {userName, info} = useUserContext();
    const [tbCount,setTbCount] = useState(0);
    const [tnCount,setTnCount] = useState(0);
    const [active, setActive] = useState(0);
    const fetchTB = async () => {
        const TB = await axiosClient.get(`/tb/gv/${userName}`);
        const count = TB.data.filter(item => item.TrangThai == 0).length;
        setTbCount(count);
    }
    const fetchTN = async () => {
        const c = await axiosClient.get(`tn/count/${userName}-${info.TenGV}`);
        setTnCount(c.data);
    }
    useEffect(()=>{
        if(userName && info){
            fetchTB();
            fetchTN();
        }
    },[userName,info]);
    if(update == 1){
        fetchTB();
    }
    if(update == 2){
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
    ];
    const activeItem = (id) => {
        setActive(id);
    }
    useEffect(()=> {
        const url = window.location.pathname;
        const id = menu_items.findIndex(item => item.route === url);
        setActive(id+1);
    },[]);
    return (
        <ul className="border-e-4 border-cyan-200 px-2 w-[20%]">
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
    )
}