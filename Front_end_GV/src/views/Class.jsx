import { useState } from "react";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { useStateContext } from "../context/Context";
import { useUserContext } from "../context/userContext";
import { useEffect } from "react";
import axiosClient from "../axios-client";

export default function Class() {
    const { userName } = useUserContext();
    const { nienKhoa } = useStateContext();
    const [loading, setLoading] = useState(true);
    const [datas, setDatas] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get(`/gv/teaching/${userName}`);
                setDatas(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userName]);

    const handleToClass = (data) => {
        navigate('/class-info', { state: { classData: data } });
    };
    if (loading) {
        return <Loading />
    }
    return (
        <div className="main-content">
            <Menu />
            <div className="right-part">
                <h1 className="page-name">Quản lí dạy học</h1>
                <table className="border-2 border-slate-500 border-collapse mt-3 w-full">
                    <thead>
                        <tr className="bg-slate-200">
                            <th className="text-start text-2xl p-3">Các lớp đang dạy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datas.map((data, index) => (
                            <tr
                                key={data.MaLop}
                                className={`hover:bg-slate-100 ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}
                            >
                                <td 
                                    className="hover:cursor-pointer text-2xl p-3 border-t"
                                    onClick={()=>{handleToClass(data)}}
                                >
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
    )
}