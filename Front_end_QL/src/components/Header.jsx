import { Outlet, Link, Navigate, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client"
import { useStateContext } from "../context/Context";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faRightFromBracket, faEnvelope, faMessage, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { useUserContext } from "../context/userContext";
import AlterConfirm from "./Confirm";
import pusher from "../pusher";
export default function Header({ update }) {
    const { message, setMessage, error, setError } = useStateContext();
    const { nienKhoa, setNienKhoa } = useStateContext();
    const { userName, setUserName } = useUserContext();
    const [showConfirm, setShowConfirm] = useState(0);
    const navigate = useNavigate();
    const [onMd, setOnMd] = useState(false);
    const [tnCount, setTnCount] = useState(0);

    const fetchTN = async () => {
        const c = await axiosClient.get(`tn/count/${userName}`);
        let n = 0;
        c.data.map((data) => {
            n += data.unread_count;
        })
        setTnCount(n);
    }
    useEffect(() => {
        fetchTN();
    }, [userName]);
    if(update){
        fetchTN();
    }
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
    const showConfrim = () => {
        setShowConfirm(1);
    }
    const onConfirm = () => {
        setUserName("");
        navigate("/login");
    }
    const onCancel = () => {
        setShowConfirm(0);
    }
    return (
        <header className="px-5 bg-[#313a46] header flex items-center justify-between">
            {showConfirm === 1 &&
                <AlterConfirm message={"Bạn có chắc chắn muốn đăng xuất không?"} onConfirm={onConfirm} onCancel={onCancel} />
            }
            <Link to={"/"} className="text-white text-2xl">
                {!onMd ?
                    <p className="">Hệ thống quản lí Trường THPT Cần Thơ</p>
                    :
                    <FontAwesomeIcon icon={faGraduationCap} title="Hệ thống quản lí Trường THPT Cần Thơ" className="text-4xl" />}
            </Link>
            <div className="space-x-5 text-sm md:text-xl">
                <button
                    className="relative p-2 transform hover:scale-125 transition-transform duration-300" title="Tin nhắn"
                    onClick={() => navigate("/ms")}
                >
                    {tnCount > 0 &&
                        <span className="absolute top-0 right-0 bg-red-500 rounded-full px-1 text-white text-sm ">{tnCount}</span>
                    }
                    <FontAwesomeIcon icon={faMessage} color="white" />
                </button>
                <button
                    className="relative p-2 transform hover:scale-125 transition-transform duration-300" title="Thông báo"
                    onClick={() => navigate("/notify")}
                >
                    <FontAwesomeIcon icon={faEnvelope} color="white" />
                </button>
                <button
                    className="relative p-2 transform hover:scale-125 transition-transform duration-300" title="Đăng xuất"
                    onClick={showConfrim}
                >
                    <FontAwesomeIcon icon={faRightFromBracket} color="white" className="" />
                </button>
            </div>
        </header>
    )
}