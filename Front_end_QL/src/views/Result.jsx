import axiosClient from "../axios-client";
import React, { useEffect, useRef, useState } from 'react';
import { useStateContext } from "../context/Context";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft, faAngleDoubleRight, faChevronLeft, faChevronRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import Menu from "../components/Menu";
import AlterConfirm from "../components/Confirm";
export default function Result() {
    const { nienKhoa } = useStateContext();
    const [classList, setClassLiss] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [startPage, setStartPage] = useState(0);
    const [endPage, setEndPage] = useState(0);
    const [view, setView] = useState(1);
    const navigate = useNavigate();
    const [Nk, setNk] = useState([]);
    const NKRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            const nk = await axiosClient.get("/nk/index");
            setNk(nk.data);
        }
        fetchData();
    },[])
    const fetchByClass = async (NK) => {
        try {
            const response = await axiosClient.get(`/lop/list/${NK}`);
            setClassLiss(response.data);
        } catch (error) {
            console.log(error);
        }
    }
    const fetchAllClass = async () => {
        try {
            const response = await axiosClient.get(`/lop/list`);
            setClassLiss(response.data);
        } catch (error) {
            console.log(error);
        }
    }
    const fetchByNK = () => {
        const NK = NKRef.current.value;
        fetchByClass(NK);
    }
    const fetchByStudent = async (page) => {
        try {
            const response = await axiosClient.get(`/hs/all?page=${page}`);
            setStudentList(response.data.data);
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
    useEffect(() => {
        fetchByClass(nienKhoa.NienKhoa);
    }, [nienKhoa]);
    const studentView = () => {
        fetchByStudent(1);
        setStartPage(1);
        setEndPage(5);
        setView(2);
    }
    const classView = () => {
        setView(1);
    }
    const handlePageChange = (page) => {
        fetchByStudent(page);
    }
    const handleToClass = (data) => {
        navigate('/class-info', { state: { classData: data } });
    };
    const handleToStudent = (data) => {
        navigate('/student-info', { state: { studentData: data } });
    };
    const search = async () => {
        const searchValue = document.getElementById('search').value;
        try {
            const searchId = await axiosClient.get('/hs/show/' + searchValue);
            if (Object.keys(searchId.data).length === 0) {
                const searchName = await axiosClient.get(`/hs/search/${searchValue}`);
                if (Object.keys(searchName.data).length === 0) {
                    setMessage('Không tìm thấy kết quả');
                } else {
                    setStudentList(searchName.data);
                }
            } else {
                setStudentList([searchId.data]);
            }
        } catch (error) {
            console.error('Error searching data:', error);
            setMessage(error.response.data.message);
        }

    }
    console.log();
    return (
        <div className="main-content">
            <Menu />
            <div className="right-part">
                <h1 className="page-name">Kết quả học tập</h1>
                <div className="flex w-full">
                    <button onClick={classView} className="button bg-slate-100 shadow-md transition duration-300 ease-in-out transform hover:bg-blue-600 hover:scale-[1.02] hover:shadow-lg mt-2 border-blue-400 hover:text-white w-1/2">Theo lớp</button>
                    <button onClick={studentView} className="button bg-slate-100 shadow-md transition duration-300 ease-in-out transform hover:bg-blue-600 hover:scale-[1.02] hover:shadow-lg mt-2 border-blue-400 hover:text-white w-1/2">Theo học sinh</button>
                </div>
                {view == 1 &&
                    <div>
                        <h2 className="text-3xl font-semibold text-center my-3">Danh sách lớp</h2>
                        <div className="w-[90%] mx-auto">
                            <div className="my-2 grid grid-rows-1 grid-flow-col w-[30%] space-x-2">
                                <button className="button border border-blue-400 hover:bg-blue-300" onClick={fetchAllClass}>Tất cả</button>
                                <button className="button border border-blue-400 hover:bg-blue-300" onClick={()=>fetchByClass(nienKhoa.NienKhoa)}>Hiện tại</button>
                                <select ref={NKRef} className="rounded-md border-2 px-2" onChange={fetchByNK}>
                                    <option value="">Chọn niên khóa</option>
                                    {Nk.map((item) => (
                                        <option key={item.MaNK} value={item.MaNK}>{item.TenNK}</option>
                                    ))}
                                </select>
                            </div>
                            {classList?.map((item) => (
                                <div key={item.MaLop} onClick={() => handleToClass(item)}
                                    className="grid grid-cols-3 grid-flow-row text-2xl
                                     bg-white shadow-md border-2 border-collapse p-2 transition duration-300 
                                     ease-in-out transform hover:scale-x-105 hover:shadow-lg hover:bg-slate-200 cursor-pointer"
                                >
                                    <h3 className="">Mã lớp: {item.MaLop}</h3>
                                    <p className="">Tên lớp: {item.TenLop}</p>
                                    {(() => {
                                        switch (item.TrangThai) {
                                            case 0:
                                                return <p className="text-red-500">Chưa báo cáo</p>;
                                            case 1:
                                                return <p className="text-yellow-600">Chờ duyệt</p>;
                                            default:
                                                return <p className="text-green-500">Đã duyệt</p>;
                                        }
                                    })()}
                                </div>
                            ))}
                        </div>
                    </div>
                }
                {view == 2 &&
                    <div className="w-[80%] mx-auto">
                        <h2 className="text-3xl font-semibold text-center my-3">Danh sách học sinh</h2>
                        <div className="flex justify-end">
                            <div className="flex w-[30%]">
                                <input type="text" id="search" className="form-input rounded h-9 w-full" placeholder="Tìm tên hoặc mã số học sinh" />
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
                        <table className="table table-auto w-full text-xl bg-white">
                            <thead>
                                <tr>
                                    <th className="td py-1 px-2" >STT</th>
                                    <th className="td py-1 px-2" >MSHS</th>
                                    <th className="td py-1 px-2" >Tên học sinh</th>
                                    <th className="td py-1 px-2" >Ngày Sinh</th>
                                    <th className="td py-1 px-2" >Số điện thoại</th>
                                    <th className="td py-1 px-2" >Ban</th>
                                    <th className="td py-1 px-2" >Lớp</th>
                                    <th className="td py-1 px-2" >Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentList.map((data, index) => (
                                    <tr key={index} onClick={() => handleToStudent(data)} className="cursor-pointer hover:bg-slate-100">
                                        <td className="td py-1 px-2" >{(currentPage - 1) * 10 + index + 1}</td>
                                        <td className="td py-1 px-2" >{data.MSHS}</td>
                                        <td className="td py-1 px-2" >{data.HoTen}</td>
                                        <td className="td py-1 px-2" >{data.NgaySinh}</td>
                                        <td className="td py-1 px-2" >{data.SDT}</td>
                                        <td className="td py-1 px-2" >{data.ban.TenBan}</td>
                                        {data.lop[0]?.TenLop ?
                                            <td className="td py-1 px-2">{data.lop[0].TenLop}</td> :
                                            <td className="td py-1 px-2">Chưa xếp</td>}
                                        <td className="td py-1 px-2">{data.TrangThai == 0 ? "Đang học" : data.TrangThai == 1 ? "Đã thôi học" : "Đã tốt nghiệp"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        </div>
    )
}