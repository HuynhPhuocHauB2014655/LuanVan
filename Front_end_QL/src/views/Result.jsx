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
import { useUserContext } from "../context/userContext";
import Header from "../components/Header";
export default function Result() {
    const { nienKhoa } = useStateContext();
    const [classList, setClassLiss] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [summary, setSummary] = useState([]);
    const [summaryGrade, setSummaryGrade] = useState([]);
    const [summaryClass, setSummaryClass] = useState([]);
    const [pages, setPages] = useState([]);
    const [style, setStyle] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [startPage, setStartPage] = useState(0);
    const [endPage, setEndPage] = useState(0);
    const [view, setView] = useState(1);
    const navigate = useNavigate();
    const [Nk, setNk] = useState([]);
    const [namHoc, setNamHoc] = useState();
    const [forcus, setForcus] = useState("");
    const NKRef = useRef();
    const namhocRef = useRef();
    const { setError } = useStateContext();
    const { userName } = useUserContext();
    useEffect(() => {
        if (userName == "nhansu") {
            setError("Bạn không có quyền truy cập trang này");
            navigate('/');
        }
    }, [userName]);
    useEffect(() => {
        const fetchData = async () => {
            const nk = await axiosClient.get("/nk/index");
            setNk(nk.data);
        }
        fetchData();
    }, [])
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
    const fetchSummary = async (nk) => {
        try {
            const response = await axiosClient.get(`/tongKet/truong/${nk ? nk : nienKhoa.NienKhoa}`);
            setSummary(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const fetchSummaryClass = async (nk) => {
        try {
            const response = await axiosClient.get(`/tongKet/lop/${nk ? nk : nienKhoa.NienKhoa}`);
            setSummaryClass(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const fetchSummaryGrade = async (nk) => {
        try {
            const response = await axiosClient.get(`/tongKet/khoi/${nk ? nk : nienKhoa.NienKhoa}`);
            setSummaryGrade(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const sumView = () => {
        if (summary.length == 0) {
            setNamHoc(namhocRef.current?.value);
            fetchSummary(namhocRef.current?.value);
        }
        setView(3);
    }
    const handlePageChange = (page) => {
        fetchByStudent(page);
    }
    const handleToClass = (data) => {
        navigate('/class-info', { state: { classData: data } });
    };
    const handleToStudent = (data) => {
        navigate('/student-result', { state: { studentData: data } });
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
    const changeStyle = (e) => {
        setStyle(e.target.value);
        if (e.target.value == 1) {
            fetchSummaryGrade(namHoc);
        }
        if (e.target.value == 2) {
            fetchSummaryGrade(namHoc);
        }
        if (e.target.value == 3) {
            fetchSummaryClass(namHoc);
        }
    }
    const changeNH = (e) => {
        setNamHoc(e.target.value);
        console.log(style);
        if (style == 1) {
            fetchSummary(e.target.value);
        }
        if (style == 2) {
            fetchSummaryGrade(e.target.value);
        }
        if (style == 3) {
            fetchSummaryClass(e.target.value);
        }
    }
    const searchClass = (e) => {
        e.preventDefault();
        const searchValue = e.target.search.value;
        const filter = summaryClass.find(item => item.TenLop === searchValue);
        if (filter) {
            scrollTo(filter.MaLop);
        } else {
            setError("Không tìm thấy kết quả");
        }
    }
    const scrollTo = (id) => {
        const element = document.getElementById(id);
        element.scrollIntoView();
        setForcus(id);
    }
    useEffect(() => {
        if (forcus) {
            const timer = setTimeout(() => {
                setForcus("");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [forcus]);
    console.log();
    return (
        <div>
            <Header />
            <div className="main-content">
                <Menu />
                <div className="right-part">
                    <h1 className="page-name">Kết quả học tập</h1>
                    <div className="flex w-full">
                        <button onClick={classView} className={`${view == 1 ? "bg-blue-600 text-white" : "bg-slate-100"} button shadow-md transition duration-300 ease-in-out transform hover:bg-blue-600 hover:scale-[1.02] hover:shadow-lg mt-2 border-blue-400 hover:text-white w-1/2`}>Theo lớp</button>
                        <button onClick={studentView} className={`${view == 2 ? "bg-blue-600 text-white" : "bg-slate-100"} button shadow-md transition duration-300 ease-in-out transform hover:bg-blue-600 hover:scale-[1.02] hover:shadow-lg mt-2 border-blue-400 hover:text-white w-1/2`}>Theo học sinh</button>
                        <button onClick={sumView} className={`${view == 3 ? "bg-blue-600 text-white" : "bg-slate-100"} button shadow-md transition duration-300 ease-in-out transform hover:bg-blue-600 hover:scale-[1.02] hover:shadow-lg mt-2 border-blue-400 hover:text-white w-1/2`}>Tổng kết năm học</button>
                    </div>
                    {view == 1 &&
                        <div>
                            <h2 className="text-3xl font-semibold text-center my-3">Danh sách lớp</h2>
                            <div className="w-[90%] mx-auto">
                                <div className="my-2 grid grid-rows-1 grid-flow-col w-[30%] space-x-2">
                                    <button className="button border border-blue-400 hover:bg-blue-300" onClick={fetchAllClass}>Tất cả</button>
                                    <button className="button border border-blue-400 hover:bg-blue-300" onClick={() => fetchByClass(nienKhoa.NienKhoa)}>Hiện tại</button>
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
                        <div className="w-[95%] mx-auto">
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
                            <table className="table table-auto w-full md:text-xl bg-white">
                                <thead>
                                    <tr className="bg-slate-400">
                                        <th className="p-4" >STT</th>
                                        <th className="p-4" >MSHS</th>
                                        <th className="p-4" >Tên học sinh</th>
                                        <th className="p-4" >Ngày Sinh</th>
                                        <th className="p-4" >Số điện thoại</th>
                                        <th className="p-4" >Ban</th>
                                        <th className="p-4" >Lớp</th>
                                        <th className="p-4" >Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentList.map((data, index) => (
                                        <tr key={index} onClick={() => handleToStudent(data)} className="cursor-pointer hover:bg-slate-300">
                                            <td className={`p-4 ${index % 2 !== 0 && "bg-slate-200"}`} >{(currentPage - 1) * 10 + index + 1}</td>
                                            <td className={`p-4 ${index % 2 !== 0 && "bg-slate-200"}`} >{data.MSHS}</td>
                                            <td className={`p-4 ${index % 2 !== 0 && "bg-slate-200"}`} >{data.HoTen}</td>
                                            <td className={`p-4 ${index % 2 !== 0 && "bg-slate-200"}`} >{data.NgaySinh}</td>
                                            <td className={`p-4 ${index % 2 !== 0 && "bg-slate-200"}`} >{data.SDT}</td>
                                            <td className={`p-4 ${index % 2 !== 0 && "bg-slate-200"}`} >{data.ban.TenBan}</td>
                                            {data.lop[0]?.TenLop ?
                                                <td className={`p-4 ${index % 2 !== 0 && "bg-slate-200"}`}>{data.lop[0].TenLop}</td> :
                                                <td className={`p-4 ${index % 2 !== 0 && "bg-slate-200"}`}>Chưa xếp</td>}
                                            <td className={`p-4 ${index % 2 !== 0 && "bg-slate-200"}`}>{data.TrangThai == 0 ? "Đang học" : data.TrangThai == 1 ? "Đã thôi học" : "Đã tốt nghiệp"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }
                    {view == 3 &&
                        <div className="mx-3 mt-5">
                            <div className="flex justify-center w-1/2 mx-auto">
                                <select name="style"
                                    className="block w-2/3 appearance-none text-center bg-white border-4 border-r-0 border-blue-300 
                                text-gray-700 p-4 text-lg font-bold pr-8 rounded-lg rounded-r-none leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                    onChange={changeStyle}
                                >
                                    <option value="1">Toàn trường</option>
                                    <option value="2">Theo khối</option>
                                    <option value="3">Theo lớp</option>
                                </select>
                                <select className="block appearance-none w-1/3 text-center bg-white border-4 border-blue-300 
                                text-gray-700 p-4 text-lg font-bold pr-8 rounded-lg rounded-l-none leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                    defaultValue={nienKhoa.NienKhoa}
                                    onChange={changeNH}
                                    ref={namhocRef}
                                >
                                    <option value="">Chọn niên khóa</option>
                                    {Nk.map((item) => (
                                        <option key={item.MaNK} value={item.MaNK}>{item.TenNK}</option>
                                    ))}
                                </select>
                            </div>
                            {style == 1 &&
                                <table className="table-fixed border-4 border-separate  border-blue-300 text-lg w-full border-spacing-1 mt-3 bg-white">
                                    <tbody>
                                        <tr>
                                            <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh:</th>
                                            <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.TongHS}</td>
                                            <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh học lực Tốt:</th>
                                            <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.HLTot} ({Math.round((summary.HLTot * 100) / summary.TongHS)}%)</td>
                                        </tr>
                                        <tr>
                                            <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh khối 10:</th>
                                            <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.K10}</td>
                                            <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh học lực Khá:</th>
                                            <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.HLKha} ({Math.round((summary.HLKha * 100) / summary.TongHS)}%)</td>
                                        </tr>
                                        <tr>
                                            <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh khối 11:</th>
                                            <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.K11}</td>
                                            <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh học lực Đạt:</th>
                                            <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.HLDat} ({Math.round((summary.HLDat * 100) / summary.TongHS)}%)</td>
                                        </tr>
                                        <tr>
                                            <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh khối 12:</th>
                                            <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.K12}</td>
                                            <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh học lực Chưa đạt:</th>
                                            <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.HLCD} ({Math.round((summary.HLCD * 100) / summary.TongHS)}%)</td>
                                        </tr>
                                        <tr>
                                            <th className="text-left py-1 px-2 border-2 border-blue-200">Khen thưởng học sinh Xuất sắc:</th>
                                            <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.Xuatsac}</td>
                                            <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh rèn luyện Tốt:</th>
                                            <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.RLTot} ({Math.round((summary.RLTot * 100) / summary.TongHS)}%)</td>
                                        </tr>
                                        <tr>
                                            <th className="text-left py-1 px-2 border-2 border-blue-200">Khen thưởng học sinh Giỏi:</th>
                                            <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.Gioi}</td>
                                            <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh rèn luyện Khá:</th>
                                            <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.RLKha} ({Math.round((summary.RLKha * 100) / summary.TongHS)}%)</td>
                                        </tr>
                                        <tr>
                                            <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh lên lớp:</th>
                                            <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.LL} ({Math.round((summary.LL * 100) / summary.TongHS)}%)</td>
                                            <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh rèn luyện Đạt:</th>
                                            <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.RLDat} ({Math.round((summary.RLDat * 100) / summary.TongHS)}%)</td>
                                        </tr>
                                        <tr>
                                            <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh phải rèn luyện hè:</th>
                                            <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.RLH} ({Math.round((summary.RLH * 100) / summary.TongHS)}%)</td>
                                            <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh rèn luyện Chưa đạt:</th>
                                            <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.RLCD} ({Math.round((summary.RLCD * 100) / summary.TongHS)}%)</td>
                                        </tr>
                                    </tbody>
                                </table>
                            }
                            {style == 2 &&
                                <div className="mt-3">
                                    {summaryGrade?.map((summary) => (
                                        <div key={summary.Khoi}>
                                            <table className={`table-fixed border-4 border-separate ${forcus == summary.MaLop ? "border-red-300" : "border-blue-300"} text-lg w-full border-spacing-1 mt-3 bg-white`}>
                                                <tbody>
                                                    <tr>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Khối:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200 font-bold">{summary.Khoi}</td>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh học lực Tốt:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.HLTot} ({Math.round((summary.HLTot * 100) / summary.TongHS) || ""}%)</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.TongHS}</td>

                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh học lực Khá:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.HLKha} ({Math.round((summary.HLKha * 100) / summary.TongHS) || ""}%)</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh lên lớp:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.LL} ({Math.round((summary.LL * 100) / summary.TongHS) || ""}%)</td>

                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh học lực Đạt:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.HLDat} ({Math.round((summary.HLDat * 100) / summary.TongHS) || ""}%)</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh phải rèn luyện hè:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.RLH} ({Math.round((summary.RLH * 100) / summary.TongHS) || ""}%)</td>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh học lực Chưa đạt:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.HLCD} ({Math.round((summary.HLCD * 100) / summary.TongHS) || ""}%)</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Khen thưởng học sinh Xuất sắc:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.Xuatsac}</td>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh rèn luyện Tốt:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.RLTot} ({Math.round((summary.RLTot * 100) / summary.TongHS) || ""}%)</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Khen thưởng học sinh Giỏi:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.Gioi}</td>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh rèn luyện Khá:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.RLKha} ({Math.round((summary.RLKha * 100) / summary.TongHS) || ""}%)</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200"></th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200"></td>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh rèn luyện Đạt:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.RLDat} ({Math.round((summary.RLDat * 100) / summary.TongHS) || ""}%)</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200"></th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200"></td>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh rèn luyện Chưa đạt:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.RLCD} ({Math.round((summary.RLCD * 100) / summary.TongHS) || ""}%)</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                </div>
                            }
                            {style == 3 &&
                                <div className="mt-3">
                                    <form onSubmit={searchClass} className="flex justify-end items-center">
                                        <input type="text" name="search" className="px-2 py-1 w-1/3 border-2 border-cyan-300" placeholder="Nhập tên lớp cần tìm..." />
                                        <button type="submit" className="border-2 px-2 py-1 ms-1 rounded-lg border-blue-300 hover:bg-blue-500 text-blue-500 hover:text-white"><FontAwesomeIcon icon={faSearch} /></button>
                                    </form>
                                    {summaryClass?.map((summary) => (
                                        <div key={summary.MaLop} id={summary.MaLop}>
                                            <table className={`table-fixed border-4 border-separate ${forcus == summary.MaLop ? "border-red-300" : "border-blue-300"} text-lg w-full border-spacing-1 mt-3 bg-white`}>
                                                <tbody>
                                                    <tr>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Mã lớp:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200 font-bold">{summary.MaLop}</td>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh học lực Tốt:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.HLTot} ({Math.round((summary.HLTot * 100) / summary.TongHS)}%)</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tên lớp:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.TenLop}</td>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh học lực Khá:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.HLKha} ({Math.round((summary.HLKha * 100) / summary.TongHS)}%)</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Chủ nhiệm:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.ChuNhiem}</td>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh học lực Đạt:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.HLDat} ({Math.round((summary.HLDat * 100) / summary.TongHS)}%)</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.TongHS}</td>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh học lực Chưa đạt:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.HLCD} ({Math.round((summary.HLCD * 100) / summary.TongHS)}%)</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Khen thưởng học sinh Xuất sắc:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.Xuatsac}</td>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh rèn luyện Tốt:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.RLTot} ({Math.round((summary.RLTot * 100) / summary.TongHS)}%)</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Khen thưởng học sinh Giỏi:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.Gioi}</td>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh rèn luyện Khá:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.RLKha} ({Math.round((summary.RLKha * 100) / summary.TongHS)}%)</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh lên lớp:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.LL} ({Math.round((summary.LL * 100) / summary.TongHS)}%)</td>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh rèn luyện Đạt:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.RLDat} ({Math.round((summary.RLDat * 100) / summary.TongHS)}%)</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh phải rèn luyện hè:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.RLH} ({Math.round((summary.RLH * 100) / summary.TongHS)}%)</td>
                                                        <th className="text-left py-1 px-2 border-2 border-blue-200">Tổng số học sinh rèn luyện Chưa đạt:</th>
                                                        <td className="text-center py-1 px-2 border-2 border-blue-200">{summary.RLCD} ({Math.round((summary.RLCD * 100) / summary.TongHS)}%)</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}