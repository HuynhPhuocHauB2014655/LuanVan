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
    const [kt, setKT] = useState([]);
    const [NK, setNK] = useState([]);
    const [defaultNK, setDefaultNK] = useState(nienKhoa.NienKhoa);
    const [selectedClass, setSelectedClass] = useState('');
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
                let listNK = [];
                studentData.lop.forEach((lop) => {
                    const Nk = nk.data.find(item => item.MaNK === lop.MaNK);
                    if (Nk) {
                        listNK.push(Nk);
                    }
                });
                listNK.sort((a, b) => {
                    if (a.MaNK < b.MaNK) return -1; // Descending order
                    if (a.MaNK > b.MaNK) return 1;
                    return 0;
                });
                setNK(listNK);
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
        const diemtb = await axiosClient.post(`/diem/tb/hs`, payload1);
        setKqht(diemtb.data);
    }
    const getKT = async (nk) => {
        const payload1 = {
            MaNK: nk,
            MaLop: studentData.lop.find(item => item.MaNK == nk).MaLop,
            MSHS: studentData.MSHS,
        }
        const khenThuong = await axiosClient.post(`kt/get`, payload1);
        setKT(khenThuong.data);
    }
    const firstView = () => {
        setView(1);
    }
    const secondView = () => {
        setView(2);
        fetchDiem(nienKhoa.NienKhoa);
        getKQHT(nienKhoa.NienKhoa);
        getKT(nienKhoa.NienKhoa);
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
        const nk = NKRef.current.value;
        fetchDiem(nk);
        getKQHT(nk);
        getKT(nk);
    }
    useEffect(() => {
        const selectedMaNK = NKRef.current?.value;
        if (selectedMaNK) {
            const selectedLop = studentData.lop.find(item => item.MaNK === selectedMaNK);
            if (selectedLop) {
                setSelectedClass(selectedLop.TenLop);
            } else {
                setSelectedClass('');
            }
        }
    }, [studentData, NK, NKRef.current?.value]);
    console.log();
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
                        <div className="mt-3 flex justify-between">
                            <div className="grid grid-rows-1 grid-flow-col">
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
                                    Học tập và Rèn luyện
                                </button>
                                <button
                                    className={subView == 3 ?
                                        "border-e-2 rounded-e-md border-blue-400 px-3 py-2 border-y-2 bg-blue-400 text-white"
                                        :
                                        " border-e-2 rounded-e-md border-blue-400 px-3 py-2 border-y-2 hover:bg-blue-400 hover:text-white"}
                                    onClick={() => setSubView(3)}
                                >
                                    Khen thưởng
                                </button>
                            </div>
                            <div className="flex items-center text-3xl font-bold text-blue-500 text-center">
                                Lớp: {selectedClass || ''}
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="text-xl">Niên khóa:</div>
                                <select name="nienkhoa" ref={NKRef} defaultValue={defaultNK} onChange={selectedNK} className="rounded-md border-2 p-2">
                                    {NK.map((nk) => (
                                        <option key={nk.MaNK} value={nk.MaNK}>{nk.TenNK}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {subView == 1 &&
                            <div className="mt-3">
                                <div className="text-center font-bold text-blue-400 text-3xl relative py-2 my-2">
                                    Điểm chi tiết
                                    <span className="bottom-0 left-0 w-[30%] mx-auto bg-blue-200 h-1 block rounded-md"></span>
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

                                                    <td className="border border-black px-2 py-1" key={mh.MaMH + "234"}>
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
                        {subView == 2 &&
                            <div className="w-[90%] mx-auto mt-3">
                                <div className="text-center font-bold text-blue-400 text-3xl relative py-2 my-2">
                                    Kết quả Học tập và Rèn luyện
                                    <span className="bottom-0 left-0 w-[50%] mx-auto bg-blue-200 h-1 block rounded-md"></span>
                                </div>
                                <div className="flex space-x-2">
                                    <table className="w-full text-2xl">
                                        <tbody>
                                            <tr>
                                                <th className="border-2 border-black px-2 py-1 text-start">Trung bình HK1</th>
                                                <td className="border-2 border-black px-2 py-1 text-center">{kqht.Diem_TB_HKI || "-"}</td>
                                                <td className="border-2 border-black px-2 py-1 text-center" rowSpan={7}></td>
                                                <th className="border-2 border-black px-2 py-1 text-start" rowSpan={2}>Rèn luyện HK1</th>
                                                <td className="border-2 border-black px-2 py-1 text-center" rowSpan={2}>{kqht.ren_luyen_h_k1.TenRL}</td>
                                            </tr>
                                            <tr>
                                                <th className="border-2 border-black px-2 py-1 text-start">Xếp loại HK1</th>
                                                <td className="border-2 border-black px-2 py-1 text-center">{kqht.hoc_luc_h_k1.TenHL}</td>
                                            </tr>
                                            <tr>
                                                <th className="border-2 border-black px-2 py-1 text-start">Trung bình HK2</th>
                                                <td className="border-2 border-black px-2 py-1 text-center">{kqht.Diem_TB_HKII || "-"}</td>
                                                <th className="border-2 border-black px-2 py-1 text-start" rowSpan={2}>Rèn luyện HK2</th>
                                                <td className="border-2 border-black px-2 py-1 text-center" rowSpan={2}>{kqht.ren_luyen_h_k2.TenRL}</td>
                                            </tr>
                                            <tr>
                                                <th className="border-2 border-black px-2 py-1 text-start">Xếp loại HK2</th>
                                                <td className="border-2 border-black px-2 py-1 text-center">{kqht.hoc_luc_h_k2.TenHL}</td>
                                            </tr>
                                            <tr>
                                                <th className="border-2 border-black px-2 py-1 text-start">Trung bình Cả năm</th>
                                                <td className="border-2 border-black px-2 py-1 text-center">{kqht.Diem_TB_CN || "-"}</td>
                                                <th className="border-2 border-black px-2 py-1 text-start" rowSpan={2}>Rèn luyện Cả năm</th>
                                                <td className="border-2 border-black px-2 py-1 text-center" rowSpan={2}>{kqht.ren_luyen.TenRL}</td>
                                            </tr>
                                            <tr>
                                                <th className="border-2 border-black px-2 py-1 text-start">Xếp loại Cả năm</th>
                                                <td className="border-2 border-black px-2 py-1 text-center">{kqht.hoc_luc.TenHL}</td>
                                            </tr>
                                            <tr>
                                                <th className="border-2 border-black px-2 py-1 text-start">Rèn luyện lại sau hè</th>
                                                <td className="border-2 border-black px-2 py-1 text-center">{kqht.MaHLL > 0 ? kqht.hoc_luc_lai.TenHL : "-"}</td>
                                                <th className="border-2 border-black px-2 py-1 text-start">Rèn luyện lại sau hè</th>
                                                <td className="border-2 border-black px-2 py-1 text-center">{kqht.MaRLL > 0 ? kqht.ren_luyen_lai.TenRL : "-"}</td>
                                            </tr>
                                            <tr>
                                                <td className="border-2 border-black px-2 py-1 text-start font-bold text-red-500" colSpan={2}>Tổng kết:</td>
                                                <td className="border-2 border-black px-2 py-1 text-center"></td>
                                                <td className="border-2 border-black px-2 py-1 font-bold text-center" colSpan={3}>
                                                    {kqht.trang_thai.TenTT}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        }
                        {subView == 3 &&
                            <div className="w-[90%] mx-auto mt-3">
                                <div className="text-center font-bold text-blue-400 text-3xl relative py-2 my-2">
                                    Khen thưởng
                                    <span className="bottom-0 left-0 w-[30%] mx-auto bg-blue-200 h-1 block rounded-md"></span>
                                </div>
                                <div>
                                    {kt.length > 0 ?
                                        <table className="w-[80%] mx-auto text-2xl">
                                            <tbody>
                                                {kt.map((item, index) => (
                                                    <tr>
                                                        <td className="border-2 border-black px-2 py-1 text-center">{index + 1}</td>
                                                        <td key={item.id} className="border-2 border-black px-2 py-1 font-bold text-center">{item.KhenThuong}</td>
                                                        {item.TrangThai == 0 ?
                                                            <td className="border-2 border-black px-2 py-1 text-center text-red-500">Chưa duyệt</td>
                                                            :
                                                            <td className="border-2 border-black px-2 py-1 text-center text-green-500">Đã duyệt</td>
                                                        }
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        :
                                        <div className="text-3xl font-bold text-red-600 text-center mt-5">Không có khen thưởng</div>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    )
}