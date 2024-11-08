import { useState } from "react";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { useStateContext } from "../context/Context";
import { useUserContext } from "../context/userContext";
import { useEffect } from "react";
import axiosClient from "../axios-client";
import Header from "../components/Header";

export default function Class() {
    const { userName } = useUserContext();
    const { nienKhoa } = useStateContext();
    const [loading, setLoading] = useState(true);
    const [datas, setDatas] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const payload = {
                    MaNK: nienKhoa.NienKhoa,
                    MSGV: userName,
                }
                const response = await axiosClient.post(`/gv/teaching`,payload);
                setDatas(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userName,nienKhoa]);

    const handleToClass = (data) => {
        navigate('/class-info', { state: { classData: data } });
    };
    if (loading) {
        return <Loading />
    }
    return (
        <div>
            <Header/>
            <div className="main-content">
            <Menu />
            <div className="right-part">
                <h1 className="page-name">Quản lí dạy học</h1>
                <table className="mt-3 w-full ">
                    <thead>
                        <tr className="bg-slate-400">
                            <th className="text-start text-2xl p-3">Các lớp đang dạy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datas.map((data, index) => (
                            <tr
                                key={data.MaLop}
                                className={`hover:bg-cyan-200 ${index % 2 === 0 ? 'bg-slate-300' : 'bg-white'}`}
                            >
                                <td 
                                    className="hover:cursor-pointer text-2xl p-3 border-t"
                                    onClick={()=>{handleToClass(data)}}
                                >
                                    <span className="font-semibold">Mã lớp:</span> {data.lop.MaLop} -
                                    <span className="font-semibold">Tên lớp:</span> {data.lop.TenLop} -
                                    <span className="font-semibold"> Môn dạy:</span> {data.mon_hoc.TenMH} -
                                    <span className="font-semibold"> Sỉ số:</span> {data.lop.hoc_sinh.length}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    )
}