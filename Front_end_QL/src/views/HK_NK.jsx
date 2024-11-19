import axiosClient from "../axios-client"
import React, { useEffect, useRef, useState } from 'react';
import { useStateContext } from "../context/Context";
import Menu from "../components/Menu";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
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
    const { userName } = useUserContext();
    useEffect(() => {
        if (userName != "admin") {
            setError("Bạn không có quyền truy cập trang này");
            navigate('/');
        }
    }, [userName]);
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
        if (nienKhoaHienTaiRef.current.value === nienKhoa.NienKhoa) {
            setIsShow(0);
        } else {
            const payload = {
                NienKhoa: nienKhoaHienTaiRef.current.value,
                TenNK: datas.find((item) => item.MaNK === nienKhoaHienTaiRef.current.value).TenNK
            };
            try {
                const response = await axiosClient.post('/nk/setNow', payload);
                setMessage(response.data);
                fetchData();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setIsShow(0);
        }
    }
    const submitNgayBD = async (event) => {
        event.preventDefault();
        const payload = {
            NgayBD: NgayBDRef.current.value,
        }
        try {
            const response = await axiosClient.post('/nk/setNow', payload);
            setMessage(response.data);
            fetchData();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setIsShow(0);
    }
    const submitHSD = async (event) => {
        event.preventDefault();
        const payload = {
            HanSuaDiem: HanSuaDiemRef.current.value,
        }
        try {
            const response = await axiosClient.post('/nk/setNow', payload);
            setMessage(response.data);
            fetchData();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setIsShow(0);
    }
    const setShow = (id) => {
        setIsShow(id);
    }
    return (
        <div>
            <Header />
            <div className="main-content">
                <Menu />
                <div className='right-part'>
                    <h2 className="page-name">Học kì - Niên khóa</h2>
                    {/* {isShow === 2 &&
                        <form className="mt-2">
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
                    } */}
                    <div className="hk_nk_content">
                        <div className="grid grid-flow-row grid-cols-3 gap-3 mt-3">
                            <div
                                onClick={isShow !== 2 ? () => setShow(2) : undefined}
                                className="w-full border-2 border-red-500 rounded min-h-32 relative flex items-center bg-red-300 hover:bg-red-400 shadow-lg hover:scale-105 cursor-pointer transition duration-300 ease-in-out transform"
                            >
                                <p className="absolute top-2 left-2 text-xl font-bold">Năm học hiện tại hiện tại:</p>
                                {isShow == 2 ?
                                    <form onSubmit={submitNKHientai} className="w-full flex items-center mx-10 justify-between">
                                        <p className="absolute top-0 border border-transparent hover:border-white px-1 right-0  font-bold text-white" onClick={() => setIsShow(0)}>X</p>
                                        <select ref={nienKhoaHienTaiRef} defaultValue={nienKhoa.NienKhoa} name="nienkhoahientai" required
                                            className="text-2xl font-mono bg-transparent border-b-2 border-white outline-none cursor-pointer"
                                        >
                                            {datas.map((item) => (
                                                <option key={item.MaNK} value={item.MaNK}>{item.TenNK}</option>
                                            ))}
                                        </select>
                                        <button type="submit" className="border px-2 py-1 rounded hover:bg-white">Lưu</button>
                                    </form>
                                    :
                                    <p className="text-2xl text-slate-700 font-mono ms-10">{nienKhoa ? `${nienKhoa.TenNK}` : "Chưa đặt"}</p>
                                }
                            </div>
                            <div
                                onClick={isShow !== 3 ? () => setShow(3) : undefined}
                                className="w-full border-2 border-blue-500 rounded min-h-32 relative flex items-center bg-blue-300 hover:bg-blue-400 shadow-lg hover:scale-105 cursor-pointer transition duration-300 ease-in-out transform"
                            >
                                <p className="absolute top-2 left-2 text-xl font-bold">Ngày bắt đầu năm học: </p>
                                {isShow == 3 ?
                                    <form onSubmit={submitNgayBD} className="w-full mt-7">
                                        <p className="absolute top-0 border border-transparent hover:border-white px-1 right-0  font-bold text-white" onClick={() => setIsShow(0)}>X</p>
                                        <input type="datetime-local" name="startDate" className="font-mono outline-none w-[90%] mx-auto block" defaultValue={nienKhoa.NgayBD} ref={NgayBDRef} />
                                        <button type="submit" className="border px-2 py-1 rounded hover:bg-white mt-2 w-1/2 mx-auto block">Lưu</button>
                                    </form>
                                    :
                                    <p className="text-2xl text-slate-700 font-mono ms-10">{nienKhoa.NgayBD ? nienKhoa.NgayBD : "Chưa đặt"}</p>
                                }
                            </div>
                            <div
                                onClick={isShow !== 4 ? () => setShow(4) : undefined}
                                className="w-full border-2 border-green-500 rounded min-h-32 relative flex items-center bg-green-300 hover:bg-green-400 shadow-lg hover:scale-105 cursor-pointer transition duration-300 ease-in-out transform"
                            >
                                <p className="absolute top-2 left-2 text-xl font-bold">Hạn cuối sửa điểm:</p>
                                {isShow == 4 ?
                                    <form onSubmit={submitHSD} className="w-full mt-7">
                                        <p className="absolute top-0 border border-transparent hover:border-white px-1 right-0  font-bold text-white" onClick={() => setIsShow(0)}>X</p>
                                        <input type="datetime-local" name="endDate" defaultValue={nienKhoa.HanSuaDiem} className="font-mono outline-none w-[90%] mx-auto block" ref={HanSuaDiemRef} />
                                        <button type="submit" className="border px-2 py-1 rounded hover:bg-white mt-2 w-1/2 mx-auto block">Lưu</button>
                                    </form>
                                    :
                                    <p className="text-2xl text-slate-700 font-mono ms-10">{nienKhoa.HanSuaDiem ? nienKhoa.HanSuaDiem : "Chưa đặt"}</p>
                                }
                            </div>
                        </div>
                        <div className="w-[80%] mx-auto mt-3">
                            <div className="w-1/2 mx-auto flex justify-between mb-2">
                                <h2 className="text-2xl text-center mt-2 font-semibold">Danh sách niên khóa</h2>
                                <button onClick={() => showForm(1)} className="px-2 py-1 rounded-full text-blue-500  mt-2 hover:bg-blue-500 hover:text-white border-blue-500 border-2"><FontAwesomeIcon icon={faPlus} /></button>
                            </div>
                            {isShow === 1 &&
                                <form onSubmit={submit} className="w-1/2 mx-auto border-2 p-2 my-2 border-slate-500 shadow-md rounded ">
                                    <div className="w-3/4 mx-auto">
                                        <input ref={MaNKRef} className="w-full border-t-0 border-x-0 border-b border-slate-300 p-2 outline-none rounded-none" type="text" placeholder="Mã niên khóa" />
                                    </div>
                                    <div className="w-3/4 mx-auto">
                                        <input ref={TenNKRef} className="w-full border-t-0 border-x-0 border-b border-slate-300 p-2 outline-none rounded-none" type="text" placeholder="Tên niên khóa" />
                                    </div>
                                    <div className="w-3/4 mx-auto flex items-center justify-between mt-3">
                                        <div>
                                            <label htmlFor="add" className="">Niên khóa hiện tại</label>
                                            <input type="checkbox" className="ms-2" name="add" checked={isChecked} onChange={handleCheckboxChange} />
                                        </div>
                                        <button className="border px-3 py-1 ms-2 hover:text-white border-green-600 rounded hover:bg-green-600 text-slate-950">Lưu</button>
                                    </div>
                                </form>
                            }
                            <table className="table-auto border-collapse border border-slate-500 w-1/2 mx-auto">
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
            </div>
        </div>
    )
}