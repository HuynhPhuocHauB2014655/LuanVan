import { useState } from "react";
import { useUserContext } from "../context/userContext";
import { useEffect } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/Context";
import Loading from "../components/Loading";
import Menu from "../components/Menu";
import HocSinhTable from "../components/HocSinhTable";
import BangDiem from "../components/BangDiem";

export default function Homeroom() {
    const { userName } = useUserContext();
    const [chuNhiemNow, setChuNhiemNow] = useState({});
    const { nienKhoa } = useStateContext();
    const [loading, setLoading] = useState(true);
    const [datas, setDatas] = useState();
    const [state, setState] = useState(1);
    const [subjects, setSubjects] = useState([]);
    const [loaiDiem, setLoaiDiem] = useState([]);
    const [diemHK1, setDiemHK1] = useState([]);
    const [diemHK2, setDiemHK2] = useState([]);
    const [diemCN, setDiemCN] = useState([]);
    const [count, setCount] = useState({
        Siso: 0,
        Nam: 0,
        Nu: 0,
    });
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
    const handleState = async (view) => {
        if (view == 2) {
            var urlMH = '';
            if (chuNhiemNow[0].MaLop.substring(0, 1) === "C") {
                urlMH = '/mh/xh';
            } else {
                urlMH = '/mh/tn';
            }
            try {
                const response = await axiosClient.get(urlMH);
                setSubjects(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        setState(view);
    }
    useEffect(() => {
        if (state == 2 && subjects.length > 0) {
            const fetchDiem = async () => {
                const payloadHK1 = { MaHK: 1 + nienKhoa.NienKhoa, MaLop: chuNhiemNow[0].MaLop };
                const payloadHK2 = { MaHK: 2 + nienKhoa.NienKhoa, MaLop: chuNhiemNow[0].MaLop };
                const payloadCN = { MaNK: nienKhoa.NienKhoa, MaLop: chuNhiemNow[0].MaLop };

                try {
                    const [diemHk1, diemHk2, diemCn, data] = await Promise.all([
                        axiosClient.post("/diem/cn", payloadHK1),
                        axiosClient.post("/diem/cn", payloadHK2),
                        axiosClient.post("/diem/cn/getCN", payloadCN),
                        axiosClient.get('/diem/loaidiem')
                    ]);
                    setDiemHK1(diemHk1.data);
                    setDiemHK2(diemHk2.data);
                    setDiemCN(diemCn.data);
                    setLoaiDiem(data.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchDiem();
        }
    }, [subjects])
    useEffect(() => {
        if (datas) {
            const filter = datas.lop?.filter((item) => item.MaNK === nienKhoa.NienKhoa)
            setChuNhiemNow(filter);
        };
    }, [datas, nienKhoa])
    useEffect(() => {
        if (chuNhiemNow.length > 0) {
            const newCount = {
                Siso: chuNhiemNow[0].hoc_sinh.length,
                Nam: chuNhiemNow[0].hoc_sinh.filter(item => item.GioiTinh === 'Nam').length,
                Nu: chuNhiemNow[0].hoc_sinh.filter(item => item.GioiTinh === 'Nữ').length,
            };
            setCount(newCount);
        }
    }, [chuNhiemNow]);
    if (loading) {
        return <Loading />
    }
    console.log(subjects)
    const loaiDiemHK = loaiDiem.filter(item => ['tx', 'gk', 'ck'].includes(item.MaLoai));
    return (
        <div className="main-content">
            <Menu />
            <div className="right-part">
                <h1 className="page-name">Quản lí lớp chủ nhiệm</h1>
                <div>
                    {Object.keys(chuNhiemNow).length > 0 ?
                        <div className="mt-2">
                            <div className="my-2 flex">
                                <button className="teacher-head" onClick={() => handleState(1)}>Danh sách lớp</button>
                                <button className="teacher-head" onClick={() => handleState(2)}>Xem điểm</button>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-2xl font-bold">Lớp chủ nhiệm hiện tại: {chuNhiemNow[0].TenLop}</p>
                                <p className="text-2xl font-bold">Sỉ số: {count.Siso}</p>
                                <p className="text-2xl font-bold">Nam: {count.Nam}</p>
                                <p className="text-2xl font-bold">Nữ: {count.Nu}</p>
                            </div>
                            {state == 1 ? <HocSinhTable datas={chuNhiemNow[0].hoc_sinh} />
                                :
                                <div className="">
                                    <div>
                                        <h2 className="text-2xl font-bold text-center mt-2">Điểm các môn học</h2>
                                        {subjects.map((mh) => (
                                            <div className="my-2">
                                                <h3 className="text-2xl font-bold">Tên môn: {mh.TenMH}</h3>
                                                <BangDiem
                                                    hocSinh={chuNhiemNow[0].hoc_sinh}
                                                    loaiDiem={loaiDiemHK}
                                                    diemHK1={diemHK1.filter(item => item.MaMH === mh.MaMH)}
                                                    diemHK2={diemHK2.filter(item => item.MaMH === mh.MaMH)}
                                                    diemCN={diemCN.filter(item => item.MaMH === mh.MaMH)}
                                                    show={0}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            }
                        </div>
                        :
                        <div className="min-h-[70vh] mx-auto max-w-[90%] flex justify-center items-center text-red-600 text-3xl">Bạn hiện không chủ nhiệm lớp nào</div>
                    }
                </div>
            </div>
        </div>
    )
}