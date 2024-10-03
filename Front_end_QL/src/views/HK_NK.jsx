import axiosClient from "../axios-client"
import React, { useEffect, useRef, useState } from 'react';
import { useStateContext } from "../context/Context";
import Menu from "../components/Menu";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";
export default function HK_NK() {
    const { message, setMessage, setError } = useStateContext();
    const { nienKhoa, setNienKhoa } = useStateContext();
    const [isShow, setIsShow] = useState(0);
    const [datas, setDatas] = useState([]);
    const MaNKRef = useRef();
    const TenNKRef = useRef();
    const NgayBDRef = useRef();
    const HanSuaDiemRef = useRef();
    const nienKhoaHienTaiRef = useRef();
    const navigate = useNavigate();
    const {userName} = useUserContext();
    useEffect(()=>{
        if(userName != "admin"){
            setError("Bạn không có quyền truy cập trang này");
            navigate('/');
        }
    },[userName]);
    const fetchData = async () => {
        try {
            const response = await axiosClient.get('/nk/index');
            setDatas(response.data);
            const NKNow = await axiosClient.get("/nk/getNow");
            setNienKhoa(NKNow.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const showForm = (show) => {
        if (isShow != 0) {
            setIsShow(0);
        } else {
            setIsShow(show);
        }
    };

    const [isChecked, setIsChecked] = useState(false);
    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };
    const submit = async (ev) => {
        ev.preventDefault();
        const payload = {
            MaNK: MaNKRef.current.value,
            TenNK: TenNKRef.current.value,
        };
        //Tao nien khoa
        try {
            axiosClient.post('/nk/create', payload)
                .then(({ nienkhoa }) => {
                    fetchData();
                })
                .catch((err) => {
                    const response = err.response;
                    console.log(response);
                });

            //tao hoc ki cho nien khoa
            for (let index = 1; index <= 2; index++) {
                const hocki = {
                    MaHK: index + payload.MaNK,
                    TenHK: "HK" + index,
                    MaNK: payload.MaNK,
                };
                axiosClient.post('/hk/create', hocki)
                    .then(({ hocki }) => {
                    })
                    .catch((err) => {
                        const response = err.response;
                        console.log(response);
                    });
            }
            if (isChecked) {
                try {
                    const response = await axiosClient.get('/nk/setNow', { params: { "nk": MaNKRef.current.value } });
                    fetchData();
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                setMessage('Tạo mới thành công');
            }
        } catch (err) {
            setMessage('Có lỗi trong quá trình tạo mới');
        }
        fetchData();
        setIsShow(0);
    }
    const submitNKHientai = async (event) => {
        event.preventDefault();
        const MaNK = nienKhoaHienTaiRef.current.value;
        const TenNK = datas.find((item) => item.MaNK === MaNK).TenNK;
        const NgayBD = NgayBDRef.current.value;
        const HanSuaDiem = HanSuaDiemRef.current.value;
        try {
            const response = await axiosClient.get('/nk/setNow', { params: { "nk": MaNK, 'tennk': TenNK, "ngaybd": NgayBD, 'hansuadiem': HanSuaDiem } });
            setMessage(response.data);
            fetchData();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setIsShow(0);
    }
    return (
        <div className="main-content">
            <Menu />
            <div className='right-part'>
                <h2 className="page-name">Học kì - Niên khóa</h2>
                <div className="button-nav">
                    <button onClick={() => showForm(1)} className="px-3 py-1 mt-2 bg-blue-500 text-white button-animation">Thêm niên khóa</button>
                    <button onClick={() => showForm(2)} className="px-3 py-1 mt-2 ms-1 bg-blue-500 text-white button-animation">Đặt niên khóa hiện tại</button>
                </div>
                {isShow === 1 &&
                    <form onSubmit={submit} className="add_nk_form">
                        <div>
                            <input ref={MaNKRef} className="form-input rounded ms-2 mt-2" type="text" placeholder="Mã niên khóa" />
                            <input ref={TenNKRef} className="form-input rounded ms-2 mt-2" type="text" placeholder="Tên niên khóa" />
                        </div>
                        <label htmlFor="add" className="ms-2">Đặt làm niên khóa hiện tại</label>
                        <input type="checkbox" className="ms-2" name="add" checked={isChecked} onChange={handleCheckboxChange} />
                        <button className="border px-3 py-1 ms-3 mt-2 border-green-600 rounded hover:bg-green-600 text-slate-950">Lưu</button>
                    </form>
                }
                {isShow === 2 &&
                    <form onSubmit={submitNKHientai} className="mt-2">
                        <div className="grid grid-cols-3 grid-flow-row space-x-2 w-[80%]">
                            <div>
                                <label className="f-label" htmlFor="nienkhoahientai">Chọn niên khóa</label>
                                <select ref={nienKhoaHienTaiRef} defaultValue={nienKhoa.NienKhoa} name="nienkhoahientai" required className="f-field">
                                    {datas.map((item) => (
                                        <option key={item.MaNK} value={item.MaNK}>{item.TenNK}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="f-label" htmlFor="startDate">Ngày bắt đầu năm học</label>
                                <input type="datetime-local" name="startDate" className="f-field block" defaultValue={nienKhoa.NgayBD} ref={NgayBDRef} />
                            </div>
                            <div>
                                <label className="f-label" htmlFor="endDate">Hạn chỉnh sửa điểm</label>
                                <input type="datetime-local" name="endDate" defaultValue={nienKhoa.HanSuaDiem} className="f-field block" ref={HanSuaDiemRef} />
                            </div>
                        </div>
                        <button type="submit" className="border px-3 mt-3 py-1 border-green-600 rounded bg-white hover:bg-green-600 text-slate-950">Lưu</button>
                    </form>
                }
                <div className="hk_nk_content">
                    <div>
                        <h1 className="text-2xl font-bold text-red-600 mt-2">Năm học hiện tại hiện tại: {nienKhoa ? nienKhoa.NienKhoa : "Chưa đặt"}</h1>
                        <p className="text-xl ms-2">- Ngày bắt đầu năm học: {nienKhoa ? nienKhoa.NgayBD : "Chưa đặt"}</p>
                        <p className="text-xl ms-2">- Hạn cuối sửa điểm: {nienKhoa ? nienKhoa.HanSuaDiem : "Chưa đặt"}</p>
                    </div>
                    <h2 className="text-2xl mt-2 font-semibold">Danh sách niên khóa</h2>
                    <table className="table-auto border-collapse border border-slate-500 ">
                        <thead>
                            <tr>
                                <th className="border border-slate-600 p-2">Mã niên khóa</th>
                                <th className="border border-slate-600 p-2">Tên niên Khóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datas.map((data, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="border border-slate-600 p-2">{data.MaNK}</td>
                                        <td className="border border-slate-600 p-2">{data.TenNK}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}