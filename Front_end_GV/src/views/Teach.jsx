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
    const [onView, setOnView] = useState("");
    const [page, setPage] = useState(1);
    const [state, setState] = useState();
    const [showConfirm, setShowConfirm] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [week, setWeek] = useState(0);
    const [weeks, setWeeks] = useState([]);

    const fetchData = async () => {
        const d = new Date();
        const payload = {
            MaNK: nienKhoa.NienKhoa,
            MaNgay: d.getDay() + 1,
            MSGV: userName,
        };
        try {
            const res = await axiosClient.post("tkb/date", payload);
            setData(res.data);
        } catch (error) {
            console.log(error);
        }
    }
    const fetchDataWeek = async () => {
        const d = new Date();
        const payload = {
            MaNK: nienKhoa.NienKhoa,
            MSGV: userName,
        };
        try {
            const res = await axiosClient.post("tkb/gv/week", payload);
            setData(res.data);
        } catch (error) {
            console.log(error);
        }
    }
    const getToDay = () => {
        const d = new Date();
        const toDay = `Thứ: ${d.getDay() + 1}, Ngày: ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        return toDay;
    }
    const getThisWeek = () => {
        return dayOfWeek(thisWeek());
    }
    useEffect(() => {
        if (userName && nienKhoa?.NienKhoa) {
            fetchData();
        }
    }, [userName, nienKhoa]);
    const changeView = async (view, data) => {
        if (view == 2 && data) {
            const d = new Date();
            const payload = {
                MaLop: data.MaLop,
                MaNgay: data.MaNgay,
                TietDay: data.TietDay,
                MSGV: userName,
                Ngay: formatDate(d),
            };
            setOnView(data.id);
            try {
                const res = await axiosClient.post("tkb/get", payload);
                setState(res.data);
            } catch (error) {
                console.log(error);
            }
        } else {
            setState(null);
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
    const formatDate = (date) => {
        const d = moment(date).format("YYYY-MM-DD");
        return d;
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
    const thisWeek = () => {
        if (nienKhoa?.NienKhoa) {
            let day = new Date();
            const firstDay = new Date(nienKhoa.NgayBD);
            let week = Math.ceil((day - firstDay) / (1000 * 60 * 60 * 24 * 7));
            day.getDay() == 1 && (week = week + 1);
            return week;
        }
    }
    const dayOfWeek = (weekNumber) => {
        const startOfWeek = new Date(nienKhoa.NgayBD);
        startOfWeek.setDate(startOfWeek.getDate() + (weekNumber - 1) * 7);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        const week = {
            start: startOfWeek,
            end: endOfWeek
        }
        return week;
    }
    const changePage = (page) => {
        if (page == 1) {
            fetchData();
        } else {
            fetchDataWeek();
        }
        setOnView("");
        setView(1);
        setPage(page);
    }
    const selectWeek = (e) => {
        setWeek(e.target.value);
    }
    const toggleDropdown = () => setIsOpen(!isOpen);
    const handleOptionClick = (option) => {
        setIsOpen(false);
        setWeek(option);
    };
    console.log();
    return (
        <div className="main-content">
            <Menu />
            <div className="right-part relative">
                {showConfirm == 1 &&
                    <AlterConfirm message={"Bạn có chắc với hành động này không"} onCancel={onCancel} onConfirm={onConfirm} />
                }
                <div className="page-name">Quản lí dạy học</div>
                <div className="flex w-full">
                    <button
                        className={`w-1/2 text-xl border-y-2 border-s-2 mt-1 border-cyan-500 py-2 hover:bg-slate-200 ${page == 1 ? 'bg-slate-200' : 'bg-slate-300'}`}
                        onClick={() => changePage(1)}
                    >
                        Hôm nay
                    </button>
                    <button
                        className={`w-1/2 text-xl border-2 mt-1 border-cyan-500 py-2 hover:bg-slate-200 ${page == 2 ? 'bg-slate-200' : 'bg-slate-300'}`}
                        onClick={() => changePage(2)}
                    >
                        Theo Tuần
                    </button>
                </div>
                {data.length == 0 ?
                    <div className="mt-10 text-center text-2xl text-green-500">Bạn không có tiết dạy nào hôm nay</div>
                    :
                    <div>
                        <div className="text-2xl text-center text-blue-400 font-bold mt-5">Danh sách các tiết dạy {page == 1 ? "hôm nay" : "Trong tuần"}</div>
                        <div className="text-center text-green-400 font-bold mb-5">
                            {page == 1 ? getToDay() : `Từ: ${getDate(getThisWeek().start)} Đến: ${getDate(getThisWeek().end)}`}
                        </div>
                        {page == 2 &&
                            <div className="flex items-center space-x-2 text-lg w-[80%] mx-auto mb-1">
                                <div className="flex items-center space-x-2">
                                    <div>Tuần: </div>
                                    <div className="relative">
                                        <button
                                            onClick={toggleDropdown}
                                            className="block w-full px-10 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
                                        >
                                            {week || thisWeek()}
                                        </button>
                                        {isOpen && (
                                            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                {[...Array(thisWeek())].map((_, i) => (
                                                    <li
                                                        key={i}
                                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                        onClick={() => handleOptionClick(i + 1)}
                                                    >
                                                        {i + 1}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        }
                        <table className="table-fixed w-[80%] mx-auto border-2 border-blue-400 bg-white border-collapse shadow-lg">
                            <thead>
                                <tr>
                                    {page == 2 && <th className="border border-gray-400 p-2">Thứ</th>}
                                    <th className="border border-gray-400 p-2">Tiết</th>
                                    <th className="border border-gray-400 p-2">Môn học</th>
                                    <th className="border border-gray-400 p-2">Lớp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((d) => (
                                    <tr key={d.id} className={`cursor-pointer hover:bg-gray-200 ${onView == d.id && "bg-gray-200"}`} onClick={() => changeView(2, d)}>
                                        {page == 2 && <td className="border border-gray-400 p-2">{d.MaNgay}</td>}
                                        <td className="border border-gray-400 p-2">{d.TietDay}</td>
                                        <td className="border border-gray-400 p-2">{d.mon_hoc.TenMH}</td>
                                        <td className="border border-gray-400 p-2">{d.lop.TenLop}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>}
                {view === 2 &&
                    (Object.keys(state).length > 0 ?
                        <div className="bg-white border-2 border-blue-500 mt-5 w-full relative">
                            <button className="absolute right-1 top-0 hover:text-red-400" onClick={() => setView(1)}><FontAwesomeIcon icon={faMinus} /> </button>
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
                        :
                        <div className="text-center text-2xl mt-20 text-red-500 ">Không có dữ liệu</div>)
                }
            </div>
        </div>
    )
}