import { Outlet, Link, Navigate, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client"
import { useStateContext } from "../context/Context";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useUserContext } from "../context/userContext";
import pusher from "../pusher";
export default function Layout() {
    const { message, error, setMessage, setError } = useStateContext();
    const { nienKhoa, setNienKhoa } = useStateContext();
    const { userName, setUserName , info, setInfo} = useUserContext();
    const [showConfirm, setShowConfirm] = useState(false);
    const [messages, setMessages] = useState([]);
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
    useEffect(() => {
        setInfo(userName);
    }, [userName]);
    const logOut = () => {
        setShowConfirm(true);
    }
    const onConfirm = () => {
        setUserName("");
        navigate("/login");
    }
    const onCancel = () => {
        setShowConfirm(false);
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
        <div className="mx-20 bg-amber-100 relative">
            {showConfirm && (
                <div className="confirm-overlay">
                <div className="confirm-box">
                  <p>Bạn có chắc chắn với hành động này không</p>
                  <div className="confirm-buttons">
                    <button onClick={onConfirm} id="confirm-yes">Yes</button>
                    <button onClick={onCancel} id="confirm-no">No</button>
                  </div>
                </div>
              </div>
            )}
            {message && <div className="fixed bg-blue-600 text-white w-[90%] text-center py-3 rounded bottom-0 z-10 left-[5%]">{message}</div>}
            {error && <div className="fixed bg-red-600 text-white w-[90%] text-center py-3 rounded bottom-0 z-10 left-[5%]">{error}</div>}
            <header className="bg-cyan-400 py-2 rounded header relative">
                <button className="absolute right-2 h-[30%] top-[35%]" onClick={logOut}><FontAwesomeIcon icon={faRightFromBracket} color="white" className="h-full" /></button>
                <p className="text-center text-2xl">Hệ thống quản lí <br /> Trường THPT Cần Thơ</p>
            </header>
            <div className="relative">
                <Outlet />
            </div>
            <footer className="footer bg-cyan-200 rounded flex items-center justify-center">
                Footer
            </footer>
            <button className="border-2 border-blue-600 px-3 py-1 text-2xl fixed bottom-1 right-1 rounded" onClick={goToTop}><FontAwesomeIcon icon={faArrowUp} color="blue" /></button>
        </div>
    )
}