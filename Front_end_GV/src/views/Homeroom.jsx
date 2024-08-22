import { useRef, useState, useEffect } from "react";
import { useUserContext } from "../context/userContext";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/Context";
import Loading from "../components/Loading";
import Menu from "../components/Menu";
import HocSinhTable from "../components/HocSinhTable";
import BangDiem from "../components/BangDiem";
import Draggable from "react-draggable";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import AlterConfirm from "../components/Confirm";
import RenLuyenForm from "../components/RenLuyenForm";

export default function Homeroom() {
    const { userName } = useUserContext();
    const { nienKhoa, setMessage, setError } = useStateContext();
    const [loading, setLoading] = useState(true);
    const [datas, setDatas] = useState([]);
    const [state, setState] = useState(1);
    const [renLuyen, setRenLuyen] = useState([]);
    const [subState, setSubState] = useState(1);
    const [subjects, setSubjects] = useState([]);
    const [loaiDiem, setLoaiDiem] = useState([]);
    const [diemHK1, setDiemHK1] = useState([]);
    const [diemHK2, setDiemHK2] = useState([]);
    const [diemCN, setDiemCN] = useState([]);
    const [diemTB, setDiemTB] = useState([]);
    const [showForm, setShowForm] = useState(0);
    const [disableHK1, setDisableHK1] = useState(false);
    const [disableHK2, setDisableHK2] = useState(false);
    const [disableCN, setDisableCN] = useState(false);
    const [disableRL, setDisableRL] = useState(false);
    const [disableTT, setDisableTT] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const [renLuyenHeHT, setRenLuyenHeHT] = useState([]);
    const [renLuyenHeRL, setRenLuyenHeRL] = useState([]);
    const [dsKhenThuong, setDSKhenThuong] = useState([]);
    const [showConfirm, setShowConfirm] = useState(0);
    const [monRLH, setMonRLH] = useState([]);
    const [diemRLH, setDiemRLH] = useState([]);
    const [change, setChange] = useState(false);
    const [hanSuaDiem, setHanSuaDiem] = useState(true);
    const [initialValues, setInitialValues] = useState();
    const [hoten, setHoten] = useState();
    const dragRef = useRef();
    const [count, setCount] = useState({
        Siso: 0,
        Nam: 0,
        Nu: 0,
    });
    const fetchData = async () => {
        const payload = {
            MaNK: nienKhoa.NienKhoa,
            MSGV: userName,
        }
        try {
            const response = await axiosClient.post(`/gv/show/cn`, payload);
            setDatas(response.data);
            const renluyen = await axiosClient.get('/rl/index');
            setRenLuyen(renluyen.data);
            var urlMH = '';
            if (response.data?.lop[0].MaLop.substring(0, 1) === "C") {
                urlMH = '/mh/xh';
            } else {
                urlMH = '/mh/tn';
            }
            const sujs = await axiosClient.get(urlMH);
            setSubjects(sujs.data);

            const payloadHK1 = { MaHK: 1 + nienKhoa.NienKhoa, MaLop: response.data.lop[0].MaLop };
            const payloadHK2 = { MaHK: 2 + nienKhoa.NienKhoa, MaLop: response.data.lop[0].MaLop };
            const payloadCN = { MaHK: 2 + nienKhoa.NienKhoa, MaLop: response.data.lop[0].MaLop };
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

            const payload1 = {
                MaNK: nienKhoa.NienKhoa,
                MaLop: response.data?.lop[0].MaLop
            }
            const diemtb = await axiosClient.post(`/diem/tb`, payload1);
            setDiemTB(diemtb.data);
            diemtb.data.map((item) => {
                if (item.MaRL_HK1 == 0 || item.MaRL_HK2 == 0) {
                    setDisableRL(true);
                }
                if (item.MaRL == 0 || item.MaHL == 0) {
                    setDisableTT(true);
                }
            })
            const rlhht = diemtb.data.filter(item => (item.MaTT == 2 && item.MaHL == 1) || item.MaHLL != 0);
            setRenLuyenHeHT(rlhht);
            const rlhrl = diemtb.data.filter(item => (item.MaTT == 2 && item.MaRL == 1) || item.MaRLL != 0);
            setRenLuyenHeRL(rlhrl);


            const date = new Date();
            if (date > new Date(nienKhoa.HanSuaDiem)) {
                setHanSuaDiem(false);
            }
            const payload2 = {
                MaLop: response.data.lop[0].MaLop,
                MaHK: "2" + nienKhoa.NienKhoa,
            }
            const diemduoi5 = await axiosClient.post('/diem/mon/rlh', payload2);
            setMonRLH(diemduoi5.data);
            var monDuoi5 = [];
            diemduoi5.data.map((item) => {
                monDuoi5.push(item.MaMH);
            })
            const payload3 = {
                monRLH: monDuoi5,
                MaLop: response.data.lop[0].MaLop,
                MaHK: "2" + nienKhoa.NienKhoa
            }
            const res = await axiosClient.post('/diem/rlh', payload3);
            setDiemRLH(res.data);
            if (!diemtb.data.find(item => item.MaHL == 0 || item.MaRL == 0)) {
                var array = [];
                diemtb.data.map((hs) => {
                    if (hs.MaHL == 4 && hs.MaRL == 4) {
                        if (diemTB.filter(item => item.MSHS == hs.MSHS && item.Diem_TB_CN >= 9).length >= 6) {
                            array.push({
                                MSHS: hs.MSHS,
                                HoTen: hs.hoc_sinh.HoTen,
                                KhenThuong: "Học sinh Xuất sắc",
                                MaLop: response.data.lop[0].MaLop,
                            })
                        } else {
                            array.push({
                                MSHS: hs.MSHS,
                                HoTen: hs.hoc_sinh.HoTen,
                                KhenThuong: "Học sinh Giỏi",
                                MaLop: response.data.lop[0].MaLop,
                            })
                        }
                    }
                })
                setDSKhenThuong(array);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [userName, nienKhoa]);
    const handleState = async (view) => {
        setState(view);
    }
    const handleSubState = (view) => {
        setSubState(view);
    }
    useEffect(() => {
        if (datas && Object.keys(datas).length > 0) {
            const newCount = {
                Siso: datas.lop[0].hoc_sinh.length,
                Nam: datas.lop[0].hoc_sinh.filter(item => item.GioiTinh === 'Nam').length,
                Nu: datas.lop[0].hoc_sinh.filter(item => item.GioiTinh === 'Nữ').length,
            };
            setCount(newCount);
        }
    }, [datas]);
    if (loading) {
        return <Loading />
    }
    const loaiDiemHK = loaiDiem.filter(item => ['tx', 'gk', 'ck'].includes(item.MaLoai));
    const TinhDiemTBHK = async (hk) => {
        const payload = {
            MaHK: hk + nienKhoa.NienKhoa,
            MaLop: datas.lop[0].MaLop
        }
        try {
            const res = await axiosClient.post('/diem/tk/hocki', payload);
            setMessage(res.data);
        } catch (error) {
            setError(typeof error.response.data == 'string' ? error.response.data : 'Lỗi không xác định');
        } finally {
            fetchData();
            changeShowButton();
        }
    }
    const TinhDiemTBCN = async () => {
        const payload = {
            MaNK: nienKhoa.NienKhoa,
            MaLop: datas.lop[0].MaLop
        }
        try {
            const res = await axiosClient.post('/diem/tk/namhoc', payload);
            setMessage(res.data);
            fetchData();
        } catch (error) {
            setError(typeof error.response.data == 'string' ? error.response.data : 'Lỗi không xác định');
        } finally {
            fetchData();
            changeShowButton();
        }
    }
    const changeShowButton = () => {
        var checkHK1 = false;
        var checkHK2 = false;
        var checkCN = false;
        datas.lop[0].hoc_sinh.map((item) => {
            const tbhk1 = diemHK1.filter(data => data.MaLoai == 'tbhk1' && data.MSHS == item.MSHS);
            const tbhk2 = diemHK2.filter(data => data.MaLoai == 'tbhk2' && data.MSHS == item.MSHS);
            const tbcn = diemCN.filter(data => data.MaLoai == 'tbcn' && data.MSHS == item.MSHS);
            if (tbhk1.length < 10) checkHK1 = true;
            if (tbhk2.length < 10) checkHK2 = true;
            if (tbcn.length < 10) checkCN = true;
        })
        setDisableHK1(checkHK1);
        setDisableHK2(checkHK2);
        setDisableCN(checkCN);
        setShowButton(!showButton);
    }
    const handleSubmit = async (value) => {
        const payload = {
            MaNK: nienKhoa.NienKhoa,
            MSHS: value.MSHS,
            MaLop: datas.lop[0].MaLop,
            RenLuyen: value.RenLuyen,
            LoaiRL: value.LoaiRL,
        }
        try {
            const res = await axiosClient.post('/rl/add', payload);
            setMessage(res.data);
        } catch (error) {
            setError(typeof error.response.data == 'string' ? error.response.data : 'Lỗi không xác định');
        } finally {
            fetchData();
        }
    }
    const showUpdateRL = (data, HK) => {
        setInitialValues({
            MSHS: data.MSHS,
            RenLuyen: HK == 1 ? data.MaRL_HK1 : data.MaRL_HK2,
            LoaiRL: HK,
        })
        setShowForm(2);
    }
    const handelUpdateRL = async (value) => {
        const payload = {
            MaNK: nienKhoa.NienKhoa,
            MSHS: value.MSHS,
            MaLop: datas.lop[0].MaLop,
            RenLuyen: value.RenLuyen,
            LoaiRL: value.LoaiRL,
        }
        try {
            const res = await axiosClient.post('/rl/update', payload);
            setMessage(res.data);
        } catch (error) {
            setError(typeof error.response.data == 'string' ? error.response.data : 'Lỗi không xác định');
        } finally {
            fetchData();
        }
    }
    const SetShowForm = (show) => {
        if (show == 1) {
            setInitialValues({
                MSHS: '',
                RenLuyen: '',
                LoaiRL: '',
            })
        }
        setShowForm(show);
    }
    const SetChange = (c) => {
        setChange(c);
    }
    const danhGiaRLCN = async () => {
        try {
            const res = await axiosClient.get(`/rl/${datas.lop[0].MaLop}`);
            setMessage(res.data);
        } catch (error) {
            setError(typeof error.response.data == 'string' ? error.response.data : 'Lỗi không xác định');
        } finally {
            fetchData();
        }
    }
    const xetLenLop = async () => {
        try {
            const res = await axiosClient.get(`/tk/${datas.lop[0].MaLop}`);
            setMessage(res.data);
        } catch (error) {
            setError(typeof error.response.data == 'string' ? error.response.data : 'Lỗi không xác định');
        } finally {
            fetchData();
        }
    }
    const getName = (event) => {
        const Mshs = event.target.value;
        const hocsinh = diemTB.find(hs => hs.MSHS == Mshs);
        if (hocsinh) {
            setHoten(hocsinh.hoc_sinh.HoTen || '');
        } else {
            setHoten('');
        }
    }
    // console.log(datas);
    return (
        <div className="main-content">
            <Menu />
            <div className="right-part relative">
                <h1 className="page-name">Quản lí lớp chủ nhiệm</h1>
                <div>
                    {Object.keys(datas).length > 0 ?
                        <div className="mt-2">
                            <div className="my-2 flex">
                                <button className="teacher-head" onClick={() => handleState(1)}>Danh sách lớp</button>
                                <button className="teacher-head" onClick={() => handleState(2)}>Xem điểm</button>
                            </div>
                            <div className="flex justify-between w-[90%] mx-auto">
                                <p className="text-2xl font-bold">Lớp chủ nhiệm hiện tại: {datas.lop[0].TenLop}</p>
                                <p className="text-2xl font-bold">Sỉ số: {count.Siso}</p>
                                <p className="text-2xl font-bold">Nam: {count.Nam}</p>
                                <p className="text-2xl font-bold">Nữ: {count.Nu}</p>
                            </div>
                            {state == 1 ? <HocSinhTable datas={datas.lop[0]?.hoc_sinh} />
                                :
                                <div className="">
                                    <div className="w-full mx-auto grid grid-rows-1 grid-flow-col mt-2">
                                        <button
                                            className={subState == 1 ? "sub-head-active rounded-s-md" : "sub-head rounded-s-md"}
                                            onClick={() => handleSubState(1)}>Điểm chi tiết
                                        </button>
                                        <button
                                            className={subState == 2 ? "sub-head-active" : "sub-head"}
                                            onClick={() => handleSubState(2)}>Điểm trung bình môn
                                        </button>
                                        <button
                                            className={subState == 3 ? "sub-head-active" : "sub-head"}
                                            onClick={() => handleSubState(3)}>Điểm trung bình
                                        </button>
                                        <button
                                            className={subState == 4 ? "sub-head-active" : "sub-head"}
                                            onClick={() => handleSubState(4)}>Rèn luyện
                                        </button>
                                        <button
                                            className={subState == 5 ? "sub-head-active" : "sub-head"}
                                            onClick={() => handleSubState(5)}>Xét lên lớp
                                        </button>
                                        <button
                                            className={subState == 6 ? "sub-head-active" : "sub-head"}
                                            onClick={() => handleSubState(6)}>Rèn luyện hè
                                        </button>
                                        <button
                                            className={subState == 7 ? "sub-head-active rounded-e-md" : "sub-head rounded-e-md"}
                                            onClick={() => handleSubState(7)}>Khen thưởng
                                        </button>
                                    </div>
                                    {subState == 1 &&
                                        <div>
                                            <h2 className="text-2xl font-bold text-center my-2 border-b-2 w-1/3 mx-auto border-blue-400">Điểm các môn học</h2>
                                            {subjects.map((mh) => (
                                                <div key={mh.MaMH} className="my-2">
                                                    <h3 className="text-2xl font-bold">Tên môn: {mh.TenMH}</h3>
                                                    <BangDiem
                                                        hocSinh={datas.lop[0]?.hoc_sinh}
                                                        loaiDiem={loaiDiemHK}
                                                        diemHK1={diemHK1.filter(item => item.MaMH === mh.MaMH)}
                                                        diemHK2={diemHK2.filter(item => item.MaMH === mh.MaMH)}
                                                        diemCN={diemCN.filter(item => item.MaMH === mh.MaMH)}
                                                        show={0}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    }
                                    {subState == 2 &&
                                        <div>
                                            <h2 className="text-2xl font-bold text-center my-2 border-b-2 w-1/3 mx-auto border-blue-400">Điểm trung bình môn</h2>
                                            <div className="space-y-3">
                                                {subjects.map((item) => (
                                                    <div className="text-center" key={item.MaMH}>
                                                        <h3 className="text-2xl font-bold">Tên môn: {item.TenMH}</h3>
                                                        <table className="border table-auto border-black border-collapse mx-auto">
                                                            <thead>
                                                                <tr>
                                                                    <th className="border border-black">Mã số học sinh</th>
                                                                    <th className="border border-black">Tên học sinh</th>
                                                                    <th className="border border-black">Điểm trung bình HK1</th>
                                                                    <th className="border border-black">Điểm trung bình HK2</th>
                                                                    <th className="border border-black">Điểm trung bình cả năm</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {datas.lop[0]?.hoc_sinh.map((hs) => {
                                                                    const tbhk1 = diemHK1?.find((diem) => diem.MaMH === item.MaMH && diem.MaLoai === "tbhk1" && diem.MSHS === hs.MSHS);
                                                                    const tbhk2 = diemHK2?.find((diem) => diem.MaMH === item.MaMH && diem.MaLoai === "tbhk2" && diem.MSHS === hs.MSHS);
                                                                    const tbcn = diemCN?.find((diem) => diem.MaMH === item.MaMH && diem.MaLoai === "tbcn" && diem.MSHS === hs.MSHS);
                                                                    let diemhk1, diemhk2, diemcn;
                                                                    if (item.MaMH === "CB4" || item.MaMH === "CB5") {
                                                                        diemhk1 = tbhk1?.Diem == 0 ? "Chưa đạt" : tbhk1?.Diem == 1 ? "Đạt" : "-";
                                                                        diemhk2 = tbhk2?.Diem == 0 ? "Chưa đạt" : tbhk2?.Diem == 1 ? "Đạt" : "-";
                                                                        diemcn = tbcn?.Diem == 0 ? "Chưa đạt" : tbcn?.Diem == 1 ? "Đạt" : "-";
                                                                    } else {
                                                                        diemhk1 = tbhk1?.Diem ?? "-";
                                                                        diemhk2 = tbhk2?.Diem ?? "-";
                                                                        diemcn = tbcn?.Diem ?? "-";
                                                                    }

                                                                    return (
                                                                        <tr key={hs.MSHS}>
                                                                            <td className="border border-black">{hs.MSHS}</td>
                                                                            <td className="border border-black">{hs.HoTen}</td>
                                                                            <td className="border border-black max-w-[50px]">{diemhk1}</td>
                                                                            <td className="border border-black max-w-[50px]">{diemhk2}</td>
                                                                            <td className="border border-black max-w-[50px]">{diemcn}</td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>

                                                        </table>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    }
                                    {subState == 3 &&
                                        <div>
                                            <h2 className="text-2xl font-bold text-center my-2 border-b-2 w-1/3 mx-auto border-blue-400">Điểm trung bình</h2>
                                            <div className="w-[90%] mx-auto">
                                                <div className="flex justify-end w-full space-x-2 mb-1">
                                                    {showButton &&
                                                        <div className="flex text-sm space-x-1">
                                                            <button
                                                                className="px-1 w-[70px] border border-cyan-300 rounded hover:bg-cyan-300 hover:text-white"
                                                                disabled={disableHK1}
                                                                onClick={() => TinhDiemTBHK(1)}>HK1</button>
                                                            <button
                                                                className="px-1 w-[70px] border border-cyan-300 rounded hover:bg-cyan-300 hover:text-white"
                                                                disabled={disableHK2}
                                                                onClick={() => TinhDiemTBHK(2)}>HK2</button>
                                                            <button
                                                                className="px-1 w-[70px] border border-cyan-300 rounded hover:bg-cyan-300 hover:text-white"
                                                                disabled={disableCN}
                                                                onClick={() => TinhDiemTBCN()}>Cả năm</button>
                                                        </div>
                                                    }
                                                    <button
                                                        className=" bg-blue-400 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                                        onClick={() => changeShowButton(!showButton)}> {!showButton ? "Tính điểm" : "Hủy"}
                                                    </button>
                                                </div>
                                                <table className="table-auto text-center w-full">
                                                    <thead>
                                                        <tr>
                                                            <th className="border border-black">Mã số học sinh</th>
                                                            <th className="border border-black">Tên học sinh</th>
                                                            <th className="border border-black">Điểm trung bình HK1</th>
                                                            <th className="border border-black">Xếp loại HK1</th>
                                                            <th className="border border-black">Điểm trung bình HK2</th>
                                                            <th className="border border-black">Xếp loại HK2</th>
                                                            <th className="border border-black">Điểm trung bình cả năm</th>
                                                            <th className="border border-black">Xếp loại cả năm</th>
                                                            <th className="border border-black">Xếp loại sau rèn luyện hè</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {datas.lop[0]?.hoc_sinh.map((hs) => {
                                                            const data = diemTB?.find((diem) => diem.MSHS == hs.MSHS);
                                                            if (data) {
                                                                return (
                                                                    <tr key={hs.MSHS}>
                                                                        <td className="border border-black">{hs.MSHS}</td>
                                                                        <td className="border border-black">{hs.HoTen}</td>
                                                                        <td className="border border-black">{data.Diem_TB_HKI || "-"}</td>
                                                                        <td className="border border-black">{data.hoc_luc_h_k1.TenHL}</td>
                                                                        <td className="border border-black">{data.Diem_TB_HKII || "-"}</td>
                                                                        <td className="border border-black">{data.hoc_luc_h_k2.TenHL}</td>
                                                                        <td className="border border-black">{data.Diem_TB_CN || "-"}</td>
                                                                        <td className="border border-black">{data.hoc_luc.TenHL}</td>
                                                                        <td className="border border-black">{data.MaHLL > 0 ? data.hoc_luc_lai.TenHL : "-"}</td>
                                                                    </tr>
                                                                )
                                                            }
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    }
                                    {subState == 4 &&
                                        <div className="relative">
                                            <h2 className="text-2xl font-bold text-center my-2 border-b-2 w-1/3 mx-auto border-blue-400">Đánh giá rèn luyện</h2>
                                            {hanSuaDiem ?
                                                <div className="flex justify-between my-2">
                                                    <button className="button border-blue-500 hover:bg-blue-300 hover:text-white" disabled={disableRL} onClick={danhGiaRLCN}>Xét rèn luyện cả năm</button>
                                                    <div className="flex">
                                                        {change && <div className="text-red-400 text-xl me-2 mt-2">Nhấp vào mục tiêu cần sửa</div>}
                                                        <button className="button border-blue-500 hover:bg-blue-300 hover:text-white" onClick={() => SetChange(!change)}>{change ? <p className="text-red-500">Hủy</p> : <p>Sửa rèn luyện</p>}</button>
                                                        <button className="button border-blue-500 hover:bg-blue-300 hover:text-white" onClick={() => SetShowForm(1)}>Xét rèn luyện</button>
                                                    </div>
                                                </div>
                                                :
                                                <div className="text-center text-red-500 text-xl my-2">Đã hết hạn sửa điểm và đánh giá rèn luyện</div>
                                            }
                                            <table className="table-auto text-center w-full">
                                                <thead>
                                                    <tr>
                                                        <th className="border border-black">Mã số học sinh</th>
                                                        <th className="border border-black">Tên học sinh</th>
                                                        <th className="border border-black">Rèn luyện HK1</th>
                                                        <th className="border border-black">Rèn luyện HK2</th>
                                                        <th className="border border-black">Rèn luyện cả năm</th>
                                                        <th className="border border-black">Rèn luyện lại trong hè</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {datas.lop[0]?.hoc_sinh.map((hs) => {
                                                        const data = diemTB?.find((diem) => diem.MSHS == hs.MSHS);
                                                        if (data) {
                                                            return (
                                                                <tr key={hs.MSHS}>
                                                                    <td className="border border-black">{hs.MSHS}</td>
                                                                    <td className="border border-black">{hs.HoTen}</td>
                                                                    {change && data.ren_luyen_h_k1.MaRL > 0 ?
                                                                        <td className="border border-black text-red-500 cursor-pointer" onClick={() => showUpdateRL(data, 1)}>{data.ren_luyen_h_k1.TenRL}</td>
                                                                        :
                                                                        <td className="border border-black">{data.ren_luyen_h_k1.TenRL}</td>
                                                                    }
                                                                    {change && data.ren_luyen_h_k2.MaRL > 0 ?
                                                                        <td className="border border-black text-red-500 cursor-pointer" onClick={() => showUpdateRL(data, 2)}>{data.ren_luyen_h_k2.TenRL}</td>
                                                                        :
                                                                        <td className="border border-black">{data.ren_luyen_h_k2.TenRL}</td>
                                                                    }
                                                                    <td className="border border-black">{data.ren_luyen.TenRL}</td>
                                                                    {change && data.ren_luyen_h_k2.MaRL > 0 ?
                                                                        <td className="border border-black text-red-500 cursor-pointer" onClick={() => showUpdateRL(data, 2)}>{data.MaRLL > 0 ? data.ren_luyen_lai.TenRL : "-"}</td>
                                                                        :
                                                                        <td className="border border-black">{data.MaRLL > 0 ? data.ren_luyen_lai.TenRL : "-"}</td>
                                                                    }
                                                                </tr>
                                                            )
                                                        }
                                                    })}
                                                </tbody>
                                            </table>
                                            {showForm == 1 &&
                                                <Draggable nodeRef={dragRef} handle=".drag-handle">
                                                    <div ref={dragRef} className="z-10 absolute w-1/2 top-16 left-1/4">
                                                        <RenLuyenForm initialValues={initialValues} handler={handleSubmit} showForm={setShowForm} disable={false} />
                                                    </div>
                                                </Draggable>
                                            }
                                            {showForm == 2 &&
                                                <Draggable nodeRef={dragRef} handle=".drag-handle">
                                                    <div ref={dragRef} className="z-10 absolute w-1/2 top-16 left-1/4">
                                                        <RenLuyenForm initialValues={initialValues} handler={handelUpdateRL} showForm={setShowForm} disable={true} />
                                                    </div>
                                                </Draggable>
                                            }
                                        </div>
                                    }
                                    {subState == 5 &&
                                        <div>
                                            <h2 className="text-2xl font-bold text-center my-2 border-b-2 w-1/3 mx-auto border-blue-400">Xét lên lớp</h2>
                                            <div className="my-2">
                                                <button className="button border-green-500 hover:bg-green-400 hover:text-white" disabled={disableTT} onClick={xetLenLop}>Xét lên lớp</button>
                                            </div>
                                            <table className="table-auto text-center w-full">
                                                <thead>
                                                    <tr>
                                                        <th className="border border-black">Mã số học sinh</th>
                                                        <th className="border border-black">Tên học sinh</th>
                                                        <th className="border border-black">Xếp loại cả năm</th>
                                                        <th className="border border-black">Rèn luyện cả năm</th>
                                                        <th className="border border-black">Trạng thái</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {datas.lop[0]?.hoc_sinh.map((hs) => {
                                                        const data = diemTB?.find((diem) => diem.MSHS == hs.MSHS);
                                                        if (data) {
                                                            return (
                                                                <tr key={hs.MSHS}>
                                                                    <td className="border border-black">{hs.MSHS}</td>
                                                                    <td className="border border-black">{hs.HoTen}</td>
                                                                    <td className="border border-black">{data.hoc_luc.TenHL}</td>
                                                                    <td className="border border-black">{data.ren_luyen.TenRL}</td>
                                                                    <td className="border border-black">{data.trang_thai.TenTT}</td>
                                                                </tr>
                                                            )
                                                        }
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    }
                                    {subState == 6 &&
                                        <div>
                                            <h2 className="text-2xl font-bold text-center my-2 border-b-2 w-1/3 mx-auto border-blue-400">Rèn luyện hè</h2>
                                            {renLuyenHeHT.length > 0 || renLuyenHeRL.length > 0 ?
                                                <div>
                                                    <h1 className="text-2xl my-2 font-semibold">Học sinh phải rèn luyện kết quả học tập trong hè</h1>
                                                    {renLuyenHeHT.length > 0 &&
                                                        <div>
                                                            <table className="table-auto w-[70%]">
                                                                <thead>
                                                                    <tr>
                                                                        <th className="border border-black">Mã số học sinh</th>
                                                                        <th className="border border-black">Tên học sinh</th>
                                                                        <th className="border border-black">Môn học cần rèn luyện lại</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {renLuyenHeHT?.map((hs) => {
                                                                        const data = monRLH?.filter((diem) => diem.MSHS == hs.MSHS && diem.MaMH != "CB4" && diem.MaMH != "CB5");
                                                                        const data1 = monRLH?.filter((diem) => diem.MSHS == hs.MSHS && (diem.MaMH == "CB4" || diem.MaMH == "CB5") && diem.Diem == 0);
                                                                        if (data) {
                                                                            return (
                                                                                <tr key={hs.MSHS}>
                                                                                    <td className="border border-black">{hs?.hoc_sinh.MSHS}</td>
                                                                                    <td className="border border-black">{hs?.hoc_sinh.HoTen}</td>
                                                                                    <td className="border border-black">
                                                                                        <div className=" space-x-2">
                                                                                            {data.map((item, index) => (
                                                                                                <span key={index}>{item?.mon_hoc.TenMH}</span>
                                                                                            ))}
                                                                                            {data1.map((item, index) => (
                                                                                                <span key={index}>{item?.mon_hoc.TenMH}</span>
                                                                                            ))}
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        }
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                            <h1 className="text-2xl my-2 font-semibold">Kết quả rèn luyện hè</h1>
                                                            <div className="grid grid-cols-4 grid-flow-row space-x-1 space-y-1 mx-3">
                                                                {renLuyenHeHT.map((hs) => (
                                                                    <div key={hs.MSHS} style={{ margin: 0 }} className="space-x-1 space-y-1">
                                                                        <h1 className="text-lg my-2">{hs.hoc_sinh.HoTen}</h1>
                                                                        <table className="table-fixed" style={{ margin: 0 }}>
                                                                            <thead>
                                                                                <tr>
                                                                                    <th className="border border-black px-2">Tên môn</th>
                                                                                    <th className="border border-black px-2">Điểm rèn luyện lại</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {monRLH?.filter((diem) => diem.MSHS == hs.MSHS).map((data) => (
                                                                                    <tr key={data.MaMH}>
                                                                                        <td className="border border-black px-2">{data?.mon_hoc.TenMH}</td>
                                                                                        <td className="border border-black px-2 text-center">{diemRLH.find(item => item.MaMH == data.MaMH)?.Diem || "-"}</td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                ))}


                                                            </div>
                                                        </div>
                                                    }
                                                    <h1 className="text-2xl my-2 font-semibold">Học sinh phải rèn luyện lại điểm rèn luyện trong hè</h1>
                                                    {renLuyenHeRL.length > 0 &&
                                                        <table className="table-auto text-center  w-[70%]">
                                                            <thead>
                                                                <tr>
                                                                    <th className="border border-black">Mã số học sinh</th>
                                                                    <th className="border border-black">Tên học sinh</th>
                                                                    <th className="border border-black">Xét rèn luyện lại</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {renLuyenHeRL?.map((hs) => {
                                                                    return (
                                                                        <tr key={hs.MSHS}>
                                                                            <td className="border border-black">{hs?.hoc_sinh.MSHS}</td>
                                                                            <td className="border border-black">{hs?.hoc_sinh.HoTen}</td>
                                                                            <td className="border border-black">{hs?.ren_luyen_lai.TenRL}</td>
                                                                        </tr>
                                                                    )
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    }
                                                </div>
                                                :
                                                <div className="text-2xl text-green-300 font-bold text-center">Không có học sinh phải rèn luyện thêm trong hè</div>
                                            }
                                        </div>
                                    }
                                    {subState == 7 &&
                                        <div className="relative">
                                            <h2 className="text-2xl font-bold text-center my-2 border-b-2 w-1/3 mx-auto border-blue-400">Khen thưởng</h2>
                                            <h1 className="text-center font-bold text-2xl mt-3">Danh sách đề xuất khen thưởng</h1>
                                            <div className="w-[70%] mx-auto">
                                                <table className="table w-full text-xl">
                                                    <thead>
                                                        <tr>
                                                            <th className="border border-black px-2">Mã số học sinh</th>
                                                            <th className="border border-black px-2">Tên học sinh</th>
                                                            <th className="border border-black px-2">Đề xuất khen thưởng</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dsKhenThuong?.map((item) => (
                                                            <tr key={item.MSHS}>
                                                                <td className="border border-black px-2">{item.MSHS}</td>
                                                                <td className="border border-black px-2">{item.HoTen}</td>
                                                                <td className="border border-black px-2">{item.KhenThuong}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                    }

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