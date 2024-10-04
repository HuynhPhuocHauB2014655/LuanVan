import { Outlet, Link, Navigate, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client"
import { useStateContext } from "../context/Context";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useUserContext } from "../context/userContext";
import AlterConfirm from "./Confirm";
export default function Layout() {
    const { message, setMessage, error, setError } = useStateContext();
    const { nienKhoa, setNienKhoa } = useStateContext();
    const { userName, setUserName } = useUserContext();
    const [showConfirm, setShowConfirm] = useState(0);
    const navigate = useNavigate();
    const fetchData = async () => {
        try {
            const NKNow = await axiosClient.get("/nk/getNow");
            setNienKhoa(NKNow.data);
        } catch (error) {
            console.log(error);
        }
    }
    if (!userName) {
        return <Navigate to="/login" replace/>
    }
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
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message]);
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [error]);
    const goToTop = () => {
        window.scrollTo(0, 0);
    }
    return (
        <div className="mx-3 bg-amber-100 relative">
            {message && <div className="fixed bg-blue-600 text-white w-[90%] text-center py-3 rounded bottom-0 z-10 left-[5%]">{message}</div>}
            {error && <div className="fixed bg-red-600 text-white w-[90%] text-center py-3 rounded bottom-0 z-10 left-[5%]">{error}</div>}
            <header className="bg-cyan-400 py-2 rounded header relative">
                <button 
                    className="absolute right-2 h-[30%] top-[35%]" 
                    onClick={showConfrim}
                >
                    <FontAwesomeIcon icon={faRightFromBracket} color="white" className="h-full" />
                </button>
                {showConfirm === 1 && 
                        <AlterConfirm message={"Bạn có chắc chắn muốn đăng xuất không?"} onConfirm={onConfirm} onCancel={onCancel}/>
                }
                <p className="text-center text-2xl">Hệ thống quản lí <br /> Trường THPT Cần Thơ</p>
            </header>
            <div>
                <Outlet />
            </div>
            <footer className="footer bg-cyan-200 rounded flex items-center justify-center">
                Footer
            </footer>
            <button className="border-2 border-blue-600 px-3 py-1 text-2xl fixed bottom-1 right-1 rounded" onClick={goToTop}><FontAwesomeIcon icon={faArrowUp} color="blue" /></button>
        </div>
    )
}