import axiosClient from "../axios-client";
import React, { useEffect, useState } from 'react';
import { useStateContext } from "../context/alterContext";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
export default function Student() {
    const [datas, setDatas] = useState([]);
    const { setMessage } = useStateContext();
    const [showForm, setShowForm] = useState(0);
    const [type, setType] = useState(0);
    const [studentForm, setStudentForm] = useState({});
    const fetchData = async () => {
        try {
            const response = await axiosClient.get('/hs/index');
            setDatas(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const validationSchema = Yup.object({
        MaNK: Yup.string().required('Mã niên khóa không được bỏ trống'),
        HoTen: Yup.string().required('Họ và tên không được bỏ trống'),
        NgaySinh: Yup.string().required('Ngày sinh không được bỏ trống'),
        GioiTinh: Yup.string().required('Giới tính không được bỏ trống'),
        QueQuan: Yup.string().required('Quê quán không được bỏ trống'),
        DanToc: Yup.string().required('Dân Tộc không được bỏ trống'),
        TonGiao: Yup.string().required('Tôn Giáo không được bỏ trống'),
        DiaChi: Yup.string().required('Địa chỉ không được bỏ trống'),
        SDT: Yup.string().required('Số điện thoại không được bỏ trống'),
        MaBan: Yup.string().required('Ban không được bỏ trống'),
    });
    const handleSubmit = async (values) => {

        if (confirm("Bạn có chắc với hành động này?")) {
            if (showForm === 2) {
                values.MSHS = studentForm.MSHS;
                const updated = { ...values };
                delete updated["MaNK"];
                try {
                    await axiosClient.put('/hs/update/' + values.MSHS, updated);
                    setMessage('Đã sửa học sinh thành công');
                    fetchData();
                    showFormStudent(0);
                } catch (error) {
                    console.error('Error submitting form:', error);
                    setMessage('Có lỗi trong quá trình sửa học sinh');
                }
            } else {
                try {
                    var soHocSinh = 0;
                    if (datas.length > 0) {
                        const lastStudent = await axiosClient.get('/hs/last');
                        soHocSinh = parseInt(lastStudent.data.substring(6, 9),10) + 1;
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
                    fetchData();
                    showFormStudent(0);
                } catch (error) {
                    console.error('Error submitting form:', error);
                    setMessage('Có lỗi trong quá trình thêm học sinh');
                }
            }
        }
    };
    const deleteStudent = async (mshs) => {
        if (confirm("Bạn có chắc chắn với hành động này?")) {
            try {
                await axiosClient.delete('/hs/delete/' + mshs);
                setMessage('Đã xóa học sinh thành công');
                fetchData();
                showFormStudent(0);
            } catch (error) {
                console.error('Error submitting form:', error);
                setMessage('Có lỗi trong quá trình xóa học sinh');
            }
        }
    };
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
            });
        } else {
            setStudentForm({});
        }
        setShowForm(isShow);
    }
    useEffect(() => {
        fetchData();
    }, []);
    const search = async () => {
        const searchValue = document.getElementById('search').value;
        try {
            const response = await axiosClient.get('/hs/show/' + searchValue);
            setDatas([response.data]);
        } catch (error) {
            console.error('Error searching data:', error);
            setMessage(error.response.data.message);
        }
    }
    return (
        <div className="main-content relative">
            {showForm != 0 &&
                <div className="absolute z-10 w-[70%] left-[15%] top-[20%] bg-sky-300 p-5">
                    <button className="absolute top-0 right-0 me-2 text-red-700 border px-2 mt-2 hover:border-red-600" onClick={() => showFormStudent(0)}>X</button>
                    <h1 className="text-center mb-3 text-2xl font-semibold">Thêm học sinh</h1>
                    <Formik
                        initialValues={{
                            MaNK: '',
                            HoTen: '',
                            NgaySinh: '',
                            GioiTinh: '',
                            QueQuan: '',
                            DanToc: '',
                            TonGiao: '',
                            DiaChi: '',
                            SDT: '',
                            MaBan: 'TN',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize={true}
                    >
                        {({ setValues }) => {
                            useEffect(() => {
                                if (Object.keys(studentForm).length > 0) {
                                    setValues(studentForm);
                                }
                            }, [studentForm, setValues]);
                            return (
                                <Form className="relative">
                                    <div className="columns-2 gap-3">
                                        <Field type="text" name="MaNK" className="w-full mb-1 rounded form-input" placeholder="Mã niên khóa" />
                                        <ErrorMessage className="text-red-600" name="MaNK" component="div" />

                                        <Field type="text" name="HoTen" className="w-full mb-1 rounded form-input" placeholder="Họ và tên" />
                                        <ErrorMessage className="text-red-600" name="HoTen" component="div" />

                                        <Field type="text" name="NgaySinh" className="w-full mb-1 rounded form-input" placeholder="Ngày sinh" />
                                        <ErrorMessage className="text-red-600" name="NgaySinh" component="div" />

                                        <Field type="text" name="GioiTinh" className="w-full mb-1 rounded form-input" placeholder="Giới tính" />
                                        <ErrorMessage className="text-red-600" name="GioiTinh" component="div" />

                                        <Field type="text" name="QueQuan" className="w-full mb-1 rounded form-input" placeholder="Quê quán" />
                                        <ErrorMessage className="text-red-600" name="QueQuan" component="div" />

                                        <Field type="text" name="DanToc" className="w-full mb-1 rounded form-input" placeholder="Dân Tộc" />
                                        <ErrorMessage className="text-red-600" name="DanToc" component="div" />

                                        <Field type="text" name="TonGiao" className="w-full mb-1 rounded form-input" placeholder="Tôn Giáo" />
                                        <ErrorMessage className="text-red-600" name="TonGiao" component="div" />

                                        <Field type="text" name="DiaChi" className="w-full mb-1 rounded form-input" placeholder="Địa chỉ" />
                                        <ErrorMessage className="text-red-600" name="DiaChi" component="div" />

                                        <Field type="text" name="SDT" className="w-full mb-1 rounded form-input" placeholder="Số điện thoại" />
                                        <ErrorMessage className="text-red-600" name="SDT" component="div" />

                                        <Field as="select" name="MaBan" className="form-select w-full">
                                            <option value="TN">Tự nhiên</option>
                                            <option value="XH">Xã hội</option>
                                        </Field>
                                        <ErrorMessage className="text-red-600" name="ban" component="div" />
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
            <h2 className="text-2xl font-bold text-center border-b-2 border-cyan-400 py-3">Quản lí học sinh</h2>
            <div className="mt-1 flex justify-between">
                <div>
                    <button className="px-2 border-2 border-green-400 rounded bg-white hover:bg-green-400 me-2" onClick={fetchData}>Tất cả</button>
                    <button className="px-2 border-2 border-blue-400 rounded bg-white hover:bg-blue-400" onClick={() => showFormStudent(1)}>Thêm học sinh</button>
                </div>
                <div className="me-3">
                    <input type="text" id="search" className="form-input rounded h-9" placeholder="Nhập mã số học sinh" />
                    <button onClick={search} className="px-2 py-1 border-2 rounded bg-white border-black ms-1 hover:border-blue-500"><FontAwesomeIcon icon={faSearch} color="blue" /></button>
                </div>
            </div>
            <table className="table-fixed border-collapse mt-2 mx-auto">
                <thead>
                    <tr>
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
                        <th className="border border-gray-400 p-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {datas.map((data, index) => (
                        <tr key={index}>
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
                                <button className="px-2 py-1 border rounded bg-white border-black hover:border-sky-500" onClick={() => showFormStudent(2, data)}>Sửa</button>
                                <button type="button" className="ms-1 px-2 py-1 border rounded bg-white border-black hover:border-red-500" onClick={() => deleteStudent(data.MSHS)}>
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
