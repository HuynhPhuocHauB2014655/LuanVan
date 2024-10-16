import axiosClient from "../axios-client";
import React, { useEffect, useState } from 'react';
import { useStateContext } from "../context/Context";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Menu from "../components/Menu";
import AlterConfirm from "../components/Confirm";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";
export default function TKB() {
    const [classes, setClasses] = useState([]);
    const [subjectTN, setSubjectTN] = useState([]);
    const [subjectXH, setSubjectXH] = useState([]);
    const [tkb, settkb] = useState([]);
    const [date, setdate] = useState([]);
    const [show, setShow] = useState('');
    const { setMessage, setError } = useStateContext();
    const { nienKhoa } = useStateContext(false);
    const [disable, setDisable] = useState(true);
    const [state, setState] = useState(0);
    const [TKB, setTKB] = useState([]);
    const [changeTKB, setChangeTKB] = useState();
    const [change1, setChange1] = useState();
    const [change2, setChange2] = useState();
    const [showConfirm, setShowConfirm] = useState(false);
    const [schedule, setSchedule] = useState(
        Array.from({ length: 6 }, () => Array(4).fill(null))
    );
    const navigate = useNavigate();
    const { userName } = useUserContext();
    useEffect(() => {
        if (userName == "nhansu") {
            setError("Bạn không có quyền truy cập trang này");
            navigate('/');
        }
    }, [userName]);
    const fetchData = async () => {
        try {
            const classes = await axiosClient.get('lop/list/withoutTkb');
            setClasses(classes.data);
            const monHocXH = await axiosClient.get('mh/xh');
            setSubjectXH(monHocXH.data);
            const monHocTN = await axiosClient.get('mh/tn');
            setSubjectTN(monHocTN.data);
            const dates = await axiosClient.get(`tkb/date`);
            setdate(dates.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);
    const fetchTKB = async () => {
        const tkbs = await axiosClient.get(`lop/index/tkb/${nienKhoa.NienKhoa}`);
        // settkb(tkbs.data);
        const newTKB = tkbs.data.map(data => {
            const tkbMatrix = Array(6).fill(null).map(() => Array(8).fill(null));

            data.tkb.forEach(schedule => {
                const dayIndex = schedule.MaNgay - 2;
                const periodIndex = schedule.TietDay - 1;

                tkbMatrix[dayIndex][periodIndex] = {
                    id: schedule.id,
                    MaMH: schedule.MaMH,
                    TenMon: schedule.mon_hoc.TenMH,
                    TenGV: schedule.giao_vien.TenGV
                };
            });
            tkbMatrix[0][0] = {
                id: -1,
                MaMH: '',
                TenMon: 'Chào cờ',
                TenGV: ''
            }
            tkbMatrix[5][3] = {
                id: -2,
                MaMH: '',
                TenMon: 'Sinh hoạt lớp',
                TenGV: ''
            }
            return { ...data, tkbMatrix };
        });
        settkb(newTKB);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        try {
            if (data.MaLop.substring(0, 1) === "A") {
                subjectTN.map(function (mh) {
                    const payload = {
                        MaLop: data.MaLop,
                        MSGV: data[mh.MaMH],
                        MaMH: mh.MaMH
                    }
                    axiosClient.post('tkb/createPC', payload);
                    fetchData();
                })
            }
            if (data.MaLop.substring(0, 1) === "C") {
                subjectXH.map(function (mh) {
                    const payload = {
                        MaLop: data.MaLop,
                        MSGV: data[mh.MaMH],
                        MaMH: mh.MaMH
                    }
                    axiosClient.post('tkb/createPC', payload);
                    fetchData();
                })
            }
            setMessage("Tạo mới thành công");
        }
        catch (error) {
            console.log(error);
            setMessage("Có lỗi trong quá trình cập nhật phân công");
        }
    }
    const createTKB = async () => {
        try {
            await axiosClient.post(`/tkb/create/${nienKhoa.NienKhoa}`);
            fetchData();
            setMessage("Tạo mới thành công");
            fetchData();
        } catch (error) {
            console.log(error);
        }
    }
    const showForm = (id) => {
        if (show == id) {
            setShow('');
        } else {
            setShow(id);
        }
    }
    useEffect(() => {
        setDisable(false);
        classes.map((data) => {
            if (data.phan_cong.length == 0) {
                setDisable(true);
            };
        })
    }, [classes]);
    const _setState = (state) => {
        if (state == 1) {
            fetchTKB();
        }
        setState(state);
    }
    const activeChangeTKB = (id) => {
        if (id) {
            setChangeTKB(id);
        } else {
            setChangeTKB(null);
        }
        setChange1(null);
        setChange2(null);
    }
    const chooseTKB = (data) => {
        if (!data) {
            setChange1(null);
            setChange2(null);
        }
        else if (!change1) {
            setChange1(data);
        } else {
            if (data.id != change1.id) {
                var check = false;
                for (let i = 0; i < tkb.length; i++) {
                    if (tkb[i].MaLop != data.MaLop) {
                        const check1 = tkb[i].tkb.find(item => data.TietDay == item.TietDay && data.MaNgay == item.MaNgay && item.MSGV == change1.MSGV);
                        if (check1) {
                            check = true;
                        }
                        const check2 = tkb[i].tkb.find(item => change1.TietDay == item.TietDay && change1.MaNgay == item.MaNgay && item.MSGV == data.MSGV);
                        if (check2) {
                            check = true;
                        }
                    }
                    if (check) {
                        break;
                    }
                }
                if (check) {
                    setError("Tiết dạy bạn chon bị trùng lặp");
                } else {
                    setChange2(data);
                }
            }
        }
    }
    const saveChange = async () => {
        if (change1 && change2) {
            var payload;
            if(change2.id == "empty"){
                payload = {
                    change1: change1.id,
                    change2: change2.id,
                    MaNgay: change2.MaNgay,
                    TietDay: change2.TietDay
                }
            }else{
                payload = {
                    change1: change1.id,
                    change2: change2.id,
                }
            }
            try {
                const response = await axiosClient.put("/tkb/update", payload);
                setMessage(response.data);
                fetchTKB();
                activeChangeTKB(null);
            } catch (error) {
                console.log(error);
            }
        }
    }
    const onConfirm = () => {
        setShowConfirm(false);
        saveChange();
    }
    const onCancel = () => {
        setShowConfirm(false);
    }
    const chooseEmptyCell = (MaNgay, TietDay) => {
        setChange2({
            id: "empty",
            MaNgay: MaNgay,
            TietDay: TietDay,
        });
    }
    return (
        <div className="main-content">
            <Menu />
            <div className="right-part relative">
                {showConfirm &&
                    <AlterConfirm message={`Bạn có chắc chắn với thao tác này không?`} onCancel={onCancel} onConfirm={onConfirm} />
                }
                <h1 className="page-name">Quản lí thời khóa biểu</h1>
                <div className="flex my-2">
                    <button className="button border-slate-400 hover:border-cyan-500 hover:bg-cyan-200 button-animation" onClick={() => _setState(2)}>Xếp TKB</button>
                    <button className="button border-slate-400 hover:border-cyan-500 hover:bg-cyan-200 button-animation" onClick={() => _setState(1)}>Danh sách TKB</button>
                </div>
                {state === 1 &&
                    <div className="mb-2">
                        {tkb.map((data) => (
                            <div key={data.MaLop} className="mx-auto mb-10" style={{ maxWidth: '95%' }}>
                                <div className="flex justify-between mb-2 items-center" >
                                    <div className="text-2xl font-bold">
                                        Lớp: {data.TenLop} - Niên khóa: {data.nien_khoa.TenNK}
                                    </div>
                                    <div>
                                        {changeTKB == data.MaLop &&
                                            <div className="text-red-400 text-xl font-bold">Click chọn 2 tiết cần đổi</div>
                                        }
                                    </div>
                                    {changeTKB == data.MaLop ?
                                        <div className="space-x-1 flex">
                                            {change2 &&
                                                <button className="border-2 rounded-lg px-2 py-1 text-sm border-green-500 hover:text-green-500 hover:bg-white hover:shadow-m" onClick={() => setShowConfirm(true)}>Lưu</button>
                                            }
                                            {(change1 || change2) &&
                                                <button className="border-2 rounded-lg px-2 py-1 text-sm border-red-500 hover:text-red-500 hover:bg-white hover:shadow-md" onClick={() => chooseTKB(null)}>Chọn lại</button>
                                            }
                                            <button className="border-2 rounded-lg px-2 py-1 text-sm border-red-500 hover:text-red-500 hover:bg-white hover:shadow-md" onClick={() => activeChangeTKB(null)}>Hủy</button>
                                        </div>
                                        :
                                        <button className="border-2 rounded-lg px-2 py-1 text-sm border-blue-500 hover:text-blue-500 hover:bg-white hover:shadow-md" onClick={() => activeChangeTKB(data.MaLop)}>Sửa</button>
                                    }
                                </div>
                                <table className={changeTKB === data.MaLop ? "border-2 border-red-400 border-collapse text-center w-full table-fixed bg-white" : "border-2 border-black border-collapse text-center w-full table-fixed"}>
                                    <thead>
                                        <tr>
                                            <th className="td"></th>
                                            {date.map((date) => (
                                                <th className="td" key={date.MaNgay}>{date.TenNgay}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...Array(4)].map((_, i) => (
                                            <tr key={i + 1}>
                                                <td className="td px-3">{i + 1}</td>
                                                {[...Array(6)].map((_, j) => (
                                                    data.tkbMatrix[j][i] ?
                                                        changeTKB == data.MaLop && data.tkbMatrix[j][i].id != -1 && data.tkbMatrix[j][i].id != -2 && data.tkbMatrix[j][i].MaMH != change1?.MaMH ?
                                                            <td className={change1?.id == data.tkbMatrix[j][i].id || change2?.id == data.tkbMatrix[j][i].id ? "td cursor-pointer text-red-500 hover:bg-slate-300" : "td cursor-pointer hover:bg-slate-300"} onClick={() => chooseTKB(data.tkb.find(item => item.id == data.tkbMatrix[j][i].id))} key={j + 1}>
                                                                {data.tkbMatrix[j][i].TenMon} <br /> {data.tkbMatrix[j][i].TenGV}
                                                            </td>
                                                            :
                                                            <td className={change1?.id == data.tkbMatrix[j][i].id || change2?.id == data.tkbMatrix[j][i].id ? "td text-red-500 " : "td "} key={j + 1}>
                                                                {data.tkbMatrix[j][i].TenMon} <br /> {data.tkbMatrix[j][i].TenGV}
                                                            </td>
                                                        :
                                                        <td
                                                            className={`td ${(change1 && changeTKB == data.MaLop) && !(change2?.MaNgay == j + 2 && change2?.TietDay == i + 1) ? "cursor-pointer hover:bg-slate-300" : ""} `}
                                                            key={j + 1}
                                                            onClick={() => chooseEmptyCell(j + 2, i + 1)}
                                                        >
                                                            {(change2?.MaNgay == j + 2 && change2?.TietDay == i + 1) && <p className="font-bold text-red-400">Đã chọn</p>}
                                                        </td>
                                                ))}
                                            </tr>
                                        ))}
                                        <tr className="">
                                            <td colSpan="6" className="h-10"></td>
                                        </tr>
                                        {[...Array(4)].map((_, i) => {
                                            const currentIndex = i + 4;

                                            return (
                                                <tr key={currentIndex}>
                                                    <td className="td">{currentIndex + 1}</td>
                                                    {[...Array(6)].map((_, j) => (
                                                        data.tkbMatrix[j][currentIndex] ?
                                                            changeTKB == data.MaLop ?
                                                                <td className={change1?.id == data.tkbMatrix[j][currentIndex].id || change2?.id == data.tkbMatrix[j][currentIndex].id ? "td cursor-pointer text-red-500" : "td cursor-pointer"} onClick={() => chooseTKB(data.tkb.find(item => item.id == data.tkbMatrix[j][i].id))} key={j + 1}>
                                                                    {data.tkbMatrix[j][currentIndex].TenMon} <br /> {data.tkbMatrix[j][currentIndex].TenGV}
                                                                </td>
                                                                :
                                                                <td className="td" key={j + 1}>
                                                                    {data.tkbMatrix[j][currentIndex].TenMon} <br /> {data.tkbMatrix[j][currentIndex].TenGV}
                                                                </td>
                                                            :
                                                            <td
                                                                className={`td ${(change1 && changeTKB == data.MaLop) && !(change2?.MaNgay == j + 2 && change2?.TietDay == currentIndex + 1) ? "cursor-pointer hover:bg-slate-300" : ""} `}
                                                                key={j + 1}
                                                                onClick={() => chooseEmptyCell(j + 2, currentIndex + 1)}
                                                            >
                                                                {(change2?.MaNgay == j + 2 && change2?.TietDay == currentIndex + 1) && <p className="font-bold text-red-400">Đã chọn</p>}
                                                            </td>
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                }
                {state == 2 &&
                    <div>
                        {classes.length > 0 ?
                            <div>
                                <h1 className="text-2xl my-2 font-semibold text-center">Lớp chưa xếp Thời khóa biểu</h1>
                                {classes.map((data, index) => (
                                    <div key={index} className="border-2 p-3 mb-1">
                                        <div className="text-xl mb-2">Tên lớp: {data.TenLop} - Niên khóa: {data.nien_khoa.TenNK}</div>
                                        {data.phan_cong.length > 0 ?
                                            <div className="columns-2 w-[70%]">
                                                {data.phan_cong.map((pc) => (
                                                    <div className="text-lg" key={pc.MaMH}>{pc.mon_hoc.TenMH}: {pc.giao_vien.TenGV}</div>
                                                ))}
                                            </div>
                                            :
                                            <div>
                                                <button className="text-red-500 border-2 border-slate-500 px-2 py-1 my-1 rounded" onClick={() => showForm(data.MaLop)}>Phân công dạy học</button>
                                                {show === data.MaLop &&
                                                    <form onSubmit={handleSubmit} className="">
                                                        <div className="columns-5 ">
                                                            <input type="hidden" name="MaLop" value={data.MaLop} />
                                                            {data.MaLop.substring(0, 1) == "A" ?
                                                                <div>
                                                                    {subjectTN.map((tn) => (
                                                                        <div key={tn.MaMH} className="mb-1 ms-1">
                                                                            <select name={tn.MaMH} required className="w-36 p-2 border-2 border-gray-300 rounded-md">
                                                                                <option value="" defaultChecked>{tn.TenMH}</option>
                                                                                {tn.giao_vien.map((gvtn) => (
                                                                                    <option key={gvtn.MSGV} value={gvtn.MSGV}>{gvtn.TenGV}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                :
                                                                <div>
                                                                    {subjectXH.map((xh) => (
                                                                        <div key={xh.MaMH} className="mb-1 ms-1">
                                                                            <select name={xh.MaMH} required className="w-36 p-2 border-2 border-gray-300 rounded-md">
                                                                                <option value="" defaultValue={xh.TenMH} >{xh.TenMH}</option>
                                                                                {xh.giao_vien.map((gvxh) => (
                                                                                    <option key={gvxh.MSGV} value={gvxh.MSGV}>{gvxh.TenGV}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            }
                                                        </div>
                                                        <button className="px-2 py-1 border-2 rounded border-blue-500 ms-1 mt-1 hover:bg-blue-300" type="submit">Xác nhận</button>
                                                    </form>}
                                            </div>
                                        }
                                    </div>
                                ))}
                                <div>
                                    <button
                                        className="text-red-500 border-2 border-slate-500 px-2 py-1 rounded my-2 hover:bg-slate-300"
                                        onClick={createTKB}
                                        disabled={disable}
                                    >
                                        Xếp TKB
                                    </button>
                                </div>

                            </div>
                            :
                            <div className="mt-20 text-center  text-green-500 text-5xl">
                                Không có lớp cần xếp TKB
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    )
}