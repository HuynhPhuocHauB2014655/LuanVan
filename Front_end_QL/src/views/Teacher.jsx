import React, { useEffect, useRef, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/Context";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft, faAngleDoubleRight, faChevronLeft, faChevronRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import Menu from "../components/Menu";
import AlterConfirm from "../components/Confirm";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import Header from "../components/Header";
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
    const [showConfirm, setShowConfirm] = useState(0);
    const formRef = useRef();
    const navigate = useNavigate();
    const { setError } = useStateContext();
    const { userName } = useUserContext();
    useEffect(() => {
        if (userName == "daotao") {
            setError("Bạn không có quyền truy cập trang này");
            navigate('/');
        }
    }, [userName]);
    const fetchData = async (page) => {
        const teachers = await axiosClient.get(`/gv/all?page=${page}`);
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
        TrangThai: Yup.string().required('Không được để trống'),
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
    // const deleteTeacher = async (MSGV) => {
    //     try {
    //         const response = await axiosClient.delete("/gv/delete/" + MSGV);
    //         setMessage("Đã xóa thành công");
    //         fetchData();
    //     } catch (error) {
    //         setMessage(error.response.data.message);
    //     }
    // }
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
                TrangThai: data.TrangThai
            })
        } else {
            setTeacherForm({});
        }
        setShowForm(isShow);
    }
    const handlePageChange = (page) => {
        fetchData(page);
    }
    const search = async () => {
        const searchValue = document.getElementById('search').value;
        try {
            const searchId = await axiosClient.get('/gv/show/' + searchValue);
            if (Object.keys(searchId.data).length === 0) {
                const searchName = await axiosClient.get(`/gv/search/${searchValue}`);
                if (Object.keys(searchName.data).length === 0) {
                    setMessage('Không tìm thấy kết quả');
                } else {
                    setTeachersData(searchName.data);
                }
            } else {
                setTeachersData([searchId.data]);
            }
        } catch (error) {
            console.error('Error searching data:', error);
            setMessage(error.response.data.message);
        }
    }
    const triggerConfirm = () => {
        setShowConfirm(1);
    }
    const onConfirm = () => {
        if (formRef.current) {
            formRef.current.submitForm();
        }
        setShowConfirm(0);
    }
    const onCancel = () => {
        setShowConfirm(0);
    }
    return (
        <div>
            <Header />
            <div className="main-content relative">
                <Menu />
                <div className="right-part">
                    <h2 className="page-name">Quản lí Giáo Viên</h2>
                    <div className="flex justify-between mt-2">
                        <div className="space-x-2">
                            <button className="px-2 border-2 border-blue-400 rounded bg-white hover:bg-blue-400" onClick={fetchData}>Tất cả</button>
                            <button className="px-2 border-2 border-blue-400 rounded bg-white hover:bg-blue-400" onClick={() => showFormTeacher(1)}>Thêm giáo viên</button>
                        </div>
                        <div className="me-3 flex w-[25%]">
                            <input type="text" id="search" className="f-field rounded h-9 w-full" placeholder="Tìm tên hoặc mã số giáo viên" />
                            <button onClick={search} className="px-2 py-1 border-2 rounded bg-white border-black ms-1 hover:border-blue-500"><FontAwesomeIcon icon={faSearch} color="blue" /></button>
                        </div>
                    </div>
                    <div className="my-1 flex justify-center">
                        <button
                            onClick={() => handlePageChange(1)}
                            className="me-1 px-2 py-1 border-2 border-transparent hover:border-black hover:text-white hover:bg-black rounded"
                        >
                            <FontAwesomeIcon icon={faAngleDoubleLeft} />
                        </button>
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
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            className="me-1 px-2 py-1 border-2 border-transparent hover:border-black hover:text-white hover:bg-black rounded"
                        >
                            <FontAwesomeIcon icon={faAngleDoubleRight} />
                        </button>
                    </div>
                    <table className="table">
                        <thead>
                            <tr className="bg-slate-400">
                                <th className="p-4 ">Mã số giáo viên</th>
                                <th className="p-4 ">Tên giáo viên</th>
                                <th className="p-4 ">Ngày sinh</th>
                                <th className="p-4 ">Giới tính</th>
                                <th className="p-4 ">Địa chỉ</th>
                                <th className="p-4 ">Số điện thoại</th>
                                <th className="p-4 ">Trạng thái</th>
                                <th className="p-4 ">Chuyên môn</th>
                                <th className="p-4 ">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachersData && teachersData.map((data, index) => (
                                <tr key={index}>
                                    <td className={`p-4 ${index % 2 != 0 && "bg-slate-200"}`}>{data.MSGV}</td>
                                    <td className={`p-4 ${index % 2 != 0 && "bg-slate-200"}`}>{data.TenGV}</td>
                                    <td className={`p-4 ${index % 2 != 0 && "bg-slate-200"}`}>{data.NgaySinh}</td>
                                    <td className={`p-4 ${index % 2 != 0 && "bg-slate-200"}`}>{data.GioiTinh}</td>
                                    <td className={`p-4 ${index % 2 != 0 && "bg-slate-200"}`}>{data.DiaChi}</td>
                                    <td className={`p-4 ${index % 2 != 0 && "bg-slate-200"}`}>{data.SDT}</td>
                                    <td className={`p-4 ${index % 2 != 0 && "bg-slate-200"}`}>{data.TrangThai == 0 ? "Đang dạy" : "Đã nghỉ"}</td>
                                    <td className={`p-4 ${index % 2 != 0 && "bg-slate-200"}`}>{data.mon_hoc.TenMH}</td>
                                    <td className={`p-4 ${index % 2 != 0 && "bg-slate-200"}`}>
                                        <div className="flex justify-center">
                                            <button className="px-2 py-1 border rounded bg-white border-black hover:border-sky-500" onClick={() => showFormTeacher(2, data)}>Sửa</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {showForm != 0 &&
                        <div className="absolute z-10 left-[25%] top-60 w-[50%] bg-sky-300 p-5 rounded-md">
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
                                    TrangThai: 0,
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                                enableReinitialize={true}
                                innerRef={formRef}
                            >
                                {({ setValues }) => {
                                    useEffect(() => {
                                        if (Object.keys(teacherForm).length > 0) {
                                            setValues(teacherForm);
                                        }
                                    }, [teacherForm, setValues]);
                                    return (
                                        <Form className="relative" ref={formRef}>
                                            <div className="grid grid-cols-3 grid-flow-row gap-2">
                                                <div className="min-w-0">
                                                    <Field type="text" name="TenGV" className="f-field" placeholder="Tên giáo viên" />
                                                    <ErrorMessage className="text-red-600" name="TenGV" component="div" />
                                                </div>

                                                <div className="min-w-0">
                                                    <Field type="text" name="NgaySinh" className="f-field" placeholder="Ngày sinh" />
                                                    <ErrorMessage className="text-red-600" name="NgaySinh" component="div" />
                                                </div>

                                                <div className="min-w-0">
                                                    <Field as="select" name="GioiTinh" className="f-field">
                                                        <option value="" defaultChecked>Giới tính</option>
                                                        <option value="Nam">Nam</option>
                                                        <option value="Nữ">Nữ</option>
                                                    </Field>
                                                    <ErrorMessage className="text-red-600" name="GioiTinh" component="div" />
                                                </div>

                                                <div className="min-w-0">
                                                    <Field type="text" name="DiaChi" className="f-field" placeholder="Địa chỉ" />
                                                    <ErrorMessage className="text-red-600" name="DiaChi" component="div" />
                                                </div>

                                                <div className="min-w-0">
                                                    <Field type="text" name="SDT" className="f-field" placeholder="Số điện thoại" />
                                                    <ErrorMessage className="text-red-600" name="SDT" component="div" />
                                                </div>

                                                <div className="min-w-0">
                                                    <Field as="select" name="ChuyenMon" className="f-field">
                                                        <option value="" disabled defaultChecked>Chọn chuyên môn</option>
                                                        {subjectsData.map((subject) => (
                                                            <option key={subject.MaMH} value={subject.MaMH}>{subject.TenMH}</option>
                                                        ))}
                                                    </Field>
                                                    <ErrorMessage className="text-red-600" name="ChuyenMon" component="div" />
                                                </div>

                                                <div className="min-w-0">
                                                    <Field as="select" name="TrangThai" className="f-field">
                                                        <option value="0">Đang dạy</option>
                                                        <option value="1">Đã nghỉ</option>
                                                    </Field>
                                                    <ErrorMessage className="text-red-700" name="TrangThai" component="div" />
                                                </div>
                                            </div>

                                            <div className="w-full flex justify-center">
                                                {showForm === 1 ?
                                                    <button type="button" onClick={() => triggerConfirm(1)} className="w-[50%] mt-2 px-4 py-2 bg-blue-500 text-white rounded-md">
                                                        Thêm
                                                    </button> :
                                                    <button type="button" onClick={() => triggerConfirm(1)} className="w-[50%] mt-2 px-4 py-2 bg-cyan-500 text-white rounded-md">
                                                        Sửa
                                                    </button>
                                                }
                                            </div>
                                            {showConfirm === 1 &&
                                                <AlterConfirm message={'Bạn có chắc chắn với thao tác này không?'} onConfirm={onConfirm} onCancel={onCancel} />
                                            }
                                        </Form>
                                    );
                                }}
                            </Formik>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}