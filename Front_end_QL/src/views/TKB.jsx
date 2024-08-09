import axiosClient from "../axios-client";
import React, { useEffect, useState } from 'react';
import { useStateContext } from "../context/Context";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
export default function TKB() {
    const [classes, setClasses] = useState([]);
    const [subjectTN, setSubjectTN] = useState([]);
    const [subjectXH, setSubjectXH] = useState([]);
    const [show, setShow] = useState('');
    const { setMessage } = useStateContext();


    const fetchData = async () => {
        const classes = await axiosClient.get('lop/list/withoutTkb');
        setClasses(classes.data);
        const monHocXH = await axiosClient.get('mh/xh');
        setSubjectXH(monHocXH.data);
        const monHocTN = await axiosClient.get('mh/tn');
        setSubjectTN(monHocTN.data);
    }
    useEffect(() => {
        fetchData();
    }, []);
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
    const showForm = (id) => {
        if (show == id) {
            setShow('');
        } else {
            setShow(id);
        }
    }
    return (
        <div className="main-content">
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
            </div>
            <div>
                <button className="text-red-500 border-2 border-slate-500 px-2 py-1 rounded my-2 hover:bg-slate-300">
                    Xếp TKB
                </button>
            </div>
        </div>
    )
}