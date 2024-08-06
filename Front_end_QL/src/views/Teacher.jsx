import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/alterContext";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
export default function Teacher() {
    const [teachersData, setTeachersData] = useState([]);
    const [subjectsData,setSubjectsData] = useState([]);
    const [showForm, setShowForm] = useState(0);
    const [teacherForm, setTeacherForm] = useState({});
    const { setMessage } = useStateContext();
    const fetchData = async () => {
        const teachers = await axiosClient.get("/gv/index");
        setTeachersData(teachers.data);
        const subjects = await axiosClient.get("/mh/index");
        setSubjectsData(subjects.data);
    };
    useEffect(() => {
        fetchData();
    }, []);
    const validationSchema = Yup.object({
        TenGV: Yup.string().required('Tên giáo viên không được bỏ trống'),
        NgaySinh: Yup.string().required('Ngày sinh không được bỏ trống'),
        GioiTinh: Yup.string().required('Giới tính không được bỏ trống'),
        DiaChi: Yup.string().required('Địa chỉ không được bỏ trống'),
        SDT: Yup.string().required('Số điện thoại không được bỏ trống'),
        ChuyenMon: Yup.string().required('Chuyên môn không được để trống'),
    });
    const handleSubmit = async (value) => {
        if (showForm == 1) {
            
            if(teachersData.length == 0)
            {
                value.MSGV = "GV001";
            }
            else{
                const lastGV = await axiosClient.get("/gv/last");
                value.MSGV = "GV" + (parseInt(lastGV.substring(2,5),10)+1).toString().padStart(3,0);
            }
            try {
                const response = await axiosClient.post("/gv/create", value);
                setMessage("Đã thêm thành công");
                setShowForm(0);
                fetchData();
            } catch (error) {
                setMessage(error.response.data.message);
            }
        } else {
            try {
                const response = await axiosClient.put("/gv/update/" + teacherForm.MSGV, value);
                setMessage("Đã sửa thành công");
                setShowForm(0);
                fetchData();
            } catch (error) {
                setMessage(error.response.data.message);
            }
        }
    }
    const deleteTeacher = async (MSGV) => {
        try {
            const response = await axiosClient.delete("/gv/delete/" + MSGV);
            setMessage("Đã xóa thành công");
            fetchData();
        } catch (error) {
            setMessage(error.response.data.message);
        }
    }
    const showFormTeacher = (isShow, data) => {
        if(data){
            setTeacherForm({
                MSGV:data.MSGV,
                TenGV:data.TenGV,
                NgaySinh:data.NgaySinh,
                GioiTinh:data.GioiTinh,
                DiaChi:data.DiaChi,
                SDT:data.SDT,
                ChuyenMon:data.ChuyenMon,
            })
        }else{
            setTeacherForm({});
        }
        setShowForm(isShow);
    }
    return (
        <div className="main-content relative">
            <h2 className="text-2xl font-bold text-center border-b-2 border-cyan-400 py-3">Quản lí Giáo Viên</h2>
            <div>
                <button className="px-2 mt-2 border-2 border-blue-400 rounded bg-white hover:bg-blue-400" onClick={() => showFormTeacher(1)}>Thêm giáo viên</button>
            </div>
            <table className="w-2/3 border-collapse mt-2">
                <thead>
                    <tr>
                        <th className="border border-gray-400 p-2">Mã số giáo viên</th>
                        <th className="border border-gray-400 p-2">Tên giáo viên</th>
                        <th className="border border-gray-400 p-2">Ngày sinh</th>
                        <th className="border border-gray-400 p-2">Giới tính</th>
                        <th className="border border-gray-400 p-2">Địa chỉ</th>
                        <th className="border border-gray-400 p-2">Số điện thoại</th>
                        <th className="border border-gray-400 p-2">Chuyên môn</th>
                        <th className="border border-gray-400 p-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {teachersData && teachersData.map((data, index) => (
                        <tr key={index}>
                            <td className="border border-gray-400 p-2">{data.MSGV}</td>
                            <td className="border border-gray-400 p-2">{data.TenGV}</td>
                            <td className="border border-gray-400 p-2">{data.NgaySinh}</td>
                            <td className="border border-gray-400 p-2">{data.GioiTinh}</td>
                            <td className="border border-gray-400 p-2">{data.DiaChi}</td>
                            <td className="border border-gray-400 p-2">{data.SDT}</td>
                            <td className="border border-gray-400 p-2">{data.mon_hoc.TenMH}</td>
                            <td className="border border-gray-400 p-2">
                                <div className="flex justify-center">
                                    <button className="px-2 py-1 border rounded bg-white border-black hover:border-sky-500" onClick={() => showFormTeacher(2, data)}>Sửa</button>
                                    <button type="button" className="ms-1 px-2 py-1 border rounded bg-white border-black hover:border-red-500" onClick={() => deleteTeacher(data.MSGV)}>
                                        Xóa
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showForm != 0 &&
                <div className="absolute z-10 left-[25%] top-1/3 w-[50%] bg-sky-300 p-5">
                    <button className="absolute top-0 right-0 me-2 text-red-700 border px-2 mt-2 hover:border-red-600 font-bold" onClick={() => showFormTeacher(0)}>X</button>
                    <h1 className="text-center mb-3 text-2xl font-semibold">Thêm giáo viên</h1>
                    <Formik
                        initialValues={{
                            TenGV: "",
                            NgaySinh: "",
                            GioiTinh: "",
                            DiaChi: "",
                            SDT: "",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize={true}
                    >
                        {({ setValues }) => {
                            useEffect(() => {
                                if (Object.keys(teacherForm).length > 0) {
                                    setValues(teacherForm);
                                }
                            }, [teacherForm, setValues]);
                            return (
                                <Form className="relative">
                                    <div className="columns-2">
                                        <Field type="text" name="TenGV" className="w-full mb-1 rounded form-input" placeholder="Tên giáo viên" />
                                        <ErrorMessage className="text-red-600" name="TenGV" component="div" />

                                        <Field type="text" name="NgaySinh" className="w-full mb-1 rounded form-input" placeholder="Ngày sinh" />
                                        <ErrorMessage className="text-red-600" name="NgaySinh" component="div" />

                                        <Field type="text" name="GioiTinh" className="w-full mb-1 rounded form-input" placeholder="Giới tính" />
                                        <ErrorMessage className="text-red-600" name="GioiTinh" component="div" />

                                        <Field type="text" name="DiaChi" className="w-full mb-1 rounded form-input" placeholder="Địa chỉ" />
                                        <ErrorMessage className="text-red-600" name="DiaChi" component="div" />

                                        <Field type="text" name="SDT" className="w-full mb-1 rounded form-input" placeholder="Số điện thoại" />
                                        <ErrorMessage className="text-red-600" name="SDT" component="div" />

                                        <Field as="select" name="ChuyenMon" className="form-select w-full">
                                            <option disabled defaultChecked>Chọn chuyên môn</option>
                                            {subjectsData.map((subject) => (
                                                <option key={subject.MaMH} value={subject.MaMH}>{subject.TenMH}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage className="text-red-600" name="ChuyenMon" component="div" />
                                    </div>

                                    {showForm === 1 ?
                                        <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                                            Thêm
                                        </button> :
                                        <button type="submit" className="mt-2 px-4 py-2 bg-cyan-500 text-white rounded">
                                            Sửa
                                        </button>
                                    }
                                </Form>
                            );
                        }}
                    </Formik>
                </div>}
        </div>
    );
}