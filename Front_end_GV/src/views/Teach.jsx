import { useEffect, useState, useRef } from "react";
import Menu from "../components/Menu";
import { useUserContext } from "../context/userContext";
import axiosClient from "../axios-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { useStateContext } from "../context/Context";
import pusher from "../pusher";
import moment from 'moment';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AlterConfirm from "../components/Confirm";
export default function Teaching() {
    const { userName } = useUserContext();
    const { nienKhoa, setMessage } = useStateContext();
    const [data, setData] = useState([]);
    const [view, setView] = useState(1);
    const [state, setState] = useState();
    const [showConfirm, setShowConfirm] = useState(0);

    const fetchData = async () => {
        const d = new Date();
        const payload = {
            MaNK: nienKhoa.NienKhoa,
            MaNgay: d.getDay() + 1,
            MSGV: userName
        };
        try {
            const res = await axiosClient.post("tkb/date", payload);
            setData(res.data);
        } catch (error) {
            console.log(error);
        }
    }
    const getToDay = () => {
        const d = new Date();
        const toDay = `Thứ: ${d.getDay() + 1}, Ngày: ${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
        return toDay;
    }
    useEffect(() => {
        if (userName && nienKhoa?.NienKhoa) {
            fetchData();
        }
    }, [userName, nienKhoa]);
    const changeView = async (view, data) => {
        if (view == 2 && data) {
            const payload = {
                MaLop: data.MaLop,
                MaNgay: data.MaNgay,
                TietDay: data.TietDay,
                MSGV: userName
            };
            try {
                const res = await axiosClient.post("tkb/get", payload);
                setState(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        setView(view);
    }
    const saveChange = async () => {
        const formData = new FormData(document.querySelector("form"));
        const arr = { ...state };
        arr.NoiDung = formData.get('NoiDung');
        arr.DanhGia = formData.get('DanhGia');

        const diemDanh = {};

        arr.diem_danh.forEach((hs) => {
            hs.TrangThai = formData.get(hs.MSHS);
        });
        setState(arr);
        try {
            const res = await axiosClient.put("/tkb/updateTH", arr);
            setMessage(res.data);
        } catch (error) {
            console.log(error);
        }
        // console.log(arr);
    }
    const triggerConfirm = () => {
        setShowConfirm(1)
    }
    const onConfirm = () => {
        saveChange();
        setShowConfirm(0);
    }
    const onCancel = () => {
        setShowConfirm(0);
    }
    const getDate = (date) => {
        const d = moment(date).format("DD/MM/YYYY");
        return d;
    }
    // console.log(state);
    return (
        <div className="main-content">
            <Menu />
            <div className="right-part relative">
                {showConfirm == 1 &&
                    <AlterConfirm message={"Bạn có chắc với hành động này không"} onCancel={onCancel} onConfirm={onConfirm} />
                }
                <div className="page-name">Quản lí dạy học</div>
                {data.length == 0 ?
                    <div className="mt-10 text-center text-2xl text-green-500">Bạn không có tiết dạy nào hôm nay</div>
                    :
                    <div>
                        <div className="text-2xl text-center text-blue-400 font-bold mt-5">Danh sách các tiết dạy hôm nay</div>
                        <div className="text-center text-green-400 font-bold mb-5">{getToDay()}</div>
                        <table className="table-fixed w-[80%] mx-auto border-2 border-blue-400 bg-white border-collapse shadow-lg">
                            <thead>
                                <tr>
                                    <th className="border border-gray-400 p-2">Tiết</th>
                                    <th className="border border-gray-400 p-2">Môn học</th>
                                    <th className="border border-gray-400 p-2">Lớp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((d) => (
                                    <tr key={d.id} className="cursor-pointer hover:bg-gray-200" onClick={() => changeView(2, d)}>
                                        <td className="border border-gray-400 p-2">{d.TietDay}</td>
                                        <td className="border border-gray-400 p-2">{d.mon_hoc.TenMH}</td>
                                        <td className="border border-gray-400 p-2">{d.lop.TenLop}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>}
                {view === 2 &&
                    <div className="bg-white border-2 border-blue-500 mt-5 w-full relative">
                        <button className="absolute right-1 top-0 hover:text-red-400" onClick={()=>setView(1)}><FontAwesomeIcon icon={faMinus} /> </button>
                        <div className="my-2 text-center text-xl text-blue-400 font-bold">
                            Chi tiết Tiết dạy
                        </div>
                        <form className="w-full p-3" onSubmit={saveChange}>
                            <div className="my-3 text-lg flex justify-between border-b-2 pb-3 items-center border-cyan-500">
                                <div>
                                    Tiết: {state.TietDay} Thứ: {state.MaNgay}, Ngày: {getDate(state.Ngay)}
                                </div>
                                <button type="button" onClick={triggerConfirm} className="button border-cyan-400 hover:text-white hover:bg-cyan-300">Lưu</button>
                            </div>
                            <div className="w-full columns-2">
                                <div>
                                    <label className="block">Nội dung dạy:</label>
                                    <textarea name="NoiDung" defaultValue={state.NoiDung || ""} className="resize-none outline-none border-2 rounded-md border-gray-400 p-2 h-28 w-full focus:border-cyan-300" placeholder="Nội dung tiết học" />
                                </div>
                                <div>
                                    <label className="block">Đánh giá lớp học:</label>
                                    <textarea name="DanhGia" defaultValue={state.DanhGia || ""} className="resize-none outline-none border-2 rounded-md border-gray-400 p-2 h-28 w-full focus:border-cyan-300" placeholder="Nội dung đánh giá cho lớp học" />
                                </div>
                            </div>
                            <div>
                                <div className="text-lg font-bold text-center my-2">Điểm danh</div>
                                <table className="border-2 border-cyan-300 border-collapse w-full shadow-lg shadow-cyan-200">
                                    <thead>
                                        <tr>
                                            <th rowSpan={2} className="border border-slate-400 p-2">STT</th>
                                            <th rowSpan={2} className="border border-slate-400 p-2">Họ tên học sinh</th>
                                            <th colSpan={3} className="border border-slate-400 p-2">Trạng thái</th>
                                        </tr>
                                        <tr>
                                            <th className="border border-slate-400 p-2">Có mặt</th>
                                            <th className="border border-slate-400 p-2">Vắng CP</th>
                                            <th className="border border-slate-400 p-2">Vắng KP</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {state.diem_danh.map((hs, index) => (
                                            <tr key={hs.id} className="border border-slate-400 p-2">
                                                <td className="border border-slate-400 p-2">{index + 1}</td>
                                                <td className="border border-slate-400 p-2">{hs.hoc_sinh.HoTen}</td>
                                                <td className="border border-slate-400 p-2">
                                                    <input type="radio" name={hs.MSHS} id="" value={1} defaultChecked={hs.TrangThai === 1} />
                                                </td>
                                                <td className="border border-slate-400 p-2">
                                                    <input type="radio" name={hs.MSHS} id="" value={2} defaultChecked={hs.TrangThai === 2} />
                                                </td>
                                                <td className="border border-slate-400 p-2">
                                                    <input type="radio" name={hs.MSHS} id="" value={3} defaultChecked={hs.TrangThai === 3} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </form>
                    </div>
                }
            </div>
        </div>
    )
}