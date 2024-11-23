import axiosClient from "../axios-client"
import React, { useEffect, useRef, useState } from 'react';
import { useStateContext } from "../context/Context";
import Menu from "../components/Menu";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
export default function NienKhoa() {
    const { message, setMessage, setError } = useStateContext();
    const { nienKhoa, setNienKhoa } = useStateContext();
    const [isShow, setIsShow] = useState(0);
    const [datas, setDatas] = useState([]);
    const MaNKRef = useRef();
    const TenNKRef = useRef();
    const NgayBDRef = useRef();
    const HanSuaDiemRef = useRef();
    const nienKhoaHienTaiRef = useRef();
    const fetchData = async () => {
        try {
            const NKNow = await axiosClient.get("/nk/getNow");
            setNienKhoa(NKNow.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <Header />
            <div className="main-content">
                <Menu />
                <div className='right-part'>
                    <h2 className="page-name">Niên khóa</h2>
                    <div className="hk_nk_content">
                        <div className="grid grid-flow-cols grid-rows-3 gap-3 mt-3">
                            <div
                                className="w-[95%] mx-auto rounded border-2 text-center border-blue-400 p-5 bg-blue-300 hover:scale-105 hover:bg-blue-400"
                            >
                                <p className="text-2xl mb-4 font-bold">Năm học hiện tại hiện tại:</p>
                                <p className="text-4xl text-slate-700 font-mono">{nienKhoa.TenNK ? `${nienKhoa.TenNK}` : "Chưa đặt"}</p>
                            </div>
                            <div
                                className="w-[95%] mx-auto rounded border-2 text-center border-green-400 p-5 bg-green-300 hover:scale-105 hover:bg-green-400"
                            >
                                <p className="text-2xl mb-4 font-bold">Ngày bắt đầu năm học: </p>
                                <p className="text-4xl text-slate-700 font-mono">{nienKhoa.NgayBD ? nienKhoa.NgayBD : "Chưa đặt"}</p>
                            </div>
                            <div
                                className="w-[95%] mx-auto rounded border-2 text-center border-red-400 p-5 bg-red-300 hover:scale-105 hover:bg-red-400"
                            >
                                <p className="text-2xl mb-4 font-bold">Hạn cuối sửa điểm:</p>
                                <p className="text-4xl text-slate-700 font-mono">{nienKhoa.HanSuaDiem ? nienKhoa.HanSuaDiem : "Chưa đặt"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}