import { useEffect, useState } from "react";
import Menu from "../components/Menu";
import { useStateContext } from "../context/Context";
import { useUserContext } from "../context/userContext";
import axiosClient from "../axios-client";

export default function TKB() {
    const { nienKhoa } = useStateContext();
    const { userName } = useUserContext();
    const [tkb, setTkb] = useState([]);
    const [matrix, setMatrix] = useState();
    const [date, setDate] = useState([]);

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
    }, [nienKhoa, userName])
    useEffect(() => {
        if (tkb.length > 0) {
            const tkbMatrix = Array(6).fill(null).map(() => Array(8).fill(null));

            tkb.forEach(schedule => {
                const dayIndex = schedule.MaNgay - 2;
                const periodIndex = schedule.TietDay - 1;

                tkbMatrix[dayIndex][periodIndex] = {
                    TenMon: schedule.mon_hoc.TenMH,
                    TenLop: schedule.lop.TenLop
                };
            });
            tkbMatrix[0][0] = {
                TenMon: 'Chào cờ',
                TenGV: ''
            }
            tkbMatrix[5][3] = {
                TenMon: 'Sinh hoạt lớp',
                TenGV: ''
            }
            // const newTKB = {...tkb,tkbMatrix}
            setMatrix(tkbMatrix);
        }
    }, [tkb])
    if(matrix){
        console.log(matrix[0][0])
    }
    return (
        <div className="main-content">
            <Menu />
            <div className="right-part">
                <table className="border-2 table-fixed border-black border-collapse text-center w-[80%] mx-auto mt-5">
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
                            const startIndex = 4; // Start value for i
                            const currentIndex = i + startIndex;

                            return (
                                <tr key={currentIndex}>
                                    <td className="td">{currentIndex + 1}</td>
                                    {[...Array(6)].map((_, j) => (
                                       matrix &&  matrix[j][currentIndex] ?
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
        </div>
    )
}