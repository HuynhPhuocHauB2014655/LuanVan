import axiosClient from "../axios-client";
import React, { useEffect, useRef, useState } from 'react';
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
export default function Student() {
    const [datas, setDatas] = useState([]);
    const navigate = useNavigate();
    const { setMessage } = useStateContext();
    const [showForm, setShowForm] = useState(0);
    const [studentForm, setStudentForm] = useState({});
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [startPage, setStartPage] = useState(0);
    const [endPage, setEndPage] = useState(0);
    const [showConfirm, setShowConfirm] = useState(0);
    const formRef = useRef();
    const { setError } = useStateContext();
    const { userName } = useUserContext();
    useEffect(() => {
        if (userName == "daotao") {
            setError("Bạn không có quyền truy cập trang này");
            navigate('/');
        }
    }, [userName]);
    const fetchData = async (page) => {
        try {
            const response = await axiosClient.get(`/hs/all?page=${page}`);
            setDatas(response.data.data);
            setTotalPages(response.data.last_page);
            setCurrentPage(response.data.current_page);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        if (currentPage > endPage) {
            const newStart = currentPage;
            const newEnd = newStart + 4 > totalPages ? totalPages : currentPage + 4;
            setStartPage(newStart);
            setEndPage(newEnd);
        }
        if (currentPage < startPage) {
            const newEnd = currentPage;
            const newStart = currentPage - 4 > 0 ? currentPage - 4 : 1;
            setStartPage(newStart);
            setEndPage(newEnd);
        }
    }, [currentPage]);
    useEffect(() => {
        if (startPage !== undefined && endPage !== undefined) {
            const generatedPages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
            setPages(generatedPages);
        }
    }, [endPage]);
    const validationSchema = Yup.object({
        MaNK: Yup.string().required('Mã niên khóa không được bỏ trống'),
        HoTen: Yup.string().required('Họ và tên không được bỏ trống'),
        NgaySinh: Yup.string().required('Ngày sinh không được bỏ trống'),
        GioiTinh: Yup.string().required('Giới tính không được bỏ trống'),
        QueQuan: Yup.string().required('Quê quán không được bỏ trống'),
        DanToc: Yup.string().required('Dân Tộc không được bỏ trống'),
        TonGiao: Yup.string().required('Tôn Giáo không được bỏ trống'),
        DiaChi: Yup.string().required('Địa chỉ không được bỏ trống'),
        SDT: Yup.string().matches(/^\d{10}$/, 'Số điện thoại phải có 10 chữ số.').required('Số điện thoại không được bỏ trống'),
        MaBan: Yup.string().required('Ban không được bỏ trống'),
        TrangThai: Yup.string(),
    });
    const handleSubmit = async (values) => {
        if (showForm === 2) {
            values.MSHS = studentForm.MSHS;
            const updated = { ...values };
            delete updated["MaNK"];
            try {
                await axiosClient.put('/hs/update/' + values.MSHS, updated);
                setMessage('Đã sửa học sinh thành công');
                fetchData(1);
                showFormStudent(0);
            } catch (error) {
                console.error('Error submitting form:', error);
                setMessage('Có lỗi trong quá trình sửa học sinh');
            }
        } else {
            var soHocSinh = 0;
            try {
                if (datas.length > 0) {
                    const lastStudent = await axiosClient.get(`/hs/last/${values.MaNK.replace(/-/g, '')}`);
                    soHocSinh = parseInt(lastStudent.data.substring(6, 9), 10) + 1 || 0;
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                setMessage('Có lỗi trong quá trình thêm học sinh');
            }
            values.MSHS = values.MaBan + values.MaNK.replace(/-/g, '') + soHocSinh.toString().padStart(3, '0');
            const updated = { ...values };
            delete updated["MaNK"];
            try {
                await axiosClient.post('/hs/create', updated);
                setMessage('Đã thêm học sinh thành công');
                fetchData(1);
            } catch (error) {
                console.error('Error submitting form:', error);
                setMessage('Có lỗi trong quá trình thêm học sinh');
            }
        }
    };
    // const deleteStudent = async (mshs) => {
    //     if (confirm("Bạn có chắc chắn với hành động này?")) {
    //         try {
    //             await axiosClient.delete('/hs/delete/' + mshs);
    //             setMessage('Đã xóa học sinh thành công');
    //             fetchData(1);
    //             showFormStudent(0);
    //         } catch (error) {
    //             console.error('Error submitting form:', error);
    //             setMessage('Có lỗi trong quá trình xóa học sinh');
    //         }
    //     }
    // }
    const showFormStudent = (isShow, data) => {
        if (data) {
            setStudentForm({
                MSHS: data.MSHS,
                MaNK: data.MSHS.substring(2, 4) + -+data.MSHS.substring(4, 6),
                MaBan: data.ban.MaBan,
                HoTen: data.HoTen,
                NgaySinh: data.NgaySinh,
                GioiTinh: data.GioiTinh,
                QueQuan: data.QueQuan,
                DanToc: data.DanToc,
                TonGiao: data.TonGiao,
                DiaChi: data.DiaChi,
                SDT: data.SDT,
                TrangThai: data.TrangThai
            });
        } else {
            setStudentForm({});
        }
        setShowForm(isShow);
    }
    useEffect(() => {
        fetchData(1);
        setStartPage(1);
        setEndPage(5);
    }, []);
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
    const search = async () => {
        const searchValue = document.getElementById('search').value;
        try {
            const searchId = await axiosClient.get('/hs/show/' + searchValue);
            if (Object.keys(searchId.data).length === 0) {
                const searchName = await axiosClient.get(`/hs/search/${searchValue}`);
                if (Object.keys(searchName.data).length === 0) {
                    setMessage('Không tìm thấy kết quả');
                } else {
                    setDatas(searchName.data);
                }
            } else {
                setDatas([searchId.data]);
            }
        } catch (error) {
            console.error('Error searching data:', error);
            setMessage(error.response.data.message);
        }
    }
    const handlePageChange = (page) => {
        fetchData(page);
    }
    const toStudentInfo = (mshs) => {
        navigate('/student-info', { state: { Mshs: mshs } });
    }
    return (
        <div>
            <Header />
            <div className="main-content ">
                <Menu />
                <div className="right-part relative">
                    {showForm != 0 &&
                        <div className="absolute z-10 w-[70%] left-[15%] top-20 bg-white p-5 border-2 border-cyan-400">
                            <button className="absolute top-0 right-0 me-2 text-red-700 border-2 px-2 mt-2 hover:border-red-600" onClick={() => showFormStudent(0)}>X</button>
                            <h1 className="text-center mb-3 text-2xl font-semibold bg-slate-400 mt-5 py-2 rounded">{showForm == 1 ? "Thêm học sinh" : "Sửa học sinh"}</h1>
                            <Formik
                                initialValues={{
                                    MaNK: '',
                                    HoTen: '',
                                    NgaySinh: '',
                                    GioiTinh: "Nam",
                                    QueQuan: '',
                                    DanToc: '',
                                    TonGiao: '',
                                    DiaChi: '',
                                    SDT: '',
                                    MaBan: 'TN',
                                    TrangThai: 0
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                                enableReinitialize={true}
                                innerRef={formRef}
                            >
                                {({ setValues }) => {
                                    useEffect(() => {
                                        if (Object.keys(studentForm).length > 0) {
                                            setValues(studentForm);
                                        }
                                    }, [studentForm, setValues]);
                                    return (
                                        <Form className="relative" ref={formRef}>
                                            <div className="grid grid-cols-2 grid-flow-row gap-2">
                                                <div>
                                                    <Field type="text" name="MaNK" className="border-none py-3 ring-2 rounded ring-slate-500 focus:ring-0 outline-2 outline-cyan-300 p-2 mb-1 w-full" placeholder="Mã niên khóa" />
                                                    <ErrorMessage className="text-red-700" name="MaNK" component="div" />
                                                </div>

                                                <div>
                                                    <Field type="text" name="HoTen" className="border-none py-3 ring-2 rounded ring-slate-500 focus:ring-0 outline-2 outline-cyan-300 p-2 mb-1 w-full" placeholder="Họ và tên" />
                                                    <ErrorMessage className="text-red-700" name="HoTen" component="div" />
                                                </div>

                                                <div>
                                                    <Field type="text" name="NgaySinh" className="border-none py-3 ring-2 rounded ring-slate-500 focus:ring-0 outline-2 outline-cyan-300 p-2 mb-1 w-full" placeholder="Ngày sinh" />
                                                    <ErrorMessage className="text-red-700" name="NgaySinh" component="div" />
                                                </div>

                                                <div>
                                                    <Field as="select" name="GioiTinh" className="border-none py-3 ring-2 rounded ring-slate-500 focus:ring-0 outline-2 outline-cyan-300 p-2 mb-1 w-full">
                                                        <option value="Nam" defaultChecked>Nam</option>
                                                        <option value="Nữ">Nữ</option>
                                                    </Field>
                                                    <ErrorMessage className="text-red-700" name="GioiTinh" component="div" />
                                                </div>

                                                <div>
                                                    <Field type="text" name="QueQuan" className="border-none py-3 ring-2 rounded ring-slate-500 focus:ring-0 outline-2 outline-cyan-300 p-2 mb-1 w-full" placeholder="Quê quán" />
                                                    <ErrorMessage className="text-red-700" name="QueQuan" component="div" />
                                                </div>

                                                <div>
                                                    <Field type="text" name="DanToc" className="border-none py-3 ring-2 rounded ring-slate-500 focus:ring-0 outline-2 outline-cyan-300 p-2 mb-1 w-full" placeholder="Dân Tộc" />
                                                    <ErrorMessage className="text-red-700" name="DanToc" component="div" />
                                                </div>

                                                <div>
                                                    <Field type="text" name="TonGiao" className="border-none py-3 ring-2 rounded ring-slate-500 focus:ring-0 outline-2 outline-cyan-300 p-2 mb-1 w-full" placeholder="Tôn Giáo" />
                                                    <ErrorMessage className="text-red-700" name="TonGiao" component="div" />
                                                </div>

                                                <div>
                                                    <Field type="text" name="DiaChi" className="border-none py-3 ring-2 rounded ring-slate-500 focus:ring-0 outline-2 outline-cyan-300 p-2 mb-1 w-full" placeholder="Địa chỉ" />
                                                    <ErrorMessage className="text-red-700" name="DiaChi" component="div" />
                                                </div>

                                                <div>
                                                    <Field type="text" name="SDT" className="border-none py-3 ring-2 rounded ring-slate-500 focus:ring-0 outline-2 outline-cyan-300 p-2 mb-1 w-full" placeholder="Số điện thoại" />
                                                    <ErrorMessage className="text-red-700" name="SDT" component="div" />
                                                </div>

                                                <div>
                                                    <Field as="select" name="MaBan" className="border-none py-3 ring-2 rounded ring-slate-500 focus:ring-0 outline-2 outline-cyan-300 p-2 mb-1 w-full">
                                                        <option value="TN">Tự nhiên</option>
                                                        <option value="XH">Xã hội</option>
                                                    </Field>
                                                    <ErrorMessage className="text-red-700" name="MaBan" component="div" />
                                                </div>

                                                <div>
                                                    <Field as="select" name="TrangThai" className="border-none py-3 ring-2 rounded ring-slate-500 focus:ring-0 outline-2 outline-cyan-300 p-2 mb-1 w-full">
                                                        <option value={0}>Đang học</option>
                                                        <option value={1}>Đã thôi học</option>
                                                        <option value={2}>Đã tốt nghiệp</option>
                                                    </Field>
                                                    <ErrorMessage className="text-red-700" name="TrangThai" component="div" />
                                                </div>
                                            </div>

                                            {showForm === 1 ?
                                                <div className="flex justify-center">
                                                    <button type="button" onClick={() => triggerConfirm(1)} className="w-1/3 mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-300">
                                                        Thêm
                                                    </button>
                                                </div>
                                                :
                                                <div className="flex justify-center">
                                                    <button type="button" onClick={() => triggerConfirm(1)} className="w-1/3 mt-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400">
                                                        Sửa
                                                    </button>
                                                </div>
                                            }
                                            {showConfirm === 1 &&
                                                <AlterConfirm message={'Bạn có chắc chắn với hành động này không?'} onConfirm={onConfirm} onCancel={onCancel} />
                                            }
                                        </Form>
                                    );
                                }}
                            </Formik>
                        </div>}
                    <h2 className="page-name">Quản lí học sinh</h2>
                    <div className="mt-2 flex justify-between">
                        <div>
                            <button className="px-3 py-2 border-2 border-green-400 rounded bg-white hover:bg-green-400 me-2 button-animation" onClick={() => fetchData(1)}><FontAwesomeIcon icon="fa-solid fa-list" title="Tất cả"/></button>
                            <button className="px-3 py-2 border-2 border-blue-400 rounded bg-white hover:bg-blue-400 button-animation" onClick={() => showFormStudent(1)}><FontAwesomeIcon icon="fa-solid fa-plus" title="Thêm học sinh"/></button>
                        </div>
                        <div className="me-3 flex w-[25%]">
                            <input type="text" id="search" className="rounded w-full border-2 border-black px-2" placeholder="Tìm tên hoặc mã số học sinh" />
                            <button onClick={search} className="p-2 border-2 rounded bg-white border-black ms-1 hover:border-blue-500"><FontAwesomeIcon icon={faSearch} color="blue" /></button>
                        </div>
                    </div>
                    <div className="my-1 flex justify-center">
                        <button
                            onClick={() => handlePageChange(1)}
                            className="me-1 p-2 border-2 border-transparent hover:border-black hover:text-white hover:bg-black rounded"
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
                            className="me-1 p-2 border-2 border-transparent hover:border-black hover:text-white hover:bg-black rounded"
                        >
                            <FontAwesomeIcon icon={faAngleDoubleRight} />
                        </button>
                    </div>
                    <table className="table-auto w-[90%] mx-auto text-xl">
                        <thead>
                            <tr className="bg-slate-500 text-white">
                                <th className="px-3 py-4 text-start" >STT</th>
                                <th className="px-3 py-4 text-start" >MSHS</th>
                                <th className="px-3 py-4 text-start" >Tên học sinh</th>
                                <th className="px-3 py-4 text-start" >Lớp</th>
                                <th className="px-3 py-4 text-start" >Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datas.map((data, index) => (
                                <tr key={index} className={`${index % 2 == 0 && "bg-slate-200"} cursor-pointer hover:bg-slate-300`} onClick={() => toStudentInfo(data.MSHS)}>
                                    <td className="px-3 py-4" >{(currentPage - 1) * 10 + index + 1}</td>
                                    <td className="px-3 py-4" >{data.MSHS}</td>
                                    <td className="px-3 py-4" >{data.HoTen}</td>
                                    {data.lop[0]?.TenLop ?
                                        <td className="px-3 py-4">{data.lop[0].TenLop}</td> :
                                        <td className="px-3 py-4">Chưa xếp</td>}
                                    <td className="px-3 py-4">{data.TrangThai == 0 ? "Đang học" : data.TrangThai == 1 ? "Đã thôi học" : "Đã tốt nghiệp"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
