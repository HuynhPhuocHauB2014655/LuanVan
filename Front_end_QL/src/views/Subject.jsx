import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/Context";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Menu from "../components/Menu";
export default function Subject() {
    const [datas, setDatas] = useState([]);
    const [showForm, setShowForm] = useState(0);
    const [subjectForm, setSubjectForm] = useState({});
    const { setMessage } = useStateContext();
    const fetchData = async () => {
        const response = await axiosClient.get("/mh/index");
        setDatas(response.data);
    };
    useEffect(() => {
        fetchData();
    }, []);
    const validationSchema = Yup.object({
        MaMH: Yup.string().required('Mã môn học không được bỏ trống'),
        TenMH: Yup.string().required('Tên môn học không được bỏ trống'),
    });
    const handleSubmit = async (value) => {
        if (showForm === 1) {
            try {
                const response = await axiosClient.post("/mh/create", value);
                setMessage("Đã thêm thành công");
                setShowForm(0);
                fetchData();
            } catch (error) {
                setMessage(error.response.data.message);
            }
        } else {
            try {
                const response = await axiosClient.put("/mh/update/" + value.MaMH, value);
                setMessage("Đã sửa thành công");
                setShowForm(0);
                fetchData();
            } catch (error) {
                setMessage(error.response.data.message);
            }
        }
    }
    const deleteSubject = async (maMH) => {
        try {
            const response = await axiosClient.delete("/mh/delete/" + maMH);
            setMessage("Đã xóa thành công");
            fetchData();
        } catch (error) {
            setMessage(error.response.data.message);
        }
    }
    const showFormSubject = (isShow, data) => {
        if (data) {
            setSubjectForm({
                MaMH: data.MaMH,
                TenMH: data.TenMH
            });
        }
        setShowForm(isShow);
    }
    return (
        <div className="main-content relative">
            <Menu />
            <div className="right-part">
                <h2 className="page-name">Quản lí Môn học</h2>
                <div>
                    <button className="px-2 mt-2 border-2 border-blue-400 rounded bg-white hover:bg-blue-400 button-animation" onClick={() => showFormSubject(1)}>Thêm môn học</button>
                </div>
                <table className="w-1/2 table">
                    <thead>
                        <tr>
                            <th className="td">Mã môn học</th>
                            <th className="td">Tên môn học</th>
                            <th className="td">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datas && datas.map((data, index) => (
                            <tr key={index}>
                                <td className="td">{data.MaMH}</td>
                                <td className="td">{data.TenMH}</td>
                                <td className="td">
                                    <div className="flex justify-center">
                                        <button className="px-2 py-1 border rounded bg-white border-black hover:border-sky-500" onClick={() => showFormSubject(2, data)}>Sửa</button>
                                        <button type="button" className="ms-1 px-2 py-1 border rounded bg-white border-black hover:border-red-500" onClick={() => deleteSubject(data.MaMH)}>
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {showForm != 0 &&
                    <div className="absolute z-10 left-1/3 top-1/3 w-1/3 bg-sky-300 p-5">
                        <button className="absolute top-0 right-0 me-2 text-red-700 border px-2 mt-2 hover:border-red-600 font-bold" onClick={() => showFormSubject(0)}>X</button>
                        <h1 className="text-center mb-3 text-2xl font-semibold">Thêm môn học</h1>
                        <Formik
                            initialValues={{
                                MaMH: '',
                                TenMH: '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize={true}
                        >
                            {({ setValues }) => {
                                useEffect(() => {
                                    if (Object.keys(subjectForm).length > 0) {
                                        setValues(subjectForm);
                                    }
                                }, [subjectForm, setValues]);
                                return (
                                    <Form className="relative">
                                        <div className="">
                                            {showForm === 1 &&
                                                <div>
                                                    <Field type="text" name="MaMH" className="w-full mb-1 rounded form-input" placeholder="Mã môn học" />
                                                    <ErrorMessage className="text-red-600" name="MaMH" component="div" />
                                                </div>}

                                            <Field type="text" name="TenMH" className="w-full rounded form-input" placeholder="Tên môn học" />
                                            <ErrorMessage className="text-red-600" name="TenMH" component="div" />
                                        </div>

                                        {showForm === 1 ?
                                            <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                                                Thêm
                                            </button> :
                                            <div className="flex justify-between">
                                                <button type="submit" className="mt-2 px-4 py-2 bg-cyan-500 text-white rounded">
                                                    Sửa
                                                </button>
                                            </div>
                                        }
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>}
            </div>
        </div>
    );
}