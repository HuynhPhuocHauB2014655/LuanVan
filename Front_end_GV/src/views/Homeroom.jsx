import { useRef, useState } from "react";
import { useUserContext } from "../context/userContext";
import { useEffect } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/Context";
import Loading from "../components/Loading";
import Menu from "../components/Menu";
import HocSinhTable from "../components/HocSinhTable";
import BangDiem from "../components/BangDiem";
import Draggable from "react-draggable";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AlterConfirm from "../components/Confirm";

export default function Homeroom() {
    const { userName } = useUserContext();
    const { nienKhoa, setMessage } = useStateContext();
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
    const [showButton, setShowButton] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [change,setChange] = useState(false);
    const dragRef = useRef();
    const formRef = useRef();
    const [count, setCount] = useState({
        Siso: 0,
        Nam: 0,
        Nu: 0,
    });
    useEffect(() => {
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
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userName, nienKhoa]);
    const handleState = async (view) => {
        if (view == 2) {
            fetchSubjects();
        }
        setState(view);
    }
    const fetchSubjects = async () => {
        if (datas && datas.lop) {
            var urlMH = '';
            if (datas.lop[0].MaLop.substring(0, 1) === "C") {
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
    }
    const handleSubState = (view) => {
        if (view == 3 || view == 4) {
            fetchDiemTB();
        }
        setSubState(view);
    }
    const fetchDiemTB = async () => {
        const payload = {
            MaNK: nienKhoa.NienKhoa,
            MaLop: datas.lop[0].MaLop
        }
        try {
            const response = await axiosClient.post(`/diem/tb`, payload);
            setDiemTB(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        if (state == 2 && subjects.length > 0) {
            const fetchDiem = async () => {
                const payloadHK1 = { MaHK: 1 + nienKhoa.NienKhoa, MaLop: datas.lop[0].MaLop };
                const payloadHK2 = { MaHK: 2 + nienKhoa.NienKhoa, MaLop: datas.lop[0].MaLop };
                const payloadCN = { MaHK: 2 + nienKhoa.NienKhoa, MaLop: datas.lop[0].MaLop };

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
            setMessage(typeof error.response.data == 'string' ? error.response.data : 'Lỗi không xác định');
        } finally {
            fetchDiemTB();
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
            fetchDiemTB();
        } catch (error) {
            setMessage(typeof error.response.data == 'string' ? error.response.data : 'Lỗi không xác định');
        } finally {
            fetchDiemTB();
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
        }catch(error){
            setMessage(typeof error.response.data == 'string' ? error.response.data : 'Lỗi không xác định');
        }finally{
            fetchDiemTB();
        }
    }
    const updateRL = (data) => {
        console.log(data);
    }
    const onConfirm = () => {
        setShowConfirm(0);
        formRef.current.submitForm();
    }
    const onCancel = () => {
        setShowConfirm(0);
    }
    const SetShowForm = (show) => {
        setShowForm(show);
    }
    const SetChange = (c) =>{
        setChange(c);
    }
    return (
        <div className="main-content">
            <Menu />
            <div className="right-part">
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
                                    <div className="w-full mx-auto grid grid-cols-5 grid-flow-row mt-2">
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
                                            className={subState == 5 ? "sub-head-active rounded-e-md" : "sub-head rounded-e-md"}
                                            onClick={() => handleSubState(5)}>Khen thưởng
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
                                            <div className="flex justify-end my-2">
                                                {change && <div className="text-red-400 text-xl me-2 mt-2">Nhấp vào mục tiêu cần sửa</div>}
                                                <button className="button border-blue-500 hover:bg-blue-300 hover:text-white" onClick={()=>SetChange(!change)}>{change ? <p className="text-red-500">Hủy</p> : <p>Sửa rèn luyện</p>}</button>
                                                <button className="button border-blue-500 hover:bg-blue-300 hover:text-white" onClick={()=>SetShowForm(1)}>Xét rèn luyện</button>
                                            </div>
                                            <table className="table-auto text-center w-full">
                                                <thead>
                                                    <tr>
                                                        <th className="border border-black">Mã số học sinh</th>
                                                        <th className="border border-black">Tên học sinh</th>
                                                        <th className="border border-black">Rèn luyện HK1</th>
                                                        <th className="border border-black">Rèn luyện HK2</th>
                                                        <th className="border border-black">Rèn luyện cả năm</th>
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
                                                                        <td className="border border-black text-red-500 cursor-pointer" onClick={() => updateRL(data)}>{data.ren_luyen_h_k1.TenRL}</td>
                                                                        :
                                                                        <td className="border border-black">{data.ren_luyen_h_k1.TenRL}</td>
                                                                    }
                                                                    {change && data.ren_luyen_h_k2.MaRl > 0  ?
                                                                        <td className="border border-black text-red-500 cursor-pointer" onClick={() => updateRL(data)}>{data.ren_luyen_h_k2.TenRL}</td>
                                                                        :
                                                                        <td className="border border-black">{data.ren_luyen_h_k2.TenRL}</td>
                                                                    }
                                                                    {change && data.ren_luyen.MaRL > 0  ?
                                                                        <td className="border border-black text-red-500 cursor-pointer" onClick={() => updateRL(data)}>{data.ren_luyen.TenRL}</td>
                                                                        :
                                                                        <td className="border border-black">{data.ren_luyen.TenRL}</td>
                                                                    }
                                                                </tr>
                                                            )
                                                        }
                                                    })}
                                                </tbody>
                                            </table>
                                            {showForm &&
                                                <Draggable nodeRef={dragRef} handle=".drag-handle">
                                                    <div className="z-10 absolute w-1/2 top-16 left-1/4" ref={dragRef}>
                                                        <div className="border-2 border-black rounded-lg bg-white">
                                                            <div className="absolute top-0 right-0">
                                                                <button className="X-button" onClick={() => setShowForm(0)}>X</button>
                                                            </div>
                                                            <div className="drag-handle cursor-move p-2 text-center text-xl border-b-2 border-slate-100 text-white bg-slate-400">Xét rèn luyện</div>
                                                            <div className="p-4">
                                                                <Formik
                                                                    initialValues={{
                                                                        MSHS: '',
                                                                        RenLuyen: '',
                                                                        LoaiRL: '',
                                                                    }}
                                                                    validationSchema={
                                                                        Yup.object().shape({
                                                                            MSHS: Yup.string().required('Bắt buộc'),
                                                                            RenLuyen: Yup.string().required('Bắt buộc'),
                                                                            LoaiRL: Yup.string().required('Bắt buộc'),
                                                                        })
                                                                    }
                                                                    enableReinitialize={true}
                                                                    onSubmit={handleSubmit}
                                                                    innerRef={formRef}
                                                                >
                                                                    <Form className="flex items-center justify-center">
                                                                        <div className="w-full max-w-lg p-3 space-y-4">
                                                                            <div className="grid grid-cols-1 grid-flow-row">
                                                                                <div className="w-[80%] mx-auto">
                                                                                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="MSHS">
                                                                                        Mã học sinh
                                                                                    </label>
                                                                                    <Field
                                                                                        type="text"
                                                                                        name="MSHS"
                                                                                        className="f-field"
                                                                                        placeholder="Nhập mã học sinh"
                                                                                    />
                                                                                    <ErrorMessage className="text-red-700 block mb-2" name="MSHS" component="div" />
                                                                                </div>
                                                                                <div className="w-[80%] mx-auto">
                                                                                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="RenLuyen">
                                                                                        Đánh giá rèn luyện
                                                                                    </label>
                                                                                    <Field
                                                                                        as="select"
                                                                                        name="RenLuyen"
                                                                                        className="f-field"
                                                                                    >
                                                                                        <option value="">Chọn đánh giá</option>
                                                                                        <option value="1">Chưa đạt</option>
                                                                                        <option value="2">Đạt</option>
                                                                                        <option value="3">Khá</option>
                                                                                        <option value="4">Tốt</option>
                                                                                    </Field>
                                                                                    <ErrorMessage className="text-red-700 block mb-2" name="RenLuyen" component="div" />
                                                                                </div>
                                                                                <div className="w-[80%] mx-auto">
                                                                                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="LoaiRL">
                                                                                        Học kì
                                                                                    </label>
                                                                                    <Field
                                                                                        as="select"
                                                                                        name="LoaiRL"
                                                                                        className="f-field"
                                                                                    >
                                                                                        <option value="">Chọn học kì</option>
                                                                                        <option value="1">Học kì 1</option>
                                                                                        <option value="2">Học kì 2</option>
                                                                                    </Field>
                                                                                    <ErrorMessage className="text-red-700 block mb-2" name="LoaiRL" component="div" />
                                                                                </div>
                                                                            </div>
                                                                            <button
                                                                                type="button"
                                                                                className="f-button"
                                                                                onClick={()=>setShowConfirm(1)}
                                                                            >
                                                                                Lưu
                                                                            </button>
                                                                        </div>
                                                                    </Form>
                                                                </Formik>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Draggable>
                                            }
                                            {showConfirm === 1 &&
                                                <AlterConfirm message={'Bạn có chắc chắn muốn đăng xuất không?'} onConfirm={onConfirm} onCancel={onCancel} />
                                            }
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