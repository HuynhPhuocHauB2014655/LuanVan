import { useState, useEffect, useRef } from "react";
import Menu from "../components/Menu";
import { useStateContext } from "../context/Context";
import { useUserContext } from "../context/userContext";
import axiosClient from "../axios-client";
import { useLocation, useNavigate } from "react-router-dom";
import HocSinhTable from "../components/HocSinhTable";
import BangDiem from "../components/BangDiem";
import AlterConfirm from "../components/Confirm";
import Header from "../components/Header";
export default function ClassInfo() {
    const location = useLocation();
    const { classData } = location.state || {};
    const [view, setView] = useState(1);
    const [loaiDiem, setLoaiDiem] = useState([]);
    const [diem, setDiem] = useState([]);
    const { nienKhoa, setMessage, setError } = useStateContext();
    const [diemHK1, setDiemHK1] = useState([]);
    const [diemHK2, setDiemHK2] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [kqht, setKqht] = useState([]);
    const [dsKhenThuong, setDsKhenThuong] = useState([]);
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [showConfirm, setShowConfirm] = useState(0);
    const { userName } = useUserContext();
    const FRef = useRef();
    useEffect(() => {
        if (userName == "nhansu") {
            setError("Bạn không có quyền truy cập trang này");
            navigate('/');
        }
    }, [userName]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosClient.get('/diem/loaidiem');
                setLoaiDiem(data);
                var urlMH = '';
                if (classData.MaLop.substring(0, 1) === "C") {
                    urlMH = '/mh/xh';
                } else {
                    urlMH = '/mh/tn';
                }
                const sujs = await axiosClient.get(urlMH);
                setSubjects(sujs.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
        fetchDiem();
    }, []);
    const fetchDiem = async () => {
        const payloadHK1 = { MaHK: 1 + classData.MaNK, MaLop: classData.MaLop };
        const payloadHK2 = { MaHK: 2 + classData.MaNK, MaLop: classData.MaLop };
        const [diemHk1, diemHk2] = await Promise.all([
            axiosClient.post("/diem/cn", payloadHK1),
            axiosClient.post("/diem/cn", payloadHK2),
        ]);
        setDiemHK1(diemHk1.data);
        setDiemHK2(diemHk2.data);
    };
    const firstView = () => {
        setView(1);
    }
    const secondView = async () => {
        setView(2);
        fetchDiem();
    }
    const getKQHT = async () => {
        const payload1 = {
            MaNK: classData.MaNK,
            MaLop: classData.MaLop
        }
        console.log(payload1);
        const diemtb = await axiosClient.post(`/diem/tb`, payload1);
        setKqht(diemtb.data);
    }
    const thirdView = () => {
        getKQHT();
        setView(3);
    }
    const fourthView = () => {
        if (kqht.length == 0) {
            getKQHT();
        }
        setView(4);
    }
    const fiftthView = () => {
        if (kqht.length == 0) {
            getKQHT();
        }
        setView(5);
    }
    const fetchKhenThuong = async () => {
        try {
            const kt = await axiosClient.get(`/kt/get/${classData.MaLop}`);
            setDsKhenThuong(kt.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const sixthView = () => {
        setView(6);
        fetchKhenThuong();
    }
    const duyetKQ = async () => {
        setShowConfirm(0);
        try {
            const res = await axiosClient.get(`lop/duyetkq/${classData.MaLop}`);
            setMessage("Đã duyệt thành công");
            navigate(-1);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const YCChinhSua = async (e) => {
        e.preventDefault();
        const payload = {
            MaLop: classData.MaLop,
            ChinhSua: FRef.current.value,
        }
        try{
            await axiosClient.post("/lop/cs",payload);
            setMessage("Đã cập nhật thành công");
            setShowForm(false);
        }catch(error){
            console.log(error);
        }
    }
    const onCancel = () => {
        setShowConfirm(0);
    }
    console.log()
    return (
        <div>
            <Header />
            <div className="main-content relative">
                {showConfirm === 1 &&
                    <AlterConfirm message={'Bạn có chắc chắn với hành động này không?'} onConfirm={duyetKQ} onCancel={onCancel} />
                }
                <Menu />
                <div className="right-part mb-2 relative">
                    {showForm && 
                        <form onSubmit={YCChinhSua} className="z-10 absolute top-64 left-1/4 w-1/2 p-5 bg-white border-2 border-slate-300 rounded-md shadow-md">
                            <button type="button" className="absolute top-0 right-1 p-0 hover:text-red-500 font-bold" onClick={() => setShowForm(false)}>X</button>
                            <div className="text-center bg-slate-300 p-3 text-xl font-bold rounded">Yêu cầu chỉnh sửa</div>
                            <textarea name="ChinhSua" ref={FRef} className="resize-none w-full p-3 border-2 border-slate-300 mt-3 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows="5" placeholder="Nội dung yêu cầu chỉnh sửa"></textarea>
                            <button className="w-full border-2 border-blue-500 mt-2 rounded hover:bg-blue-300 font-bold hover:text-white">Xác nhận</button>
                        </form>
                    }
                    <div className="border-b-2 border-cyan-400 py-3 flex justify-between">
                        <button onClick={() => navigate(-1)} className="button border-blue-500 hover:bg-blue-500 hover:text-white">Trở về</button>
                        <h1 className="text-2xl font-bold text-center">Kết quả học tập</h1>
                        {classData.TrangThai == 2 ?
                            <div className="text-xl text-green-400">Đã duyệt</div>
                            : classData.TrangThai == 1 ?
                                <div className="flex items-center space-x-2">
                                    <button className="button border-red-500 hover:bg-red-500 hover:text-white" onClick={() => setShowForm(true)}>Yêu cầu chỉnh sửa</button>
                                    <button className="button border-green-500 hover:bg-green-500 hover:text-white" onClick={() => setShowConfirm(1)}>Duyệt kết quả</button>
                                </div>
                                :
                                <div className="text-xl text-red-400">Chưa báo cáo</div>
                        }
                    </div>
                    <div className="mt-2 grid gird-rows-1 grid-flow-col">
                        <button className={view == 1 ? "class-info-head-active border-x-2 rounded-s-md" : "class-info-head border-x-2 rounded-s-md"} onClick={firstView}>Danh sách lớp</button>
                        <button className={view == 2 ? "class-info-head-active border-x-2" : "class-info-head border-x-2"} onClick={secondView}>Điểm chi tiết</button>
                        <button className={view == 3 ? "class-info-head-active border-x-2" : "class-info-head border-x-2"} onClick={thirdView}>Kết quả học tập</button>
                        <button className={view == 4 ? "class-info-head-active border-x-2" : "class-info-head border-x-2"} onClick={fourthView}>Kết quả rèn luyện</button>
                        <button className={view == 5 ? "class-info-head-active border-x-2" : "class-info-head border-x-2"} onClick={fiftthView}>Xét lên lớp</button>
                        <button className={view == 6 ? "class-info-head-active border-x-2 rounded-e-md" : "class-info-head border-x-2 rounded-e-md"} onClick={sixthView}>Khen Thưởng</button>
                    </div>
                    <div className="flex justify-between px-2 text-2xl my-3">
                        <p><strong>Mã lớp:</strong> {classData.MaLop}</p>
                        <p><strong>Tên lớp:</strong> {classData.TenLop}</p>
                        <p><strong>Sỉ số:</strong> {classData.hoc_sinh.length}</p>
                        <p><strong>Chủ nhiệm:</strong> {classData.giao_vien.TenGV}</p>
                    </div>
                    {view == 1 &&
                        <div className="mt-3">
                            <HocSinhTable datas={classData.hoc_sinh} />
                        </div>
                    }
                    {view == 2 &&
                        <div className="space-y-5">
                            {subjects.map((mh) => (
                                <div key={mh.MaMH} className="my-2">
                                    <h3 className="text-2xl font-bold text-center">Tên môn: {mh.TenMH}</h3>
                                    <BangDiem
                                        hocSinh={classData?.hoc_sinh}
                                        loaiDiem={loaiDiem.filter(item => ['tx', 'gk', 'ck'].includes(item.MaLoai))}
                                        diemHK1={diemHK1.filter(item => item.MaMH === mh.MaMH)}
                                        diemHK2={diemHK2.filter(item => item.MaMH === mh.MaMH)}
                                    />
                                </div>
                            ))}
                        </div>
                    }
                    {view == 3 &&
                        <div className="mt-3">
                            <table className="table-auto text-center ">
                                <thead>
                                    <tr className='bg-slate-400'>
                                        <th className="border border-black py-3 px-2">Mã số học sinh</th>
                                        <th className="border border-black py-3 px-2">Tên học sinh</th>
                                        <th className="border border-black py-3 px-2">Điểm trung bình HK1</th>
                                        <th className="border border-black py-3 px-2">Xếp loại HK1</th>
                                        <th className="border border-black py-3 px-2">Điểm trung bình HK2</th>
                                        <th className="border border-black py-3 px-2">Xếp loại HK2</th>
                                        <th className="border border-black py-3 px-2">Điểm trung bình cả năm</th>
                                        <th className="border border-black py-3 px-2">Xếp loại cả năm</th>
                                        <th className="border border-black py-3 px-2">Xếp loại sau rèn luyện hè</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classData.hoc_sinh.map((hs, index) => {
                                        const data = kqht.find((diem) => diem.MSHS == hs.MSHS);
                                        return (
                                            <tr key={hs.MSHS} className={`${index % 2 == 0 && "bg-slate-200"}`}>
                                                <td className="border border-black py-3 px-2">{hs.MSHS}</td>
                                                <td className="border border-black py-3 px-2 text-left">{hs.HoTen}</td>
                                                <td className="border border-black py-3 px-2">{data?.Diem_TB_HKI || "-"}</td>
                                                <td className="border border-black py-3 px-2">{data?.hoc_luc_h_k1.TenHL}</td>
                                                <td className="border border-black py-3 px-2">{data?.Diem_TB_HKII || "-"}</td>
                                                <td className="border border-black py-3 px-2">{data?.hoc_luc_h_k2.TenHL}</td>
                                                <td className="border border-black py-3 px-2">{data?.Diem_TB_CN || "-"}</td>
                                                <td className="border border-black py-3 px-2">{data?.hoc_luc.TenHL}</td>
                                                <td className="border border-black py-3 px-2">{data?.MaHLL > 0 ? data.hoc_luc_lai.TenHL : "-"}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    }
                    {view == 4 &&
                        <div className="mt-3">
                            <table className="table-fixed text-center w-full">
                                <thead>
                                    <tr className='bg-slate-400'>
                                        <th className="border border-black py-3 px-2">Mã số học sinh</th>
                                        <th className="border border-black py-3 px-2">Tên học sinh</th>
                                        <th className="border border-black py-3 px-2">Rèn luyện HK1</th>
                                        <th className="border border-black py-3 px-2">Rèn luyện HK2</th>
                                        <th className="border border-black py-3 px-2">Rèn luyện cả năm</th>
                                        <th className="border border-black py-3 px-2">Rèn luyện lại trong hè</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classData.hoc_sinh.map((hs, index) => {
                                        const data = kqht?.find((diem) => diem.MSHS == hs.MSHS);
                                        if (data) {
                                            return (
                                                <tr key={hs.MSHS} className={`${index % 2 == 0 && "bg-slate-200"}`}>
                                                    <td className="border border-black py-3 px-2">{hs.MSHS}</td>
                                                    <td className="border border-black py-3 px-2 text-left">{hs.HoTen}</td>
                                                    <td className="border border-black py-3 px-2">{data.ren_luyen_h_k1.TenRL}</td>
                                                    <td className="border border-black py-3 px-2">{data.ren_luyen_h_k2.TenRL}</td>
                                                    <td className="border border-black py-3 px-2">{data.ren_luyen.TenRL}</td>
                                                    <td className="border border-black py-3 px-2">{data.MaRLL > 0 ? data.ren_luyen_lai.TenRL : "-"}</td>
                                                </tr>
                                            )
                                        }
                                    })}
                                </tbody>
                            </table>
                        </div>
                    }
                    {view == 5 &&
                        <div className="w-full mt-3">
                            <table className="table-auto text-center w-full">
                                <thead>
                                    <tr className='bg-slate-400'>
                                        <th className="border border-black py-3 px-2">Mã số học sinh</th>
                                        <th className="border border-black py-3 px-2">Tên học sinh</th>
                                        <th className="border border-black py-3 px-2">Xếp loại cả năm</th>
                                        <th className="border border-black py-3 px-2">Rèn luyện hè</th>
                                        <th className="border border-black py-3 px-2">Rèn luyện cả năm</th>
                                        <th className="border border-black py-3 px-2">Rèn luyện hè</th>
                                        <th className="border border-black py-3 px-2">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classData.hoc_sinh.map((hs, index) => {
                                        const data = kqht?.find((diem) => diem.MSHS == hs.MSHS);
                                        if (data) {
                                            return (
                                                <tr key={hs.MSHS} className={`${index % 2 == 0 && "bg-slate-200"}`}>
                                                    <td className="border border-black py-3 px-2">{hs.MSHS}</td>
                                                    <td className="border border-black py-3 px-2 text-left">{hs.HoTen}</td>
                                                    <td className="border border-black py-3 px-2">{data.hoc_luc.TenHL}</td>
                                                    <td className="border border-black py-3 px-2">{data.MaHLL > 0 ? data.hoc_luc_lai.TenHL : "-"}</td>
                                                    <td className="border border-black py-3 px-2">{data.ren_luyen.TenRL}</td>
                                                    <td className="border border-black py-3 px-2">{data.MaRLL > 0 ? data.ren_luyen_lai.TenRL : "-"}</td>
                                                    <td className="border border-black py-3 px-2">{data.trang_thai.TenTT}</td>
                                                </tr>
                                            )
                                        }
                                    })}
                                </tbody>
                            </table>
                        </div>
                    }
                    {view == 6 &&
                        <div className="mt-10">
                            {dsKhenThuong.length > 0 ?
                                <table className="table w-full text-xl">
                                    <thead>
                                        <tr>
                                            <th className="border border-black py-3 px-2">Mã số học sinh</th>
                                            <th className="border border-black py-3 px-2">Tên học sinh</th>
                                            <th className="border border-black py-3 px-2">Đề xuất khen thưởng</th>
                                            <th className="border border-black py-3 px-2">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dsKhenThuong?.map((item) => (
                                            <tr key={item.MSHS}>
                                                <td className="border border-black py-3 px-2">{item.MSHS}</td>
                                                <td className="border border-black py-3 px-2">{item.hoc_sinh[0].HoTen}</td>
                                                <td className="border border-black py-3 px-2">{item.KhenThuong}</td>
                                                {item.TrangThai == 0 ?
                                                    <td className="border border-black px-2 py-3 text-center text-red-500">Chưa duyệt</td>
                                                    :
                                                    <td className="border border-black px-2 py-3 text-center text-green-500">Đã duyệt</td>
                                                }
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                :
                                <div className="text-center text-2xl text-red-500 mt-10">Không có đề xuất khen thưởng</div>
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
