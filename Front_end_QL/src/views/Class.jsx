import axiosClient from "../axios-client";
import React, { useEffect, useRef, useState } from 'react';
import { useStateContext } from "../context/Context";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Menu from "../components/Menu";
import { useNavigate } from 'react-router-dom';
import AlterConfirm from "../components/Confirm";
import Header from "../components/Header";
export default function Class() {
    const [classes, setClasses] = useState([]);
    const [show, setShow] = useState(0);
    const [newStudents, setNewStudents] = useState([]);
    const [studentCount, setStudentCount] = useState(0);
    const [TNCount, setTNCount] = useState(0);
    const [XHCount, setXHCount] = useState(0);
    const [showForm, setShowForm] = useState(0);
    const [nienKhoaList, setNienKhoaList] = useState([]);
    const { userName, setMessage, setError } = useStateContext();
    const [visibleTables, setVisibleTables] = useState({});
    const { nienKhoa } = useStateContext();
    const [classTN, setClassTN] = useState([]);
    const [classXH, setClassXH] = useState([]);
    const [selected, setSelected] = useState({});
    const [oLaiLop, setOLaiLop] = useState([]);
    const [showConfirm, setShowConfirm] = useState(0);
    const [confMessage, setConfMessage] = useState("");
    const [classed, setClassed] = useState();
    const selectedClass = useRef();
    const [defaultV, setDefaultV] = useState("default");
    const navigate = useNavigate();
    useEffect(() => {
        if (userName == "nhansu") {
            setError("Bạn không có quyền truy cập trang này");
            navigate('/');
        }
    }, [userName]);
    const fetchNewStudent = async () => {
        try {
            const response = await axiosClient.get("/hs/new");
            setNewStudents(response.data);
            setStudentCount(response.data.length);
            setTNCount(response.data.filter(student => student.MaBan === 'TN').length);
            setXHCount(response.data.filter(student => student.MaBan === 'XH').length);
            const nienkhoa = await axiosClient.get("/nk/index");
            setNienKhoaList(nienkhoa.data);
            const fetchTN = await axiosClient.get(`/lop/tn/${nienKhoa.NienKhoa}`);
            setClassTN(fetchTN.data);
            const fetchXH = await axiosClient.get(`/lop/xh/${nienKhoa.NienKhoa}`);
            setClassXH(fetchXH.data);
            console.log(classTN);
            const oll = await axiosClient.get(`/hs/${nienKhoa.NienKhoa}`);
            setOLaiLop(oll.data);
        } catch (error) {
            console.log(error);
        }
    }
    const fetchClass = async () => {
        try {
            const response = await axiosClient.get("/lop/list");
            setClasses(response.data);
        } catch (error) {
            console.log(error);
        }
    }
    const getClassNow = async () => {
        try {
            const response = await axiosClient.get(`/lop/list/${nienKhoa.NienKhoa}`);
            setClasses(response.data);
        } catch (error) {
            console.log(error);
        }
    }
    const _setShow = (id) => {
        if (id == 1) {
            fetchNewStudent();
            setShow(id);
        } else {
            fetchClass();
            setShow(id);
        }
    }
    const _showForm = (show, data) => {
        if (show >= 2) {
            setSelected(data);
        }
        goToTop();
        setShowForm(show);
    }
    const goToTop = () => {
        window.scrollTo(0, 0);
    }
    const validationSchema = Yup.object({
        MaNK: Yup.string().required("Trường bắt buộc"),
        soLopTN: Yup.number()
            .max(Math.floor(TNCount / 10), `Số lớp tối đa ${Math.floor(TNCount / 10)}`)
            .min(Math.ceil(TNCount / 40), `Số lớp tối thiểu ${Math.ceil(TNCount / 40)}`)
            .integer("Số không hợp lệ")
            .required("Trường bắt buộc"),
        soLopXH: Yup.number()
            .max(Math.floor(XHCount / 10), `Số lớp tối đa ${Math.floor(XHCount / 10)}`)
            .min(Math.ceil(XHCount / 40), `Số lớp tối thiểu ${Math.ceil(XHCount / 40)}`)
            .integer("Số không hợp lệ")
            .required("Trường bắt buộc"),
    });
    const handleSubmit = async (value) => {
        try {
            const response = await axiosClient.post("/lop/add", value);
            setShowForm(0);
            setMessage(response.data);
            fetchNewStudent();
        } catch (error) {
            console.log(error);
        }
    }
    const toggleTable = (classId) => {
        setVisibleTables(prevState => ({
            ...prevState,
            [classId]: !prevState[classId]
        }));
    };
    const SelectClass = async (MSHS) => {
        const classed = selectedClass.current.value;
        if (classed) {
            const payload = {
                MSHS: MSHS,
                MaNK: nienKhoa.NienKhoa,
                MaLop: classed
            };
            try {
                const response = await axiosClient.post(`/lop/addHS`, payload);
                fetchNewStudent();
                setMessage(response.data);
                setShowForm(0);
            } catch (error) {
                console.log(error);
                setMessage(error.response.data);
            } finally {
                fetchNewStudent();
            }
        }
    }
    const checkHS = async (data) => {
        try {
            const response = await axiosClient.post("/hs/check", { hs: data });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
    const toStudentInfo = (mshs) => {
        navigate('/student-info', { state: { Mshs: mshs } });
    }
    const listClass = (data) => {
        return classes.filter(item => item.MaKhoi == data.MaKhoi && item.MaNK == nienKhoa.NienKhoa && item.MaLop != data.MaLop);
    }
    const changeClass = async () => {
        try {
            const response = await axiosClient.post("/lop/change", classed);
            setMessage(response.data);
        } catch (error) {
            setError(typeof error.response.data == 'string' ? error.response.data : 'Lỗi không xác định');
        } finally {
            getClassNow();
        }
    }
    const triggerConfirm = (e, data, MaLop, TenLop) => {
        const c = e.target.options[e.target.selectedIndex].text
        setConfMessage(`Bạn có chắc chắn muốn chuyển ${data.HoTen} từ lớp ${TenLop} đến lớp ${c}`);
        const payload = {
            MSHS: data.MSHS,
            MaNK: nienKhoa.NienKhoa,
            oldClass: MaLop,
            newClass: e.target.value
        };
        setClassed(payload);
        setShowConfirm(1)
    }
    const onConfirm = () => {
        changeClass();
        setShowConfirm(0);
    }
    const onCancel = () => {
        setShowConfirm(0);
        setDefaultV("default")
    }
    // console.log(classes);
    return (
        <div>
            <Header />
            <div className="main-content">
                <Menu />
                <div className="right-part relative">
                    {showConfirm == 1 && <AlterConfirm message={confMessage} onCancel={onCancel} onConfirm={onConfirm} />}
                    <h2 className="page-name">Quản lí Lớp học</h2>
                    <div className="flex items-center my-2">
                        <button type="button" className="px-2 py-3 hover:bg-cyan-400 w-full border-2 border-e-0 border-black bg-white font-bold" onClick={() => _setShow(1)}>Học sinh mới</button>
                        <button type="button" className="px-2 py-3 hover:bg-cyan-400 w-full border-2 border-black bg-white font-bold" onClick={() => _setShow(2)}>Danh sách lớp</button>
                    </div>
                    {show == 1 &&
                        <div>
                            <h2 className="text-center font-bold text-2xl">Danh sách học sinh mới chưa xếp lớp</h2>
                            {newStudents.length > 0 || oLaiLop.length > 0 ? <div className="mx-auto w-full" style={{ maxWidth: '95%' }}>
                                <div className="flex justify-between">
                                    <p className="mb-2 font-semibold">Tổng số: {studentCount} Ban Tự nhiên: {TNCount} Ban Xã hội: {XHCount} </p>
                                    <div className="space-x-2">
                                        <button className="border-2 rounded-md px-2 border-blue-400 hover:bg-blue-100" onClick={() => _showForm(1)}>Xếp lớp</button>
                                    </div>
                                </div>
                                <table className="table-auto border-collapse mt-2 mb-2 w-full">
                                    <thead>
                                        <tr>
                                            <th className="border border-gray-400 p-2">STT</th>
                                            <th className="border border-gray-400 p-2">MSHS</th>
                                            <th className="border border-gray-400 p-2">Tên học sinh</th>
                                            <th className="border border-gray-400 p-2">Ngày Sinh</th>
                                            <th className="border border-gray-400 p-2">Giới tính</th>
                                            <th className="border border-gray-400 p-2">Quê quán</th>
                                            <th className="border border-gray-400 p-2">Dân tộc</th>
                                            <th className="border border-gray-400 p-2">Tôn Giáo</th>
                                            <th className="border border-gray-400 p-2">Địa chỉ</th>
                                            <th className="border border-gray-400 p-2">Số điện thoại</th>
                                            <th className="border border-gray-400 p-2">Ban</th>
                                            <th className="border border-gray-400 p-2">Lớp</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {newStudents.map((data, index) => (
                                            <tr key={index}>
                                                <td className="border border-gray-400 p-2">{index + 1}</td>
                                                <td className="border border-gray-400 p-2">{data.MSHS}</td>
                                                <td className="border border-gray-400 p-2">{data.HoTen}</td>
                                                <td className="border border-gray-400 p-2">{data.NgaySinh}</td>
                                                <td className="border border-gray-400 p-2">{data.GioiTinh}</td>
                                                <td className="border border-gray-400 p-2">{data.QueQuan}</td>
                                                <td className="border border-gray-400 p-2">{data.DanToc}</td>
                                                <td className="border border-gray-400 p-2">{data.TonGiao}</td>
                                                <td className="border border-gray-400 p-2">{data.DiaChi}</td>
                                                <td className="border border-gray-400 p-2">{data.SDT}</td>
                                                <td className="border border-gray-400 p-2">{data.ban.TenBan}</td>
                                                <td className="border border-gray-400 p-2">
                                                    <div className="flex justify-center">
                                                        <button
                                                            className="border-2 p-1 rounded-md border-blue-400 hover:bg-blue-200"
                                                            onClick={() => _showForm(2, data)}
                                                        >
                                                            Chọn lớp
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td className="border border-gray-400 p-2 text-2xl text-center" colSpan={12}>Học sinh ở lại lớp</td>
                                        </tr>
                                        {oLaiLop.map((data, index) => (
                                            <tr key={index}>
                                                <td className="border border-gray-400 p-2">{index + 1}</td>
                                                <td className="border border-gray-400 p-2">{data.hoc_sinh.MSHS}</td>
                                                <td className="border border-gray-400 p-2">{data.hoc_sinh.HoTen}</td>
                                                <td className="border border-gray-400 p-2">{data.hoc_sinh.NgaySinh}</td>
                                                <td className="border border-gray-400 p-2">{data.hoc_sinh.GioiTinh}</td>
                                                <td className="border border-gray-400 p-2">{data.hoc_sinh.QueQuan}</td>
                                                <td className="border border-gray-400 p-2">{data.hoc_sinh.DanToc}</td>
                                                <td className="border border-gray-400 p-2">{data.hoc_sinh.TonGiao}</td>
                                                <td className="border border-gray-400 p-2">{data.hoc_sinh.DiaChi}</td>
                                                <td className="border border-gray-400 p-2">{data.hoc_sinh.SDT}</td>
                                                <td className="border border-gray-400 p-2">{data.hoc_sinh.ban.TenBan}</td>
                                                <td className="border border-gray-400 p-2">
                                                    {checkHS(data) ?
                                                        <div className="flex justify-center">Đã xếp lớp</div>
                                                        :
                                                        <div className="flex justify-center">
                                                            <button
                                                                className="border-2 p-1 rounded-md border-blue-400 hover:bg-blue-200"
                                                                onClick={() => _showForm(3, data)}
                                                            >
                                                                Chọn lớp
                                                            </button>
                                                        </div>
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div> :
                                <div className="text-center mt-3 text-2xl text-red-700">Hiện không có học sinh chưa xếp lớp</div>}
                        </div>
                    }
                    {showForm == 2 &&
                        <div className="w-[50%] p-3 border-2 border-slate-400 rounded bg-slate-100 absolute top-64 left-[25%]">
                            <button className="absolute top-0 right-0 me-2 text-red-700 border px-2 mt-2 hover:border-red-600" onClick={() => _showForm(0)}>X</button>
                            <button className="button border-blue-500 hover:bg-blue-300" onClick={() => SelectClass(selected.MSHS)}>Lưu</button>
                            <table className="table-auto border-collapse mt-2 mb-2 w-full">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-400 p-2">MSHS</th>
                                        <th className="border border-gray-400 p-2">Tên học sinh</th>
                                        <th className="border border-gray-400 p-2">Ban</th>
                                        <th className="border border-gray-400 p-2">Lớp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-400 p-2">{selected.MSHS}</td>
                                        <td className="border border-gray-400 p-2">{selected.HoTen}</td>
                                        <td className="border border-gray-400 p-2">{selected.ban.TenBan}</td>
                                        <td className="border border-gray-400 p-2">
                                            <div className="flex justify-center">
                                                <select name="lop" className="rounded-md bg-amber-50 shadow-md p-1" ref={selectedClass}>
                                                    {selected.ban.MaBan == "TN" ? classTN.map((lop) => (
                                                        <option key={lop.MaLop} value={lop.MaLop}>{lop.TenLop}</option>
                                                    ))
                                                        :
                                                        classXH.map((lop) => (
                                                            <option key={lop.MaLop} value={lop.MaLop}>{lop.TenLop}</option>
                                                        ))}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    }
                    {showForm == 3 &&
                        <div className="w-[50%] p-3 border-2 border-slate-400 rounded bg-slate-100 absolute top-64 left-[25%]">
                            <button className="absolute top-0 right-0 me-2 text-red-700 border px-2 mt-2 hover:border-red-600" onClick={() => _showForm(0)}>X</button>
                            <button className="button border-blue-500 hover:bg-blue-300" onClick={() => SelectClass(selected.MSHS)}>Lưu</button>
                            <table className="table-auto border-collapse mt-2 mb-2 w-full">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-400 p-2">MSHS</th>
                                        <th className="border border-gray-400 p-2">Tên học sinh</th>
                                        <th className="border border-gray-400 p-2">Ban</th>
                                        <th className="border border-gray-400 p-2">Lớp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-400 p-2">{selected.hoc_sinh.MSHS}</td>
                                        <td className="border border-gray-400 p-2">{selected.hoc_sinh.HoTen}</td>
                                        <td className="border border-gray-400 p-2">{selected.hoc_sinh.ban.TenBan}</td>
                                        <td className="border border-gray-400 p-2">
                                            <div className="flex justify-center">
                                                <select name="lop" className="rounded-md bg-amber-50 shadow-md" required ref={selectedClass}>
                                                    {selected.hoc_sinh.ban.MaBan == "TN" ? classTN.filter(item => item.MaKhoi == selected.lop.MaKhoi).map((lop) => (
                                                        <option key={lop.MaLop} value={lop.MaLop}>{lop.TenLop}</option>
                                                    ))
                                                        :
                                                        classXH.filter(item => item.MaKhoi == selected.lop.MaKhoi).map((lop) => (
                                                            <option key={lop.MaLop} value={lop.MaLop}>{lop.TenLop}</option>
                                                        ))}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    }
                    {show == 2 &&
                        <div>
                            <h2 className="text-center font-bold text-2xl mb-2">Danh sách lớp</h2>
                            <div className="mx-auto" style={{ maxWidth: '95%' }}>
                                <div className="mx-auto mb-3 space-x-2">
                                    <button type="button" className="px-2 py-1 mt-1 rounded hover:bg-blue-300 shadow-lg border-2 border-slate-500" onClick={fetchClass}>Tất cả</button>
                                    <button type="button" className="px-2 py-1 mt-1 rounded hover:bg-blue-300 shadow-lg border-2 border-slate-500" onClick={getClassNow}>Hiện tại</button>
                                </div>
                                <div>
                                    {classes.map((classItem, index) => (
                                        <div key={index} className="bg-slate-200 p-3 border-2 mb-2">
                                            <div className="w-full flex justify-between">
                                                <h3 className="text-xl"><b>Mã lớp:</b> {classItem.MaLop} <b>Tên lớp:</b> {classItem.TenLop} <b>Niên Khóa:</b> {classItem.nien_khoa.TenNK} <b>Chủ Nhiệm:</b> {classItem.giao_vien.TenGV}</h3>
                                                <button
                                                    onClick={() => toggleTable(classItem.MaLop)}
                                                    className="border px-3 py-1 rounded hover:bg-gray-200"
                                                >
                                                    {visibleTables[classItem.MaLop] ? 'Ẩn danh sách' : 'Hiện danh sách'}
                                                </button>
                                            </div>
                                            {visibleTables[classItem.MaLop] &&
                                                <table className="table-auto border-collapse mt-2 mb-2 w-full bg-white">
                                                    <thead>
                                                        <tr>
                                                            <th className="border border-gray-400 p-2">STT</th>
                                                            <th className="border border-gray-400 p-2">MSHS</th>
                                                            <th className="border border-gray-400 p-2">Tên học sinh</th>
                                                            <th className="border border-gray-400 p-2">Ngày Sinh</th>
                                                            <th className="border border-gray-400 p-2">Giới tính</th>
                                                            <th className="border border-gray-400 p-2">Lớp</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {classItem.hoc_sinh.map((data, index) => (
                                                            <tr key={index}>
                                                                <td className="border border-gray-400 p-2">{index + 1}</td>
                                                                <td className="border border-gray-400 p-2 cursor-pointer text-blue-500" onClick={() => toStudentInfo(data.MSHS)}>{data.MSHS}</td>
                                                                <td className="border border-gray-400 p-2">{data.HoTen}</td>
                                                                <td className="border border-gray-400 p-2">{data.NgaySinh}</td>
                                                                <td className="border border-gray-400 p-2">{data.GioiTinh}</td>
                                                                <td className="border border-gray-400 p-2">
                                                                    <select className="w-full" value={defaultV} onChange={(e) => triggerConfirm(e, data, classItem.MaLop, classItem.TenLop)}>
                                                                        <option disabled value="default">{classItem.TenLop}</option>
                                                                        {listClass(classItem).map((item) => (
                                                                            <option key={item.MaLop} value={item.MaLop}>{item.TenLop}</option>
                                                                        ))}
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    }
                    {showForm == 1 &&
                        <div className="w-[50%] p-3 border-2 border-slate-400 rounded bg-slate-100 absolute top-64 left-[25%]">
                            <h1>Xếp lớp</h1>
                            <button className="absolute top-0 right-0 me-2 text-red-700 border px-2 mt-2 hover:border-red-600" onClick={() => _showForm(0)}>X</button>
                            <p className="mb-2">Tổng số: {studentCount} Ban Tự nhiên: {TNCount} Ban Xã hội: {XHCount}</p>
                            <Formik
                                initialValues={{
                                    'MaNK': '',
                                    'soLopTN': '',
                                    'soLopXH': '',
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                                enableReinitialize={true}
                            >
                                <Form className="">
                                    <div className="columns-3">
                                        <div>
                                            <Field as="select" name="MaNK" className="w-full border-2 rounded-md px-2 py-1" placeholder="Mã niên khóa">
                                                <option value='' defaultChecked disabled>Chọn niên khóa</option>
                                                {nienKhoaList.map((data) => (
                                                    <option key={data.MaNK} value={data.MaNK}>{data.TenNK}</option>
                                                ))}
                                            </Field>
                                            <ErrorMessage className="text-red-600" name="MaNK" component="p" />
                                        </div>
                                        <div>
                                            <Field type="number" name="soLopTN" className="form-input w-full border-2 rounded-md px-2 py-1" placeholder="Số lớp ban Tự Nhiên" />
                                            <ErrorMessage className="text-red-600" name="soLopTN" component="div" />
                                        </div>
                                        <div>
                                            <Field type="number" inputMode="numberic" name="soLopXH" className="form-input w-full border-2 rounded-md px-2 py-1" placeholder="Số lớp ban Xã Hội" />
                                            <ErrorMessage className="text-red-600" name="soLopXH" component="div" />
                                        </div>
                                    </div>
                                    <button className="border-2 rounded-md mt-2 px-2 py-1 border-blue-400 hover:bg-blue-100" type="submit">Xác nhận</button>
                                </Form>
                            </Formik>
                        </div>}
                </div>
            </div>
        </div>
    );
}