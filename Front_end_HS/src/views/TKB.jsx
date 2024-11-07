import { useEffect, useState } from "react";
import Menu from "../components/Menu";
import { useStateContext } from "../context/Context";
import { useUserContext } from "../context/userContext";
import axiosClient from "../axios-client";
import moment from 'moment';
import Header from "../components/Header";
export default function TKB() {
    const { nienKhoa } = useStateContext();
    const { userName } = useUserContext();
    const [tkb, setTkb] = useState([]);
    const [matrix, setMatrix] = useState();
    const [date, setDate] = useState([]);
    const [info, setInfo] = useState([]);
    const [week, setWeek] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [onMd, setOnMd] = useState(false);
    const fetchData = async () => {
        const _info = await axiosClient.get(`/hs/show/${userName}`);
        setInfo(_info.data);
        const payload = {
            MaNK: nienKhoa.NienKhoa,
            MaLop: _info.data.lop[0].MaLop,
        };
        try {
            const response = await axiosClient.post('/hs/tkb', payload);
            setTkb(response.data);
            const dates = await axiosClient.get(`tkb/date`);
            setDate(dates.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchData();
        setWeek(thisWeek())
    }, [nienKhoa, userName])
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setOnMd(true);
            } else {
                setOnMd(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    useEffect(() => {
        const dayBu = async () => {
            const payload = {
                MaLop: info.lop[0].MaLop,
                start: formatDate(dayOfWeek(week || thisWeek()).start),
                end: formatDate(dayOfWeek(week || thisWeek()).end)
            };
            console.log(payload);
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

                tkb.forEach(schedule => {
                    const dayIndex = schedule.MaNgay - 2;
                    const periodIndex = schedule.TietDay - 1;

                    tkbMatrix[dayIndex][periodIndex] = {
                        TenMon: schedule.mon_hoc.TenMH,
                        TenGV: schedule.giao_vien.TenGV
                    };
                });

                const dayBuData = await dayBu();
                dayBuData.forEach(item => {
                    const dayIndex = item.MaNgay - 2;
                    const periodIndex = item.TietDay - 1

                    tkbMatrix[dayIndex][periodIndex] = {
                        TenMon: item.mon_hoc.TenMH + " (Dạy bù)",
                        TenGV: item.giao_vien.TenGV
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
    };
    console.log()
    return (
        <div>
            <Header />
            <div className="main-content">
                <Menu />
                <div className="right-part">
                    <h1 className="page-name">Thời khóa biểu</h1>
                    <div className="md:w-[80%] mt-3 mx-auto">
                        <div className="flex justify-center items-center space-x-2 mb-1">
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
                        {onMd ?
                            <div className="space-y-2">
                                {[...Array(6)].map((_, i) => (
                                    matrix &&
                                    <table key={i} className="border-2 border-collapse border-black w-full table-auto">
                                        <thead>
                                            <tr>
                                                <th className="border-2 border-black p-2" colSpan={2}>Thứ {i + 2}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[...Array(8)].map((_, j) => (
                                                <tr key={j}>
                                                    <td className="border-2 border-black p-2">Tiết: {j + 1}</td>
                                                    {matrix && matrix[i][j] ?
                                                        <td className="border-2 border-black p-2" key={j + 1}>
                                                            {matrix[i][j].TenMon} <br /> {matrix[i][j].TenGV}
                                                        </td>
                                                        :
                                                        <td className="border-2 border-black p-2 invisible" key={j + 1}>
                                                            N/A <br /> N/A
                                                        </td>}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ))}
                            </div>
                            :
                            <table className="border-2 table-auto border-black border-collapse text-center w-full ">
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
                                                        {matrix[j][i].TenMon} <br /> {matrix[j][i].TenGV}
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
                                        const startIndex = 4; // Start value for i
                                        const currentIndex = i + startIndex;

                                        return (
                                            <tr key={currentIndex}>
                                                <td className="td">{currentIndex + 1}</td>
                                                {[...Array(6)].map((_, j) => (
                                                    matrix && matrix[j][currentIndex] ?
                                                        <td className="td" key={j + 1}>
                                                            {matrix[j][currentIndex].TenMon} <br /> {matrix[j][currentIndex].TenGV}
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
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}