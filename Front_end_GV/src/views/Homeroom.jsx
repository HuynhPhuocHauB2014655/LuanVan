import { useState } from "react";
import { useUserContext } from "../context/userContext";
import { useEffect } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/Context";
import Loading from "../components/Loading";
import Menu from "../components/Menu";
import HocSinhTable from "../components/HocSinhTable";

export default function Homeroom() {
    const { userName } = useUserContext();
    const [chuNhiemNow, setChuNhiemNow] = useState({});
    const { nienKhoa } = useStateContext();
    const [loading, setLoading] = useState(true);
    const [datas, setDatas] = useState();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get(`/gv/show/${userName}`);
                setDatas(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userName]);
    useEffect(() => {
        if (datas) {
            setChuNhiemNow(datas.lop?.filter((item) => item.MaNK === nienKhoa.NienKhoa));
        };
    }, [datas, nienKhoa]);
    if (loading) {
        return <Loading />
    }
    return (
        <div className="main-content">
            <Menu />
            <div className="right-part">
                <h1 className="page-name">Quản lí lớp chủ nhiệm</h1>
                <div>
                    {Object.keys(chuNhiemNow).length > 0 ?
                        <div className="max-w-[90%] mt-2 mx-auto">
                            <p className="text-2xl font-bold text-center">Lớp chủ nhiệm hiện tại: {chuNhiemNow[0].TenLop}</p>
                            <HocSinhTable datas={chuNhiemNow[0].hoc_sinh}/>
                        </div>
                        :
                        <div className="min-h-[70vh] mx-auto max-w-[90%] flex justify-center items-center text-red-600 text-3xl">Bạn hiện không chủ nhiệm lớp nào</div>
                    }
                </div>
            </div>
        </div>
    )
}