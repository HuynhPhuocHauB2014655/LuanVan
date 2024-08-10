import axiosClient from "../axios-client";
import React, { useEffect, useState } from 'react';
import { useStateContext } from "../context/Context";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
export default function TKB() {
    const [classes, setClasses] = useState([]);
    const [subjectTN, setSubjectTN] = useState([]);
    const [subjectXH, setSubjectXH] = useState([]);
    const [tkb, settkb] = useState([]);
    const [date, setdate] = useState([]);
    const [show, setShow] = useState('');
    const { setMessage } = useStateContext();
    const { nienKhoa } = useStateContext(false);
    const [disable, setDisable] = useState(true);
    const [state, setState] = useState(0);
    const [TKB, setTKB] = useState([]);
    const [schedule, setSchedule] = useState(
        Array.from({ length: 6 }, () => Array(4).fill(null))
    );
    const fetchData = async () => {
        try {
            const classes = await axiosClient.get('lop/list/withoutTkb');
            setClasses(classes.data);
            const monHocXH = await axiosClient.get('mh/xh');
            setSubjectXH(monHocXH.data);
            const monHocTN = await axiosClient.get('mh/tn');
            setSubjectTN(monHocTN.data);
            const dates = await axiosClient.get(`tkb/date`);
            setdate(dates.data);
        } catch (error) {
            console.log(error);
        }
        // convertTKB(tkb[0]);
    }
    useEffect(() => {
        console.log(tkb);
    }, [tkb])
    useEffect(() => {
        fetchData();
    }, []);
    const fetchTKB = async () => {
        const tkbs = await axiosClient.get(`lop/index/tkb/${nienKhoa.NienKhoa}`);
        
        const newTKB = tkbs.data.map(data => {
            const tkbMatrix = Array(6).fill(null).map(() => Array(4).fill(null));
    
            data.tkb.forEach(schedule => {
                const dayIndex = schedule.MaNgay - 2;
                const periodIndex = schedule.TietDay - 1;
    
                tkbMatrix[periodIndex][dayIndex] = {
                    TenMon : schedule.mon_hoc.TenMH,
                    TenGV : schedule.giao_vien.TenGV
                };
            });
            tkbMatrix[0][0] = {
                TenMon : 'Chào cờ',
                TenGV : 'Chào cờ'
            }
            return {...data, tkbMatrix};
        });
    
        settkb(newTKB);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        try {
            if (data.MaLop.substring(0, 2) === "TN") {
                subjectTN.map(function (mh) {
                    const payload = {
                        MaLop: data.MaLop,
                        MSGV: data[mh.MaMH],
                        MaMH: mh.MaMH
                    }
                    axiosClient.post('tkb/createPC', payload);
                    fetchData();
                })
            }
            if (data.MaLop.substring(0, 2) === "XH") {
                subjectXH.map(function (mh) {
                    const payload = {
                        MaLop: data.MaLop,
                        MSGV: data[mh.MaMH],
                        MaMH: mh.MaMH
                    }
                    axiosClient.post('tkb/createPC', payload);
                    fetchData();
                })
            }
            setMessage("Tạo mới thành công");
        }
        catch (error) {
            console.log(error);
            setMessage("Có lỗi trong quá trình cập nhật phân công");
        }
    }
    const createTKB = async () => {
        try {
            await axiosClient.post(`/tkb/create/${nienKhoa.NienKhoa}`);
            setMessage("Tạo mới thành công");
        } catch (error) {
            console.log(error);
        }
        fetchData();
    }
    const showForm = (id) => {
        if (show == id) {
            setShow('');
        } else {
            setShow(id);
        }
    }
    useEffect(() => {
        setDisable(false);
        classes.map((data) => {
            if (data.phan_cong.length == 0) {
                setDisable(true);
            };
        })
    }, [classes]);
    const _setState = (state) => {
        if (state == 1) {
            fetchTKB();
        }
        setState(state);
    }
    return (
        <div className="main-content">
            <div className="flex my-2">
                <button className="button border-slate-400 hover:border-cyan-500 hover:bg-cyan-200" onClick={() => _setState(2)}>Xếp TKB</button>
                <button className="button border-slate-400 hover:border-cyan-500 hover:bg-cyan-200" onClick={() => _setState(1)}>Danh sách TKB</button>
            </div>
            {state === 1 &&
                <div className="">
                    {tkb.map((data) => (
                        <div key={data.MaLop} className="">
                            <h1 >Lớp: {data.TenLop} - Niên khóa: {data.nien_khoa.TenNK}</h1>
                            <table className="border-2 border-black border-collapse">
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
                                            <td className="td">{i + 1}</td>
                                            {[...Array(6)].map((_, j) => (
                                                <td className="td" key={j + 1}>
                                                    {data.tkbMatrix[j][i] ? data.tkbMatrix[j][i].TenMon : 'N/A'} <br/>
                                                    {data.tkbMatrix[j][i] ? data.tkbMatrix[j][i].TenGV : 'N/A'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            }
            {state == 2 &&
                <div>
                    {classes.length > 0 ?
                        <div>
                            <h1 className="text-2xl my-2 font-semibold text-center">Lớp chưa xếp Thời khóa biểu</h1>
                            {classes.map((data, index) => (
                                <div key={index} className="border-2 p-3 mb-1">
                                    <div className="text-xl mb-2">Tên lớp: {data.TenLop} - Niên khóa: {data.nien_khoa.TenNK}</div>
                                    {data.phan_cong.length > 0 ?
                                        <div className="columns-2 w-[70%]">
                                            {data.phan_cong.map((pc) => (
                                                <div className="text-lg" key={pc.MaMH}>{pc.mon_hoc.TenMH}: {pc.giao_vien.TenGV}</div>
                                            ))}
                                        </div>
                                        :
                                        <div>
                                            <button className="text-red-500 border-2 border-slate-500 px-2 py-1 my-1 rounded" onClick={() => showForm(data.MaLop)}>Phân công dạy học</button>
                                            {show === data.MaLop &&
                                                <form onSubmit={handleSubmit} className="">
                                                    <div className="columns-5 ">
                                                        <input type="hidden" name="MaLop" value={data.MaLop} />
                                                        {data.MaLop.substring(0, 2) == "TN" ?
                                                            <div>
                                                                {subjectTN.map((tn) => (
                                                                    <div key={tn.MaMH} className="mb-1 ms-1">
                                                                        <select name={tn.MaMH} required className="w-36">
                                                                            <option value="" defaultChecked>{tn.TenMH}</option>
                                                                            {tn.giao_vien.map((gvtn) => (
                                                                                <option key={gvtn.MSGV} value={gvtn.MSGV}>{gvtn.TenGV}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            :
                                                            <div>
                                                                {subjectXH.map((xh) => (
                                                                    <div key={xh.MaMH} className="mb-1 ms-1">
                                                                        <select name={xh.MaMH} required className="w-36">
                                                                            <option value="" defaultValue={xh.TenMH} >{xh.TenMH}</option>
                                                                            {xh.giao_vien.map((gvxh) => (
                                                                                <option key={gvxh.MSGV} value={gvxh.MSGV}>{gvxh.TenGV}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        }
                                                    </div>
                                                    <button className="px-2 py-1 border-2 rounded border-blue-500 ms-1 mt-1 hover:bg-blue-300" type="submit">Xác nhận</button>
                                                </form>}
                                        </div>
                                    }
                                </div>
                            ))}
                            <div>
                                <button
                                    className="text-red-500 border-2 border-slate-500 px-2 py-1 rounded my-2 hover:bg-slate-300"
                                    onClick={createTKB}
                                    disabled={disable}
                                >
                                    Xếp TKB
                                </button>
                            </div>

                        </div>
                        :
                        <div className="mt-20 text-center  text-green-500 text-5xl">
                            Không có lớp cần xếp TKB
                        </div>
                    }
                </div>
            }
        </div>
    )
}