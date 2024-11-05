import { Outlet, Link, Navigate, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client"
import { useStateContext } from "../context/Context";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faRightFromBracket, faEnvelope, faMessage, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { useUserContext } from "../context/userContext";
import AlterConfirm from "./Confirm";
import pusher from "../pusher";
export default function Layout() {
    const { message, setMessage, error, setError } = useStateContext();
    const { nienKhoa, setNienKhoa } = useStateContext();
    const { userName, setUserName } = useUserContext();
    const [showConfirm, setShowConfirm] = useState(0);
    const navigate = useNavigate();
    const [onMd, setOnMd] = useState(false);
    const [tnCount, setTnCount] = useState(0);
    const fetchData = async () => {
        try {
            const NKNow = await axiosClient.get("/nk/getNow");
            setNienKhoa(NKNow.data);
        } catch (error) {
            console.log(error);
        }
    }
    if (!userName) {
        return <Navigate to="/login" replace />
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
        <div className="relative">
            {message && <div className="fixed bg-blue-600 text-white w-[90%] text-center py-3 rounded bottom-0 z-10 left-[5%]">{message}</div>}
            {error && <div className="fixed bg-red-600 text-white w-[90%] text-center py-3 rounded bottom-0 z-10 left-[5%]">{error}</div>}
            <div className=" bg-[#eceff8]">
                <Outlet />
            </div>
            <footer className="footer rounded bg-white border-t-2 flex px-4 items-center">
                Copyright © Trường THPT Cần Thơ
            </footer>
            <button className="border-2 border-blue-600 px-3 py-1 text-2xl fixed bottom-1 right-1 rounded z-20" onClick={goToTop}><FontAwesomeIcon icon={faArrowUp} color="blue" /></button>
        </div>
    )
}