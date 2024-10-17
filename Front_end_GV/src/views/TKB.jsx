import { useEffect, useState } from "react";
import Menu from "../components/Menu";
import { useStateContext } from "../context/Context";
import { useUserContext } from "../context/userContext";
import axiosClient from "../axios-client";
import moment from 'moment';
import AlterConfirm from "../components/Confirm";
export default function TKB() {
    const { nienKhoa, setMessage, setError } = useStateContext();
    const { userName } = useUserContext();
    const [tkb, setTkb] = useState([]);
    const [tkbClass, setTkbClass] = useState();
    const [matrix, setMatrix] = useState();
    const [matrixClass, setMatrixClass] = useState();
    const [date, setDate] = useState([]);
    const [view, setView] = useState(0);
    const [classes, setClass] = useState();
    const [week, setWeek] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState();
    const [selectedClass, setSelectedClass] = useState();
    const [showConfirm, setShowConfirm] = useState(0);
    const [chooseDelete, setChooseDelete] = useState();
    const fetchData = async () => {
        const payload = {
            MaNK: nienKhoa.NienKhoa,
            MSGV: userName,
        };
        try {
            const response = await axiosClient.post('/gv/tkb', payload);
            setTkb(response.data);
            const dates = await axiosClient.get(`tkb/date`);
            setDate(dates.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
        setWeek(thisWeek());
    }, [nienKhoa, userName])
    useEffect(() => {
        const dayBu = async () => {
            const payload = {
                MSGV: userName,
                start: formatDate(dayOfWeek(week || thisWeek()).start),
                end: formatDate(dayOfWeek(week || thisWeek()).end)
            };

            try {
                const response = await axiosClient.post('/gv/daybu', payload);
                return response.data;
            } catch (error) {
                console.error("Error fetching dayBu data:", error);
                return [];
            }
        };

        const fetchDayBuAndSetMatrix = async () => {
            if (tkb.length > 0) {
                const tkbMatrix = Array.from({ length: 6 }, () => Array(8).fill(null));

                tkb.forEach(schedule => {
                    const dayIndex = schedule.MaNgay - 2;
                    const periodIndex = schedule.TietDay - 1;

                    tkbMatrix[dayIndex][periodIndex] = {
                        TenMon: schedule.mon_hoc.TenMH,
                        TenLop: schedule.lop.TenLop
                    };
                });

                const dayBuData = await dayBu();
                dayBuData.forEach(item => {
                    const dayIndex = item.MaNgay - 2;
                    const periodIndex = item.TietDay - 1

                    tkbMatrix[dayIndex][periodIndex] = {
                        TenMon: item.mon_hoc.TenMH + " (Dạy bù)",
                        TenLop: item.lop.TenLop
                    };
                });

                tkbMatrix[0][0] = {
                    TenMon: 'Chào cờ',
                    TenGV: ''
                };
                tkbMatrix[5][3] = {
                    TenMon: 'Sinh hoạt lớp',
                    TenGV: ''
                };

                setMatrix(tkbMatrix);
            }
        };

        fetchDayBuAndSetMatrix();
    }, [week, tkb]);
    const changeView = async () => {
        if (view == 0) {
            setWeek(thisWeek());
            setView(1);
            const payload = {
                MaNK: nienKhoa.NienKhoa,
                MSGV: userName,
            }
            const res = await axiosClient.post("/gv/class", payload);
            setClass(res.data);
        } else {
            setTkbClass(null);
            setMatrixClass(null);
            setSelected(null);
            setIsOpen(false);
            setWeek(thisWeek());
            setView(0);
        }
    }
    const changeClass = (e) => {
        const MaLop = e.target.value;
        setSelectedClass(MaLop);
        chooseClass(MaLop, thisWeek());
    }
    const chooseClass = async (MaLop, week) => {
        const res = await axiosClient.get(`/tkb/index/class/${MaLop}`);
        setTkbClass(res.data);
        if (res.data) {
            const dayBu = async () => {
                const payload = {
                    MaLop: MaLop,
                    start: formatDate(dayOfWeek(week).start),
                    end: formatDate(dayOfWeek(week).end)
                };

                try {
                    const response = await axiosClient.post('/lop/daybu', payload);
                    return response.data;
                } catch (error) {
                    console.error("Error fetching dayBu data:", error);
                    return [];
                }
            };

            const fetchDayBuAndSetMatrix = async () => {
                if (tkb.length > 0) {
                    const tkbMatrix = Array.from({ length: 6 }, () => Array(8).fill(null));

                    res.data.forEach(schedule => {
                        const dayIndex = schedule.MaNgay - 2;
                        const periodIndex = schedule.TietDay - 1;

                        tkbMatrix[dayIndex][periodIndex] = {
                            TenMon: schedule.mon_hoc.TenMH,
                            TenLop: schedule.giao_vien.TenGV
                        };
                    });

                    const dayBuData = await dayBu();
                    dayBuData.forEach(item => {
                        const dayIndex = item.MaNgay - 2;
                        const periodIndex = item.TietDay - 1

                        tkbMatrix[dayIndex][periodIndex] = {
                            id: item.id,
                            MSGV: item.MSGV,
                            TenMon: item.mon_hoc.TenMH + " (Dạy bù)",
                            TenLop: item.giao_vien.TenGV
                        };
                    });

                    tkbMatrix[0][0] = {
                        TenMon: 'Chào cờ',
                        TenGV: ''
                    };
                    tkbMatrix[5][3] = {
                        TenMon: 'Sinh hoạt lớp',
                        TenGV: ''
                    };

                    setMatrixClass(tkbMatrix);
                }
            };

            fetchDayBuAndSetMatrix();
        }
    }
    const formatDate = (date) => {
        const d = moment(date).format("YYYY-MM-DD");
        return d;
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
    const getDay = (weekNumber, dayOfWeek) => {
        const startOfWeek = new Date(nienKhoa.NgayBD);
        startOfWeek.setDate(startOfWeek.getDate() + (weekNumber - 1) * 7);

        const dayOfWeekOffset = dayOfWeek - startOfWeek.getDay();
        const desiredDate = new Date(startOfWeek);
        desiredDate.setDate(startOfWeek.getDate() + dayOfWeekOffset);

        return desiredDate;
    };
    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    };
    useEffect(() => {
        if (isOpen) {
            document.getElementById(week).scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [isOpen])
    const handleOptionClick = (key, option) => {
        setIsOpen(false);
        setWeek(option);
        if (option < thisWeek()) {
            setSelected(null);
        }
        if (key == 1 && selectedClass) {
            chooseClass(selectedClass, option);
        }
    };
    const selects = (MaNgay, TietDay) => {
        if (selected && MaNgay == selected.MaNgay && TietDay == selected.TietDay) {
            setSelected(null);
        }
        else {
            setSelected({
                MaNgay: MaNgay,
                TietDay: TietDay,
                MSGV: userName,
                MaMH: classes[0].MaMH,
                Ngay: formatDate(getDay(week, MaNgay - 1)),
                MaLop: selectedClass,
                Loai: 1
            });
        }
    }
    const triggerConfirm = (id, data) => {
        setShowConfirm(id);
        if (data) {
            setChooseDelete(data);
        }
    }
    const onConfirm = () => {
        saveChange();
        setShowConfirm(0);
    }
    const onCancel = () => {
        setShowConfirm(0);
        setChooseDelete(null);
    }
    const saveChange = async () => {
        try {
            const res = await axiosClient.post('/tkb/createTH', selected);
            console.log(res.data);
            setMessage("Đã cập nhật thành công!");
            changeView();
            fetchData();
        } catch (error) {
            console.log(error);
        }
    }
    const deleteDB = async () => {
        try {
            const res = await axiosClient.delete(`/tkb/deleteTH/${chooseDelete}`);
            setMessage(res.data);
            changeView();
            fetchData();
        } catch (error) {
            setError(typeof error.response.data == 'string' ? error.response.data : 'Lỗi không xác định');
        }
        setShowConfirm(0);
    }
    console.log();
    return (
        <div className="main-content">
            <Menu />
            <div className="right-part relative">
                {showConfirm == 1 &&
                    <AlterConfirm message={"Bạn có chắc với hành động này không"} onCancel={onCancel} onConfirm={onConfirm} />
                }
                {showConfirm == 2 &&
                    <AlterConfirm message={"Bạn có chắc muốn xóa tiết học dạy bù này không?"} onCancel={onCancel} onConfirm={deleteDB} />
                }
                <div className="w-[80%] mx-auto mt-5">
                    {view === 1 ?
                        <div className="relative bg-white p-2 border-2 border-black rounded-md shadow-md">
                            <button className="absolute right-1 top-1 font-bold text-red-700" onClick={changeView}>X</button>
                            <div className="flex space-x-3 items-center justify-between mx-3">
                                <div className="flex items-center space-x-2 my-3 ms-2">
                                    <div className="text-lg">Lớp:</div>
                                    <select onChange={changeClass} className="px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none">
                                        <option value="">Chọn lớp</option>
                                        {classes?.map((item) => (
                                            <option key={item.MaLop} value={item.MaLop}>{item.lop.TenLop}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="text-lg">Tuần: </div>
                                    <div className="relative">
                                        <button
                                            onClick={toggleDropdown}
                                            className="block w-full px-5 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
                                        >
                                            {week}
                                        </button>
                                        {isOpen && (
                                            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                {[...Array(thisWeek() + 1)].map((_, i) => (
                                                    <li
                                                        key={i} id={i + 1}
                                                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${week == i + 1 && "bg-slate-300"}`}
                                                        onClick={() => handleOptionClick(1, i + 1)}
                                                    >
                                                        {i + 1}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    Từ: {getDate(dayOfWeek(week).start)} đến: {getDate(dayOfWeek(week).end)}
                                </div>
                                <div>
                                    {selected &&
                                        <button onClick={() => triggerConfirm(1)} className="button border-green-500 hover:bg-green-500 hover:text-white">Xác nhận</button>
                                    }
                                </div>
                            </div>
                            {tkbClass &&
                                <table className="w-full border-2 table-auto border-black border-collapse text-center text-sm">
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
                                                    matrixClass && matrixClass[j][i] ?
                                                        <td
                                                            className={`td ${(matrixClass[j][i].TenMon?.includes("(Dạy bù)")
                                                                && matrixClass[j][i].MSGV === userName) && "cursor-pointer hover:bg-slate-300"}`}
                                                            key={j + 1}
                                                            onClick={(matrixClass[j][i].TenMon?.includes("(Dạy bù)") && matrixClass[j][i].MSGV === userName) ? () => triggerConfirm(2, matrixClass[j][i].id) : undefined}
                                                        >
                                                            {matrixClass[j][i].TenMon} <br /> {matrixClass[j][i].TenLop}
                                                        </td>
                                                        :
                                                        <td
                                                            className={`td ${week >= thisWeek() && "hover:bg-slate-300 cursor-pointer"}`}
                                                            onClick={week >= thisWeek() ? () => selects(j + 2, i + 1) : undefined}
                                                            key={j + 1}
                                                        >
                                                            {(selected?.MaNgay == j + 2 && selected?.TietDay == i + 1) && <p className="text-red-500 font-bold">Đã chọn</p>}
                                                        </td>
                                                ))}
                                            </tr>
                                        ))}
                                        <tr className="">
                                            <td colSpan="6" className="h-10"></td>
                                        </tr>
                                        {[...Array(4)].map((_, i) => {
                                            const startIndex = 4;
                                            const currentIndex = i + startIndex;

                                            return (
                                                <tr key={currentIndex}>
                                                    <td className="td">{currentIndex + 1}</td>
                                                    {[...Array(6)].map((_, j) => (
                                                        matrixClass && matrixClass[j][currentIndex] ?
                                                            <td
                                                                className={`td ${(matrixClass[j][currentIndex].TenMon?.includes("(Dạy bù)")
                                                                    && matrixClass[j][currentIndex].MSGV === userName) && "cursor-pointer hover:bg-slate-300"}`}
                                                                key={j + 1}
                                                                onClick={(matrixClass[j][currentIndex].TenMon?.includes("(Dạy bù)") && matrixClass[j][currentIndex].MSGV === userName) ? () => triggerConfirm(2, matrixClass[j][currentIndex].id) : undefined}
                                                            >
                                                                {matrixClass[j][currentIndex].TenMon} <br /> {matrixClass[j][currentIndex].TenLop}
                                                            </td>
                                                            :
                                                            <td
                                                                className={`td ${week >= thisWeek() && "hover:bg-slate-300 cursor-pointer"}`}
                                                                onClick={week >= thisWeek() ? () => selects(j + 2, currentIndex + 1) : undefined}
                                                                key={j + 1}
                                                            >
                                                                {(selected?.MaNgay == j + 2 && selected?.TietDay == currentIndex + 1) && <p className="text-red-500 font-bold">Đã chọn</p>}
                                                            </td>
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            }
                        </div>
                        :
                        <div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="text-lg">Tuần: </div>
                                    <div className="relative">
                                        <button
                                            onClick={toggleDropdown}
                                            className="block w-full px-5 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
                                        >
                                            {week}
                                        </button>
                                        {isOpen && (
                                            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                {[...Array(thisWeek() + 1)].map((_, i) => (
                                                    <li
                                                        key={i} id={i + 1}
                                                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${week == i + 1 && "bg-slate-300"}`}
                                                        onClick={() => handleOptionClick(2, i + 1)}
                                                    >
                                                        {i + 1}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    Từ: {getDate(dayOfWeek(week).start)} đến: {getDate(dayOfWeek(week).end)}
                                </div>
                                <div className="flex justify-end">
                                    <button className="button border-blue-500 text-blue-700 hover:bg-blue-500 hover:text-white mb-1" onClick={changeView}>Đăng kí dạy bù</button>
                                </div>
                            </div>
                            <table className="w-full border-2 table-auto border-black border-collapse text-center">
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
                                                matrix && matrix[j][i] ?
                                                    <td className="td" key={j + 1}>
                                                        {matrix[j][i].TenMon} <br /> {matrix[j][i].TenLop}
                                                    </td>
                                                    :
                                                    <td className="td invisible" key={j + 1}>
                                                        N/A <br /> N/A
                                                    </td>
                                            ))}
                                        </tr>
                                    ))}
                                    <tr className="">
                                        <td colSpan="6" className="h-10"></td>
                                    </tr>
                                    {[...Array(4)].map((_, i) => {
                                        const startIndex = 4;
                                        const currentIndex = i + startIndex;

                                        return (
                                            <tr key={currentIndex}>
                                                <td className="td">{currentIndex + 1}</td>
                                                {[...Array(6)].map((_, j) => (
                                                    matrix && matrix[j][currentIndex] ?
                                                        <td className="td" key={j + 1}>
                                                            {matrix[j][currentIndex].TenMon} <br /> {matrix[j][currentIndex].TenLop}
                                                        </td>
                                                        :
                                                        <td className="td invisible" key={j + 1}>
                                                            N/A <br /> N/A
                                                        </td>
                                                ))}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}