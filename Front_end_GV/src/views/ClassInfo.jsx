import { useState } from "react";
import Loading from "../components/Loading";
import Menu from "../components/Menu";
import { useStateContext } from "../context/Context";
import { useUserContext } from "../context/userContext";
import { useEffect } from "react";
import axiosClient from "../axios-client";
import { useLocation } from "react-router-dom";
import HocSinhTable from "../components/HocSinhTable";
import { useRef } from "react";
export default function ClassInfo() {
    const { userName } = useUserContext();
    const { nienKhoa } = useStateContext();
    const [loading, setLoading] = useState(true);
    const [loaiDiem, setLoaiDiem] = useState();
    const [diemHK1, setDiemHK1] = useState([]);
    const [diemHK2, setDiemHK2] = useState([]);
    // const [countDiemTX,setCountDiemTX] = useState({}); 
    const [show, setShow] = useState(1);
    const location = useLocation();
    const MaHK = useRef("1" + nienKhoa.NienKhoa);
    const { classData } = location.state || {};
    useEffect(() => {
        const fetchData = async () => {
            try {
                const loaidiem = await axiosClient.get(`/diem/loaidiem`);
                setLoaiDiem(loaidiem.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userName]);
    if (loading) {
        return <Loading />
    }
    const SetShow = async (show) => {
        if (show == 2) {
            const payloadHK1 = {
                MaHK: 1 + nienKhoa.NienKhoa,
                MaLop: classData.MaLop,
                MaMH: classData.MaMH
            }
            const payloadHK2 = {
                MaHK: 2 + nienKhoa.NienKhoa,
                MaLop: classData.MaLop,
                MaMH: classData.MaMH
            }
            setLoading(true);
            try {
                const [diemHk1, diemHk2] = await Promise.all([
                    axiosClient.post("/diem/get", payloadHK1),
                    axiosClient.post("/diem/get", payloadHK2),
                ]);
                setDiemHK1(diemHk1.data);
                setDiemHK2(diemHk2.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        setShow(show);
    }
    const diemHK = loaiDiem.filter((item) => item.MaLoai === 'tx' || item.MaLoai === 'gk' || item.MaLoai === 'ck');
    const countTX1 = {};
    if (diemHK1.length > 0) {
        classData.lop.hoc_sinh.map((student) => {
            const count = diemHK1.filter((item) => item.MSHS === student.MSHS && item.MaLoai === 'tx').length;
            countTX1[student.MSHS] = count;
        });
    }
    const countTX2 = {};
    if (diemHK2.length > 0) {
        classData.lop.hoc_sinh.map((student) => {
            const count = diemHK2.filter((item) => item.MSHS === student.MSHS && item.MaLoai === 'tx').length;
            countTX2[student.MSHS] = count;
        });
    }
    const generateTXCells = (grades, emptyCellsCount,student) => {
        if (grades.length == 0) {
            const cells = [...Array(4)].map((_, i) => (
                <td key={i} className="border border-black"></td>
            ));
            return cells;
        } else {
            const cells = grades.map((data, index) => (
                <td key={`tx-grade-${student.MSHS}-${index}`} className="border border-black">
                    {data.Diem || ""}
                </td>
            ));
            for (let i = 0; i < emptyCellsCount; i++) {
                cells.push(<td key={`tx-empty-${student.MSHS}-${i + cells.length}`} className="border border-black"></td>);
            }
            return cells;
        }
    };

    const generateOtherCells = (grades,student) => {
        if (grades.length == 0) {
            const cells = diemHK.map((data) => (
                data.MaLoai != 'tx' &&
                <td key={data.MaLoai} className="border border-black">
                </td>
            ))
            return cells;
        } else {
            return grades.map((data, index) => (
                <td key={`other-grade-${student.MSHS}-${index}`} className="border border-black">
                    {data.Diem || ""}
                </td>
            ));
        }
    };
    return (
        <div className="main-content">
            <Menu />
            <div className="right-part mb-2">
                <h1 className="page-name">Thông tin lớp</h1>
                <div className="my-2 flex">
                    <button className="w-1/2 border py-2 text-xl border-collapse border-cyan-600 bg-slate-200 shadow-md hover:bg-cyan-200" onClick={() => SetShow(1)}>Danh sách lớp</button>
                    <button className="w-1/2 border py-2 text-xl border-collapse border-cyan-600 bg-slate-200 shadow-md hover:bg-cyan-200" onClick={() => SetShow(2)}>Quản lí điểm</button>
                </div>
                <div className="flex justify-between px-2 text-xl">
                    <p><strong>Tên lớp:</strong> {classData.lop.TenLop}</p>
                    <p><strong>Môn dạy:</strong> {classData.mon_hoc.TenMH}</p>
                    <p><strong>Sỉ số:</strong> {classData.lop.hoc_sinh.length}</p>
                </div>
                {show == 1 &&
                    <div>
                        <HocSinhTable datas={classData.lop.hoc_sinh} />
                    </div>
                }
                {show == 2 &&
                    <div>
                        <div className="flex justify-end">
                        </div>
                        <table className="w-full border border-black border-collapse">
                            <thead>
                                <tr>
                                    <th className="border border-black"></th>
                                    <th className="border border-black"></th>
                                    <th className="border border-black" colSpan={6}>Học kì I</th>
                                    <th className="border border-black" colSpan={6}>Học kì II</th>
                                </tr>
                                <tr>
                                    <th className="border border-black">Mã số học sinh</th>
                                    <th className="border border-black">Tên học sinh</th>
                                    {diemHK.map((data) => (
                                        data.MaLoai === 'tx' ?
                                            <th key={data.MaLoai} className="border border-black" colSpan={4}>
                                                {data.TenLoai}
                                            </th>
                                            :
                                            <th key={data.MaLoai} className="border border-black">
                                                {data.TenLoai}
                                            </th>
                                    ))}
                                    {diemHK.map((data) => (
                                        data.MaLoai === 'tx' ?
                                            <th key={data.MaLoai} className="border border-black" colSpan={4}>
                                                {data.TenLoai}
                                            </th>
                                            :
                                            <th key={data.MaLoai} className="border border-black">
                                                {data.TenLoai}
                                            </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {classData.lop.hoc_sinh.map((student) => {
                                    const txGrades1 = diemHK1.filter((item) => item.MSHS === student.MSHS && item.MaLoai === "tx");
                                    const txGrades2 = diemHK2.filter((item) => item.MSHS === student.MSHS && item.MaLoai === "tx");
                                    const otherGrades1 = diemHK1.filter((item) => item.MSHS === student.MSHS && item.MaLoai != "tx");
                                    const otherGrades2 = diemHK2.filter((item) => item.MSHS === student.MSHS && item.MaLoai != "tx");

                                    const emptyTXCellsCount1 = 4 - (countTX1[student.MSHS] || 0);
                                    const emptyTXCellsCount2 = 4 - (countTX2[student.MSHS] || 0);



                                    return (
                                        <tr key={student.MSHS}>
                                            <td className="border border-black">{student.MSHS}</td>
                                            <td className="border border-black">{student.HoTen}</td>

                                            {generateTXCells(txGrades1, emptyTXCellsCount1, student)}

                                            {generateOtherCells(otherGrades1, student)}

                                            {generateTXCells(txGrades2, emptyTXCellsCount2, student)}

                                            {generateOtherCells(otherGrades2, student)}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                    </div>
                }
            </div>
        </div>
    )
}