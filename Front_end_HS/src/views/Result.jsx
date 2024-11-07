import { useState, useEffect, useRef } from "react";
import Menu from "../components/Menu";
import { useStateContext } from "../context/Context";
import { useUserContext } from "../context/userContext";
import axiosClient from "../axios-client";
import { useLocation, useNavigate } from "react-router-dom";
import AlterConfirm from "../components/Confirm";
import Header from "../components/Header";
export default function Result() {
    const { userName } = useUserContext();
    const { nienKhoa } = useStateContext();
    const [info, setInfo] = useState();
    const [view, setView] = useState(1);
    const [subView, setSubView] = useState(1);
    const [loaiDiem, setLoaiDiem] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [diemHK1, setDiemHK1] = useState([]);
    const [diemHK2, setDiemHK2] = useState([]);
    const [kqht, setKqht] = useState([]);
    const [kt, setKT] = useState([]);
    const [NK, setNK] = useState([]);
    const [HK, setHK] = useState(1);
    const [onMd, setOnMd] = useState(false);
    const [selectedClass, setSelectedClass] = useState('');
    const NKRef = useRef();
    const HKRef = useRef();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const _info = await axiosClient.get(`/hs/show/${userName}`);
                setInfo(_info.data);
                const { data } = await axiosClient.get('/diem/loaidiem');
                setLoaiDiem(data);
                var urlMH = '';
                if (userName.substring(0, 2) === "XH") {
                    urlMH = '/mh/xh';
                } else {
                    urlMH = '/mh/tn';
                }
                const sujs = await axiosClient.get(urlMH);
                setSubjects(sujs.data);
                const nk = await axiosClient.get("/nk/index");
                let listNK = [];
                console.log(_info.data);
                _info.data.lop.forEach((lop) => {
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
        const payloadHK1 = { MaHK: 1 + nk, MaLop: info.lop.find(item => item.MaNK == nk).MaLop, MSHS: userName };
        const payloadHK2 = { MaHK: 2 + nk, MaLop: info.lop.find(item => item.MaNK == nk).MaLop, MSHS: userName };
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
            MaLop: info.lop.find(item => item.MaNK == nk).MaLop,
            MSHS: userName,
        }
        const diemtb = await axiosClient.post(`/diem/tb/hs`, payload1);
        setKqht(diemtb.data);
    }
    const getKT = async (nk) => {
        const payload1 = {
            MaNK: nk,
            MaLop: info.lop.find(item => item.MaNK == nk).MaLop,
            MSHS: userName,
        }
        const khenThuong = await axiosClient.post(`kt/get`, payload1);
        setKT(khenThuong.data);
    }
    useEffect(() => {
        if (info && nienKhoa.NienKhoa) {
            fetchDiem(nienKhoa.NienKhoa);
            getKQHT(nienKhoa.NienKhoa);
            getKT(nienKhoa.NienKhoa);
        }
    }, [info, nienKhoa])
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
            const selectedLop = info?.lop.find(item => item.MaNK === selectedMaNK);
            if (selectedLop) {
                setSelectedClass(selectedLop.TenLop);
            } else {
                setSelectedClass('');
            }
        }
    }, [info, NK, NKRef.current?.value]);
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
    return (
        <div>
            <Header />
            <div className="main-content">
                <Menu />
                <div className="right-part mb-2 relative">
                    <div className="page-name">
                        Kết quả học tập
                    </div>
                    <div className="max-w-[90%] mx-auto">
                        <div className="mt-3 md:flex md:justify-between md:text-start text-center space-y-3">
                            <div className="grid grid-rows-1 grid-flow-col text-sm md:text-base">
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
                            <div className="text-3xl font-bold text-blue-500">
                                Lớp: {selectedClass || ''}
                            </div>
                            <div className="flex items-center space-x-2 justify-center">
                                <div className="text-xl">Niên khóa:</div>
                                <select name="nienkhoa" ref={NKRef} onChange={selectedNK} className="rounded-md border-2 border-black px-3 py-2">
                                    <option value={nienKhoa.NienKhoa}>{NK.find(item => item.MaNK == nienKhoa.NienKhoa)?.TenNK}</option>
                                    {NK.filter(item => item.MaNK !== nienKhoa.NienKhoa).map((nk) => (
                                        <option key={nk.MaNK} value={nk.MaNK}>{nk.TenNK}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {subView == 1 &&
                            (onMd ?
                                <div className="my-3 bg-white">
                                    {subjects.map((mh) => {
                                        const txGrades1 = diemHK1.filter((item) => mh.MaMH === item.MaMH && item.MaLoai === "tx");
                                        const txGrades2 = diemHK2.filter((item) => mh.MaMH === item.MaMH && item.MaLoai === "tx");
                                        const GK1 = diemHK1.find((item) => mh.MaMH === item.MaMH && (item.MaLoai === "ck"));
                                        const CK1 = diemHK1.find((item) => mh.MaMH === item.MaMH && (item.MaLoai === "gk"));
                                        const GK2 = diemHK2.find((item) => mh.MaMH === item.MaMH && (item.MaLoai === "ck"));
                                        const CK2 = diemHK2.find((item) => mh.MaMH === item.MaMH && (item.MaLoai === "gk"));
                                        const TBHK1 = diemHK1.find((item) => mh.MaMH === item.MaMH && item.MaLoai === "tbhk1");
                                        const TBHK2 = diemHK2.find((item) => mh.MaMH === item.MaMH && item.MaLoai === "tbhk2");
                                        const TBCN = diemHK2.find((item) => mh.MaMH === item.MaMH && item.MaLoai == 'tbcn');
                                        const RLH = diemHK2.find((item) => mh.MaMH === item.MaMH && item.MaLoai == 'rlh');
                                        const countTX1 = txGrades1.length;
                                        const countTX2 = txGrades2.length;
                                        const emptyTXCellsCount1 = 4 - (countTX1 || 0);
                                        const emptyTXCellsCount2 = 4 - (countTX2 || 0);
                                        return (
                                            <table key={mh.MaMH} className="w-full table-auto my-2 text-center">
                                                <thead>
                                                    <tr>
                                                        <th colSpan={5} className="border border-black px-3 py-2">{mh.TenMH}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th className="border border-black px-3 py-2"></th>
                                                        <th colSpan={4} className="border border-black px-3 py-2">Học kì 1</th>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-black px-3 py-2">Đánh Giá TX</td>
                                                        {generateTXCells(txGrades1, emptyTXCellsCount1, mh)}
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-black px-3 py-2">Đánh Giá GK</td>
                                                        <td colSpan={4} className="border border-black px-3 py-2">
                                                            {GK1 ? (mh.MaMH == 'CB4' || mh.MaMH == 'CB5' ? GK1.Diem == 0 ? "Chưa đạt" : "Đạt" : GK1.Diem) : "-"}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-black px-3 py-2">Đánh Giá CK</td>
                                                        <td colSpan={4} className="border border-black px-3 py-2">
                                                            {CK1 ? (mh.MaMH == 'CB4' || mh.MaMH == 'CB5' ? CK1.Diem == 0 ? "Chưa đạt" : "Đạt" : CK1.Diem) : "-"}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-black px-3 py-2">TBHK</td>
                                                        <td colSpan={4} className="border border-black px-3 py-2">
                                                            {TBHK1 ? (mh.MaMH == 'CB4' || mh.MaMH == 'CB5' ? TBHK1.Diem == 0 ? "Chưa đạt" : "Đạt" : TBHK1.Diem) : "-"}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th className="border border-black px-3 py-2"></th>
                                                        <td colSpan={4} className="border border-black px-3 py-2">Học kì 2</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-black px-3 py-2">Đánh Giá TX</td>
                                                        {generateTXCells(txGrades2, emptyTXCellsCount2, mh)}
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-black px-3 py-2">Đánh Giá GK</td>
                                                        <td colSpan={4} className="border border-black px-3 py-2">
                                                            {GK2 ? (mh.MaMH == 'CB4' || mh.MaMH == 'CB5' ? GK2.Diem == 0 ? "Chưa đạt" : "Đạt" : GK2.Diem) : "-"}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-black px-3 py-2">Đánh Giá CK</td>
                                                        <td colSpan={4} className="border border-black px-3 py-2">
                                                            {CK2 ? (mh.MaMH == 'CB4' || mh.MaMH == 'CB5' ? CK2.Diem == 0 ? "Chưa đạt" : "Đạt" : CK2.Diem) : "-"}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-black px-3 py-2">TBHK</td>
                                                        <td colSpan={4} className="border border-black px-3 py-2">
                                                            {TBHK2 ? (mh.MaMH == 'CB4' || mh.MaMH == 'CB5' ? TBHK2.Diem == 0 ? "Chưa đạt" : "Đạt" : TBHK2.Diem) : "-"}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th colSpan={5} className="border border-black px-3 py-2">Cả năm</th>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-black px-3 py-2">TBCN</td>
                                                        <td colSpan={4} className="border border-black px-3 py-2">
                                                            {TBCN ? (mh.MaMH == 'CB4' || mh.MaMH == 'CB5' ? TBCN.Diem == 0 ? "Chưa đạt" : "Đạt" : TBCN.Diem) : "-"}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-black px-3 py-2">RL Hè</td>
                                                        <td colSpan={4} className="border border-black px-3 py-2">
                                                            {RLH ? (mh.MaMH == 'CB4' || mh.MaMH == 'CB5' ? RLH.Diem == 0 ? "Chưa đạt" : "Đạt" : RLH.Diem) : "-"}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        )
                                    })}
                                </div>
                                :
                                <div className="my-3">
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
                                </div>)
                        }
                        {subView == 2 &&
                            <div className="w-[90%] mx-auto mt-3">
                                <div className="text-center font-bold text-blue-400 text-3xl relative py-2 my-2">
                                    Kết quả Học tập và Rèn luyện
                                    <span className="bottom-0 left-0 w-[50%] mx-auto bg-blue-200 h-1 block rounded-md"></span>
                                </div>
                                <div className="">
                                    {onMd ?
                                        <table className="w-full">
                                            <tbody>
                                                <tr>
                                                    <th className="border-2 border-black px-2 py-1 text-center" colSpan={2}>Học tập</th>
                                                </tr>
                                                <tr>
                                                    <th className="border-2 border-black px-2 py-1 text-start">TBHK I</th>
                                                    <td className="border-2 border-black px-2 py-1 text-center">{kqht.Diem_TB_HKI || "-"}</td>
                                                </tr>
                                                <tr>
                                                    <th className="border-2 border-black px-2 py-1 text-start">Xếp loại HK1</th>
                                                    <td className="border-2 border-black px-2 py-1 text-center">{kqht.hoc_luc_h_k1.TenHL}</td>
                                                </tr>
                                                <tr>
                                                    <th className="border-2 border-black px-2 py-1 text-start">TBHK II</th>
                                                    <td className="border-2 border-black px-2 py-1 text-center">{kqht.Diem_TB_HKII || "-"}</td>
                                                </tr>
                                                <tr>
                                                    <th className="border-2 border-black px-2 py-1 text-start">Xếp loại HK2</th>
                                                    <td className="border-2 border-black px-2 py-1 text-center">{kqht.hoc_luc_h_k2.TenHL}</td>
                                                </tr>
                                                <tr>
                                                    <th className="border-2 border-black px-2 py-1 text-start">Trung bình Cả năm</th>
                                                    <td className="border-2 border-black px-2 py-1 text-center">{kqht.Diem_TB_CN || "-"}</td>
                                                </tr>
                                                <tr>
                                                    <th className="border-2 border-black px-2 py-1 text-start">Xếp loại Cả năm</th>
                                                    <td className="border-2 border-black px-2 py-1 text-center">{kqht.hoc_luc.TenHL}</td>
                                                </tr>
                                                <tr>
                                                    <th className="border-2 border-black px-2 py-1 text-start">Rèn luyện lại sau hè</th>
                                                    <td className="border-2 border-black px-2 py-1 text-center">{kqht.MaHLL > 0 ? kqht.hoc_luc_lai.TenHL : "-"}</td>
                                                </tr>
                                                <tr>
                                                    <th className="border-2 border-black px-2 py-1 text-center" colSpan={2}>Rèn luyện</th>
                                                </tr>
                                                <tr>
                                                    <th className="border-2 border-black px-2 py-1 text-start">Rèn luyện HK1</th>
                                                    <td className="border-2 border-black px-2 py-1 text-center">{kqht.ren_luyen_h_k1.TenRL}</td>
                                                </tr>
                                                <tr>
                                                    <th className="border-2 border-black px-2 py-1 text-start">Rèn luyện HK2</th>
                                                    <td className="border-2 border-black px-2 py-1 text-center">{kqht.ren_luyen_h_k2.TenRL}</td>
                                                </tr>
                                                <tr>
                                                    <th className="border-2 border-black px-2 py-1 text-start">Rèn luyện CN</th>
                                                    <td className="border-2 border-black px-2 py-1 text-center">{kqht.ren_luyen.TenRL}</td>
                                                </tr>
                                                <tr>
                                                    <th className="border-2 border-e-0 border-black px-2 py-1 text-center text-red-500">Tổng kết:</th>
                                                    <th className="border-2 border-s-0 border-black px-2 py-1 text-center text-red-500">{kqht.trang_thai.TenTT}</th>
                                                </tr>
                                            </tbody>
                                        </table>
                                        :
                                        <table className="w-full text-2xl">
                                            <tbody>
                                                <tr>
                                                    <th className="border-2 border-black px-2 py-1 text-center" colSpan={2}>Học tập</th>
                                                    <td className="border-2 border-black px-2 py-1 text-center" rowSpan={8}></td>
                                                    <th className="border-2 border-black px-2 py-1 text-center" colSpan={2}>Rèn luyện</th>
                                                </tr>
                                                <tr>
                                                    <th className="border-2 border-black px-2 py-1 text-start">Trung bình HK1</th>
                                                    <td className="border-2 border-black px-2 py-1 text-center">{kqht.Diem_TB_HKI || "-"}</td>
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
                                    }
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
                </div>
            </div>
        </div>
    )
}