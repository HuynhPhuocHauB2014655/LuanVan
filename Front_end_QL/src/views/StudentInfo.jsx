import { useState, useEffect, useRef } from "react";
import Menu from "../components/Menu";
import { useStateContext } from "../context/Context";
import { useUserContext } from "../context/userContext";
import axiosClient from "../axios-client";
import { useLocation, useNavigate } from "react-router-dom";
import AlterConfirm from "../components/Confirm";
export default function StudentInfo() {
    const location = useLocation();
    const { studentData } = location.state || {};
    const { nienKhoa } = useStateContext();
    const [view, setView] = useState(1);
    const [subView, setSubView] = useState(1);
    const [loaiDiem, setLoaiDiem] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [diemHK1, setDiemHK1] = useState([]);
    const [diemHK2, setDiemHK2] = useState([]);
    const [kqht, setKqht] = useState([]);
    const [NK, setNK] = useState([]);
    const NKRef = useRef();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosClient.get('/diem/loaidiem');
                setLoaiDiem(data);
                var urlMH = '';
                if (studentData.lop[0].MaLop.substring(0, 1) === "C") {
                    urlMH = '/mh/xh';
                } else {
                    urlMH = '/mh/tn';
                }
                const sujs = await axiosClient.get(urlMH);
                setSubjects(sujs.data);
                const nk = await axiosClient.get("/nk/index");
                setNK(nk.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    const fetchDiem = async (nk) => {
        const payloadHK1 = { MaHK: 1 + nk, MaLop: studentData.lop.find(item => item.MaNK == nk).MaLop, MSHS: studentData.MSHS };
        const payloadHK2 = { MaHK: 2 + nk, MaLop: studentData.lop.find(item => item.MaNK == nk).MaLop, MSHS: studentData.MSHS };
        const [diemHk1, diemHk2] = await Promise.all([
            axiosClient.post("/diem/hs", payloadHK1),
            axiosClient.post("/diem/hs", payloadHK2),
        ]);
        setDiemHK1(diemHk1.data);
        setDiemHK2(diemHk2.data);
    };
    const getKQHT = async (nk) => {
        const payload1 = {
            MaNK: nk,
            MaLop: studentData.lop.find(item => item.MaNK == nk).MaLop,
            MSHS: studentData.MSHS,
        }
        const diemtb = await axiosClient.post(`/diem/tb`, payload1);
        setKqht(diemtb.data);
    }
    const firstView = () => {
        setView(1);
    }
    const secondView = () => {
        setView(2);
        fetchDiem(nienKhoa.NienKhoa);
        getKQHT(nienKhoa.NienKhoa);
    }
    const generateTXCells = (grades, emptyCellsCount, subject) => {
        if (grades.length == 0) {
            const cells = [...Array(4)].map((_, i) => (
                <td key={i} className="border border-black px-2 py-1">-</td>
            ));
            return cells;
        } else {
            const cells = grades.map((data, index) => (
                data.Diem >= 0 ?
                    <td key={`other-grade-${subject.MaMH}-${index}`} className="border border-black px-2 py-1">
                        {data.MaMH == 'CB4' || data.MaMH == 'CB5' ? data.Diem == 0 ? "Chưa đạt" : "Đạt" : data.Diem}
                    </td>
                    :
                    <td key={`other-grade-${subject.MaMH}-${index}`} className="border border-black px-2 py-1">-
                    </td>
            ));
            for (let i = 0; i < emptyCellsCount; i++) {
                cells.push(<td key={`tx-empty-${subject.MaMH}-${i + cells.length}`} className="border border-black px-2 py-1">-</td>);
            }
            return cells;
        }
    };

    const generateOtherCells = (grades, subject) => {
        if (grades.length === 0) {
            return (
                <>
                    <td className="border border-black px-2 py-1">-</td>
                    <td className="border border-black px-2 py-1">-</td>
                </>
            );
        } else {
            return grades.map((data, index) => (
                data.Diem >= 0 ?
                    <td key={`other-grade-${subject.MaMH}-${index}`} className="border border-black px-2 py-1">
                        {data.MaMH == 'CB4' || data.MaMH == 'CB5' ? data.Diem == 0 ? "Chưa đạt" : "Đạt" : data.Diem}
                    </td>
                    :
                    <td key={`other-grade-${subject.MaMH}-${index}`} className="border border-black px-2 py-1">-
                    </td>
            ));
        }
    };
    const selectedNK = () => {
        console.log(NKRef.current.value);
    }
    console.log(nienKhoa.NienKhoa);
    return (
        <div className="main-content">
            <Menu />
            <div className="right-part mb-2 relative">
                <div className="page-name">
                    Thông tin Học sinh
                </div>
                <div className="mt-2 grid gird-rows-1 grid-flow-col">
                    <button className={view == 1 ? "class-info-head-active border-x-2 rounded-s-md" : "class-info-head border-x-2 rounded-s-md"} onClick={firstView}>Thông tin cá nhân</button>
                    <button className={view == 2 ? "class-info-head-active border-x-2" : "class-info-head border-x-2"} onClick={secondView}>Kết quả học tập</button>
                </div>
                {view == 1 &&
                    <div className="max-w-[90%] mx-auto mt-3">
                        <table className="table w-full border-2 border-black border-collapse text-xl" >
                            <tbody>
                                <tr>
                                    <th className="border-2 border-black p-2">Mã số học sinh</th>
                                    <td className="border-2 border-black p-2">{studentData.MSHS}</td>
                                </tr>
                                <tr>
                                    <th className="border-2 border-black p-2">Tên học sinh</th>
                                    <td className="border-2 border-black p-2">{studentData.HoTen}</td>
                                </tr>
                                <tr>
                                    <th className="border-2 border-black p-2">Ngày sinh</th>
                                    <td className="border-2 border-black p-2">{studentData.NgaySinh}</td>
                                </tr>
                                <tr>
                                    <th className="border-2 border-black p-2">Giới tính</th>
                                    <td className="border-2 border-black p-2">{studentData.GioiTinh}</td>
                                </tr>
                                <tr>
                                    <th className="border-2 border-black p-2">Tôn giáo</th>
                                    <td className="border-2 border-black p-2">{studentData.TonGiao}</td>
                                </tr>
                                <tr>
                                    <th className="border-2 border-black p-2">Quê quán</th>
                                    <td className="border-2 border-black p-2">{studentData.QueQuan}</td>
                                </tr>
                                <tr>
                                    <th className="border-2 border-black p-2">Địa chỉ</th>
                                    <td className="border-2 border-black p-2">{studentData.DiaChi}</td>
                                </tr>
                                <tr>
                                    <th className="border-2 border-black p-2">Số điện thoại</th>
                                    <td className="border-2 border-black p-2">{studentData.SDT}</td>
                                </tr>
                                <tr>
                                    <th className="border-2 border-black p-2">Lịch sử học tập</th>
                                    <td className="border-2 border-black p-2">
                                        <div>
                                            {studentData.lop.map((lop) => (
                                                <div key={lop.MaLop}>
                                                    {lop.MaNK} - {lop.TenLop}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                }
                {view == 2 &&
                    <div className="max-w-[90%] mx-auto">
                        <div className="mt-3 flex justify-center">
                            <button
                                className={subView == 1 ?
                                    "border-x-2 rounded-s-md border-blue-400 px-3 py-2 border-y-2 bg-blue-400 text-white"
                                    :
                                    " border-x-2 rounded-s-md border-blue-400 px-3 py-2 border-y-2 hover:bg-blue-400 hover:text-white"}
                                onClick={() => setSubView(1)}
                            >
                                Điểm chi tiết
                            </button>
                            <button
                                className={subView == 2 ?
                                    "border-e-2 border-blue-400 px-3 py-2 border-y-2 bg-blue-400 text-white"
                                    :
                                    " border-e-2 border-blue-400 px-3 py-2 border-y-2 hover:bg-blue-400 hover:text-white"}
                                onClick={() => setSubView(2)}
                            >
                                Kết quả học tập
                            </button>
                            <button
                                className={subView == 3 ?
                                    "border-e-2 border-blue-400 px-3 py-2 border-y-2 bg-blue-400 text-white"
                                    :
                                    " border-e-2 border-blue-400 px-3 py-2 border-y-2 hover:bg-blue-400 hover:text-white"}
                                onClick={() => setSubView(3)}
                            >
                                Kết quả rèn luyện
                            </button>
                            <button
                                className={subView == 4 ?
                                    "border-e-2 rounded-e-md border-blue-400 px-3 py-2 border-y-2 bg-blue-400 text-white"
                                    :
                                    " border-e-2 rounded-e-md border-blue-400 px-3 py-2 border-y-2 hover:bg-blue-400 hover:text-white"}
                                onClick={() => setSubView(4)}
                            >
                                Khen thưởng
                            </button>
                        </div>
                        {subView == 1 &&
                            <div className="mt-3">
                                <div className="text-center font-bold text-blue-400 text-3xl relative py-2">
                                    Điểm chi tiết
                                    <span className="bottom-0 left-0 w-[30%] mx-auto bg-blue-200 h-1 block rounded-md"></span>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-2xl font-semibold">
                                        Niên khóa: {diemHK1[0]?.hoc_ki.nien_khoa.TenNK}
                                    </div>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="text-xl">Niên khóa:</div>
                                        <select name="nienkhoa" ref={NKRef} onChange={selectedNK} className="rounded-md">
                                            {NK.map((nk) => (
                                                nk.MaNK == nienKhoa.NienKhoa ?
                                                    <option key={nk.MaNK} defaultChecked value={nk.MaNK}>{nk.TenNK}</option>
                                                    :
                                                    <option key={nk.MaNK} value={nk.MaNK}>{nk.TenNK}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <table className="text-center text-xl">
                                    <thead>
                                        <tr>
                                            <th className="border border-black px-2 py-1"></th>
                                            <th className="border border-black px-2 py-1" colSpan={7}>Học kì I</th>
                                            <th className="border border-black px-2 py-1" colSpan={7}>Học kì II</th>
                                            <th className="border border-black px-2 py-1" colSpan={2}>Cả năm</th>
                                        </tr>
                                        <tr>
                                            <th className="border border-black px-2 py-1">Tên môn</th>
                                            <th className="border border-black px-2 py-1" colSpan={4}>Đánh giá thường xuyên</th>
                                            <th className="border border-black px-2 py-1">Đánh giá giữa kì</th>
                                            <th className="border border-black px-2 py-1">Đánh giá cuối kì</th>
                                            <th className="border border-black px-2 py-1">Trung bình học kì 1</th>
                                            <th className="border border-black px-2 py-1" colSpan={4}>Đánh giá thường xuyên</th>
                                            <th className="border border-black px-2 py-1">Đánh giá giữa kì</th>
                                            <th className="border border-black px-2 py-1">Đánh giá cuối kì</th>
                                            <th className="border border-black px-2 py-1">Trung bình học kì 2</th>
                                            <th className="border border-black px-2 py-1">Rèn luyện hè</th>
                                            <th className="border border-black px-2 py-1">Trung bình cả năm</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subjects.map((mh) => {
                                            const txGrades1 = diemHK1.filter((item) => mh.MaMH === item.MaMH && item.MaLoai === "tx");
                                            const txGrades2 = diemHK2.filter((item) => mh.MaMH === item.MaMH && item.MaLoai === "tx");
                                            const otherGrades1 = diemHK1.filter((item) => mh.MaMH === item.MaMH && (item.MaLoai === "ck" || item.MaLoai === "gk"));
                                            const otherGrades2 = diemHK2.filter((item) => mh.MaMH === item.MaMH && (item.MaLoai === "ck" || item.MaLoai === "gk"));
                                            const TBHK1 = diemHK1.find((item) => mh.MaMH === item.MaMH && item.MaLoai === "tbhk1");
                                            const TBHK2 = diemHK2.find((item) => mh.MaMH === item.MaMH && item.MaLoai === "tbhk2");
                                            const TBCN = diemHK2.find((item) => mh.MaMH === item.MaMH && item.MaLoai == 'tbcn');
                                            const RLH = diemHK2.find((item) => mh.MaMH === item.MaMH && item.MaLoai == 'rlh');
                                            const countTX1 = txGrades1.length;
                                            const countTX2 = txGrades2.length;
                                            const emptyTXCellsCount1 = 4 - (countTX1 || 0);
                                            const emptyTXCellsCount2 = 4 - (countTX2 || 0);
                                            return (
                                                <tr key={mh.MaMH}>
                                                    <td className="border border-black text-start px-2 py-1">{mh.TenMH}</td>

                                                    {generateTXCells(txGrades1, emptyTXCellsCount1, mh)}

                                                    {generateOtherCells(otherGrades1, mh)}

                                                    <td className="border border-black px-2 py-1" key={mh.MaMH+"234"}>
                                                        {TBHK1?.Diem >= 0 ? TBHK1?.MaMH == "CB4" || TBHK1?.MaMH == "CB5" ? TBHK1?.Diem == 0 ? "Chưa đạt" : "Đạt" : TBHK1.Diem : "-"}
                                                    </td>

                                                    {generateTXCells(txGrades2, emptyTXCellsCount2, mh)}

                                                    {generateOtherCells(otherGrades2, mh)}


                                                    <td className="border border-black px-2 py-1">{TBHK2?.Diem >= 0 ? TBHK2?.MaMH == 'CB4' || TBHK2?.MaMH == 'CB5' ? TBHK2?.Diem == 0 ? "Chưa đạt" : "Đạt" : TBHK2.Diem : "-"}</td>
                                                    <td className="border border-black px-2 py-1">{RLH?.Diem >= 0 ? RLH?.MaMH == 'CB4' || RLH?.MaMH == 'CB5' ? RLH?.Diem == 0 ? "Chưa đạt" : "Đạt" : RLH.Diem : "-"}</td>
                                                    <td className="border border-black px-2 py-1">{TBCN?.Diem >= 0 ? TBCN?.MaMH == 'CB4' || TBCN?.MaMH == 'CB5' ? TBCN?.Diem == 0 ? "Chưa đạt" : "Đạt" : TBCN.Diem : "-"}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    )
}