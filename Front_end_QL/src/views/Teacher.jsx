import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/Context";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import Menu from "../components/Menu";
export default function Teacher() {
    const [teachersData, setTeachersData] = useState([]);
    const [subjectsData, setSubjectsData] = useState([]);
    const [showForm, setShowForm] = useState(0);
    const [teacherForm, setTeacherForm] = useState({});
    const { setMessage } = useStateContext();
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [startPage, setStartPage] = useState(0);
    const [endPage, setEndPage] = useState(0);
    const fetchData = async (page) => {
        const teachers = await axiosClient.get(`/gv/index?page=${page}`);
        setTeachersData(teachers.data.data);
        setTotalPages(teachers.data.last_page);
        totalPages < 5 ? setEndPage(totalPages) : setEndPage(5);
        setCurrentPage(teachers.data.current_page);
        const subjects = await axiosClient.get("/mh/index");
        setSubjectsData(subjects.data);
    };
    useEffect(() => {
        fetchData(1);
        setStartPage(1);
    }, []);
    useEffect(() => {
        if (currentPage > endPage) {
            const newStart = currentPage;
            const newEnd = newStart + 4 > totalPages ? totalPages : currentPage + 4;
            setStartPage(newStart);
            setEndPage(newEnd);
            console.log(newStart, newEnd, startPage, endPage);
        }
        if (currentPage < startPage) {
            const newEnd = currentPage;
            const newStart = currentPage - 4 > 0 ? currentPage - 4 : 1;
            setStartPage(newStart);
            setEndPage(newEnd);
            console.log(newStart, newEnd, startPage, endPage);
        }
    }, [currentPage]);
    useEffect(() => {
        if (startPage !== undefined && endPage !== undefined) {
            const generatedPages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
            setPages(generatedPages);
        }
    }, [endPage]);
    const validationSchema = Yup.object({
        TenGV: Yup.string().required('Tên giáo viên không được bỏ trống'),
        NgaySinh: Yup.string().required('Ngày sinh không được bỏ trống'),
        GioiTinh: Yup.string().required('Giới tính không được bỏ trống'),
        DiaChi: Yup.string().required('Địa chỉ không được bỏ trống'),
        SDT: Yup.string().matches(/^\d{10}$/, 'Số điện thoại phải có 10 chữ số.').required('Số điện thoại không được bỏ trống'),
        ChuyenMon: Yup.string().required('Chuyên môn không được để trống'),
    });
    const handleSubmit = async (value) => {
        if (showForm == 1) {

            if (teachersData.length == 0) {
                value.MSGV = "GV001";
            }
            else {
                const lastGV = await axiosClient.get("/gv/last");
                value.MSGV = "GV" + (parseInt(lastGV.data.substring(2, 5), 10) + 1).toString().padStart(3, 0);
            }
            try {
                const response = await axiosClient.post("/gv/create", value);
                setMessage("Đã thêm thành công");
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
        if (data) {
            setTeacherForm({
                MSGV: data.MSGV,
                TenGV: data.TenGV,
                NgaySinh: data.NgaySinh,
                GioiTinh: data.GioiTinh,
                DiaChi: data.DiaChi,
                SDT: data.SDT,
                ChuyenMon: data.ChuyenMon,
            })
        } else {
            setTeacherForm({});
        }
        setShowForm(isShow);
    }
    const handlePageChange = (page) => {
        fetchData(page);
    }
    return (
        <div className="main-content relative">
            <Menu />
            <div className="right-part">
                <h2 className="page-name">Quản lí Giáo Viên</h2>
                <div>
                    <button className="px-2 mt-2 border-2 border-blue-400 rounded bg-white hover:bg-blue-400" onClick={() => showFormTeacher(1)}>Thêm giáo viên</button>
                </div>
                <div className="my-1 flex justify-center">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="me-1 px-3 py-1 border-2 border-transparent hover:border-black hover:text-white hover:bg-black rounded"
                        disabled={currentPage - 1 === 0}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    {pages.map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            disabled={page === currentPage}
                            className={page === currentPage ?
                                "me-1 px-3 py-1 border-2 border-black bg-slate-200 rounded"
                                : "me-1 px-3 py-1 border-2 border-transparent hover:border-black hover:text-white hover:bg-black rounded"}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="me-1 px-3 py-1 border-2 border-transparent hover:border-black hover:text-white hover:bg-black rounded"
                        disabled={currentPage + 1 > totalPages}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="td">Mã số giáo viên</th>
                            <th className="td">Tên giáo viên</th>
                            <th className="td">Ngày sinh</th>
                            <th className="td">Giới tính</th>
                            <th className="td">Địa chỉ</th>
                            <th className="td">Số điện thoại</th>
                            <th className="td">Chuyên môn</th>
                            <th className="td">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachersData && teachersData.map((data, index) => (
                            <tr key={index}>
                                <td className="td">{data.MSGV}</td>
                                <td className="td">{data.TenGV}</td>
                                <td className="td">{data.NgaySinh}</td>
                                <td className="td">{data.GioiTinh}</td>
                                <td className="td">{data.DiaChi}</td>
                                <td className="td">{data.SDT}</td>
                                <td className="td">{data.mon_hoc.TenMH}</td>
                                <td className="td">
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
                    <div className="absolute z-10 left-[25%] top-60 w-[50%] bg-sky-300 p-5">
                        <button className="absolute top-0 right-0 me-2 text-red-700 border px-2 mt-2 hover:border-red-600 font-bold button-animation" onClick={() => showFormTeacher(0)}>X</button>
                        <h1 className="text-center mb-3 text-2xl font-semibold">Thêm giáo viên</h1>
                        <Formik
                            initialValues={{
                                TenGV: "",
                                NgaySinh: "",
                                GioiTinh: "",
                                DiaChi: "",
                                SDT: "",
                                ChuyenMon: "",
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

                                            <Field as="select" name="GioiTinh" className="w-full mb-1 rounded form-select">
                                                <option value="" defaultChecked>Giới tính</option>
                                                <option value="Nam">Nam</option>
                                                <option value="Nữ">Nữ</option>
                                            </Field>
                                            <ErrorMessage className="text-red-600" name="GioiTinh" component="div" />

                                            <Field type="text" name="DiaChi" className="w-full mb-1 rounded form-input" placeholder="Địa chỉ" />
                                            <ErrorMessage className="text-red-600" name="DiaChi" component="div" />

                                            <Field type="text" name="SDT" className="w-full mb-1 rounded form-input" placeholder="Số điện thoại" />
                                            <ErrorMessage className="text-red-600" name="SDT" component="div" />

                                            <Field as="select" name="ChuyenMon" className="form-select w-full">
                                                <option value="" disabled defaultChecked>Chọn chuyên môn</option>
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
        </div>
    );
}