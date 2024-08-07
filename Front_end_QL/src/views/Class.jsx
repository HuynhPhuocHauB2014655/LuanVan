import axiosClient from "../axios-client";
import React, { useEffect, useState } from 'react';
import { useStateContext } from "../context/alterContext";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
export default function Class() {
    const [classes, setClasses] = useState([]);
    const [show, setShow] = useState(0);
    const [newStudents, setNewStudents] = useState([]);
    const [studentCount, setStudentCount] = useState(0);
    const [TNCount, setTNCount] = useState(0);
    const [XHCount, setXHCount] = useState(0);
    const [showForm, setShowForm] = useState(0);
    const [nienKhoa, setNienKhoa] = useState([]);
    const { setMessage } = useStateContext();
    const [visibleTables, setVisibleTables] = useState({});
    const fetchNewStudent = async () => {
        try {
            const response = await axiosClient.get("/hs/new");
            setNewStudents(response.data);
            setStudentCount(response.data.length);
            setTNCount(response.data.filter(student => student.MaBan === 'TN').length);
            setXHCount(response.data.filter(student => student.MaBan === 'XH').length);
            const nienkhoa = await axiosClient.get("/nk/index");
            setNienKhoa(nienkhoa.data);
        } catch (error) {
            console.error(error);
        }
    }
    const fetchClass = async () => {
        try {
            const response = await axiosClient.get("/lop/list");
            setClasses(response.data);
        } catch (error) {
            console.error(error);
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
    const _showForm = (show) => {
        setShowForm(show);
    }
    const validationSchema = Yup.object({
        MaNK: Yup.string().required("Trường bắt buộc"),
        soLopTN: Yup.number()
            .min(Math.floor(TNCount / 10), `Số lớp tối thiểu ${Math.floor(TNCount / 10)}`)
            .max(10, "Số quá lớn")
            .integer("Số không hợp lệ")
            .required("Trường bắt buộc"),
        soLopXH: Yup.number()
            .min(Math.floor(XHCount / 10), `Số lớp tối thiểu ${Math.floor(XHCount / 10)}`)
            .max(10, "Số quá lớn")
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
            console.error(error);
        }
    }
    const toggleTable = (classId) => {
        setVisibleTables(prevState => ({
            ...prevState,
            [classId]: !prevState[classId]
        }));
    };
    return (
        <div className="main-content relative">
            <h2 className="text-2xl font-bold text-center border-b-2 border-cyan-400 py-3">Quản lí Lớp học</h2>
            <div className="flex justify-between">
                <div>
                    <button type="button" className="px-2 py-1 mt-1 hover:bg-cyan-300" onClick={() => _setShow(1)}>Học sinh mới</button>
                    <button type="button" className="px-2 py-1 mt-1 hover:bg-cyan-300" onClick={() => _setShow(2)}>Danh sách lớp</button>
                </div>
            </div>
            {show == 1 &&
                <div>
                    <h2 className="text-center font-bold text-2xl">Danh sách học sinh mới chưa xếp lớp</h2>
                    {newStudents.length > 0 ? <div className="mx-auto w-full" style={{ maxWidth: '90%' }}>
                        <div className="flex justify-between">
                            <p className="mb-2 font-semibold">Tổng số: {studentCount} Ban Tự nhiên: {TNCount} Ban Xã hội: {XHCount}</p>
                            <button className="border-2 rounded-md px-2 border-blue-400 hover:bg-blue-100" onClick={() => _showForm(1)}>Xếp lớp</button>
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
                                        {data.lop.TenLop ? (
                                            <td className="border border-gray-400 p-2">{data.lop.TenLop}</td>
                                        ) : (
                                            <td className="border border-gray-400 p-2">Chưa xếp</td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>:
                    <div className="text-center mt-3 text-2xl text-red-700">Hiện không có học sinh chưa xếp lớp</div>}
                </div>
            }
            {show == 2 &&
                <div>
                    <h2 className="text-center font-bold text-2xl">Danh sách lớp</h2>
                    <div>
                        {classes.map((classItem, index) => (
                            <div key={index} className="mx-auto w-full bg-slate-100 p-3 border-2 mb-2" style={{ maxWidth: '90%' }}>
                                <div className="w-full flex justify-between">
                                    <h3 className="text-xl">Lớp: {classItem.TenLop} Niên Khóa: {classItem.nien_khoa.TenNK}</h3>
                                    <button
                                        onClick={() => toggleTable(classItem.MaLop)}
                                        className="border px-3 py-1 rounded hover:bg-gray-200"
                                    >
                                        {visibleTables[classItem.MaLop] ? 'Ẩn danh sách' : 'Hiện danh sách'}
                                    </button>
                                </div>
                                {visibleTables[classItem.MaLop] && <table className="border-collapse mt-2 mx-auto mb-2 w-full">
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classItem.hoc_sinh.map((data, index) => (
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
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>}
                            </div>
                        ))}
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
                                    <Field as="select" name="MaNK" className="w-full" placeholder="Mã niên khóa">
                                        <option value='' defaultChecked disabled>Chọn niên khóa</option>
                                        {nienKhoa.map((data) => (
                                            <option key={data.MaNK} value={data.MaNK}>{data.TenNK}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage className="text-red-600" name="MaNK" component="p" />
                                </div>
                                <div>
                                    <Field type="number" name="soLopTN" className="form-input w-full" placeholder="Số lớp ban Tự Nhiên" />
                                    <ErrorMessage className="text-red-600" name="soLopTN" component="div" />
                                </div>
                                <div>
                                    <Field type="number" inputMode="numberic" name="soLopXH" className="form-input w-full" placeholder="Số lớp ban Xã Hội" />
                                    <ErrorMessage className="text-red-600" name="soLopXH" component="div" />
                                </div>
                            </div>
                            <button className="border-2 rounded-md mt-2 px-2 py-1 border-blue-400 hover:bg-blue-100" type="submit">Xác nhận</button>
                        </Form>
                    </Formik>
                </div>}
        </div>
    );
}