import { useLocation } from "react-router-dom";
import Menu from "../components/Menu";
import { useStateContext } from "../context/Context";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
export default function StudentInfo() {
    const location = useLocation();
    const { Mshs } = location.state || {};
    const { nienKhoa, setMessage, setError } = useStateContext();
    const [show, setShow] = useState(0);
    const [info, setInfo] = useState({});
    const [initialValues, setInitialValues] = useState({});
    const fetchData = async () => {
        const res = await axiosClient.get(`hs/show/${Mshs}`);
        setInfo(res.data);
    }
    useEffect(() => {
        fetchData();
    }, [Mshs]);
    const showForm = (value) => {
        if (value == 2) {
            const data = {
                TenCha: info.phu_huynh.TenCha,
                SDTCha: info.phu_huynh.SDTCha,
                TenMe: info.phu_huynh.TenMe,
                SDTMe: info.phu_huynh.SDTMe,
            }
            setInitialValues(data);
        } else {
            const data = {
                TenCha: '',
                SDTCha: '',
                TenMe: '',
                SDTMe: '',
            }
            setInitialValues(data);
        }
        setShow(value);
    }
    const handleSubmit = async (value) => {
        value.MSHS = Mshs;
        try {
            if (show == 1) {
                const res = await axiosClient.post('hs/ph', value);
                setMessage('Cập nhật thông tin thành công');
            }else{
                const res = await axiosClient.put('hs/ph', value);
                setMessage('Cập nhật thông tin thành công');
            }
        } catch (error) {
            setError(typeof error.response.data == 'string' ? error.response.data : 'Lỗi không xác định');
        } finally {
            fetchData();
            setShow(0);
        }
    }
    console.log(info);
    return (
        <div className="main-content">
            <Menu />
            <div className="right-part relative">
                <h1 className="page-name">Thông tin học sinh</h1>
                {info &&
                    <div className="w-[90%] mx-auto">
                        <div className="text-2xl font-semibold my-2 text-center">Học sinh</div>
                        <table className="table-fixed text-left text-xl w-full">
                            <tbody>
                                <tr>
                                    <th className="border border-gray-400 p-2">Mã số học sinh</th>
                                    <td className="border border-gray-400 p-2">{info.MSHS}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-400 p-2">Tên học sinh</th>
                                    <td className="border border-gray-400 p-2">{info.HoTen}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-400 p-2">Giới tính</th>
                                    <td className="border border-gray-400 p-2">{info.GioiTinh}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-400 p-2">Ngày sinh</th>
                                    <td className="border border-gray-400 p-2">{info.NgaySinh}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-400 p-2">Quê quán</th>
                                    <td className="border border-gray-400 p-2">{info.QueQuan}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-400 p-2">Dân tộc</th>
                                    <td className="border border-gray-400 p-2">{info.DanToc}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-400 p-2">Tôn giáo</th>
                                    <td className="border border-gray-400 p-2">{info.TonGiao}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-400 p-2">Địa chỉ</th>
                                    <td className="border border-gray-400 p-2">{info.DiaChi}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-400 p-2">Số điện thoại</th>
                                    <td className="border border-gray-400 p-2">{info.SDT}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="relative mt-3">
                            <div className="text-2xl font-semibold my-2 text-center">Phụ Huynh</div>
                            <div className="absolute left-0 top-0">
                                {info.phu_huynh ?
                                    <button className="button border-blue-500 hover:bg-blue-300 hover:text-white" onClick={() => showForm(2)}>Sửa Phụ huynh</button>
                                    :
                                    <button className="button border-blue-500 hover:bg-blue-300 hover:text-white" onClick={() => showForm(1)}>Thêm Phụ huynh</button>
                                }
                            </div>
                        </div>
                        {info.phu_huynh ?
                            <table className="table-fixed text-left text-xl w-full">
                                <tbody>
                                    <tr>
                                        <th className="border border-gray-400 p-2">Họ tên Cha:</th>
                                        <td className="border border-gray-400 p-2">{info.phu_huynh.TenCha}</td>
                                    </tr>
                                    <tr>
                                        <th className="border border-gray-400 p-2">Số điện thoại Cha:</th>
                                        <td className="border border-gray-400 p-2">{info.phu_huynh.SDTCha}</td>
                                    </tr>
                                    <tr>
                                        <th className="border border-gray-400 p-2">Họ tên Mẹ:</th>
                                        <td className="border border-gray-400 p-2">{info.phu_huynh.TenMe}</td>
                                    </tr>
                                    <tr>
                                        <th className="border border-gray-400 p-2">Số điện thoại Mẹ:</th>
                                        <td className="border border-gray-400 p-2">{info.phu_huynh.SDTMe}</td>
                                    </tr>
                                </tbody>
                            </table>
                            :
                            <div>
                                <div className="text-red-500 text-3xl">Chưa có thông tin</div>
                            </div>
                        }
                    </div>
                }
                {show != 0 &&
                    <div>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={
                                Yup.object().shape({
                                    TenCha: Yup.string().required('Tên cha không được để trống'),
                                    SDTCha: Yup.string().matches(/^\d{10}$/, 'Số điện thoại không hợp lệ.').required('Số điện thoại cha không được để trống'),
                                    TenMe: Yup.string().required('Tên mẹ không được để trống'),
                                    SDTMe: Yup.string().matches(/^\d{10}$/, 'Số điện thoại không hợp lệ.').required('Số điện thoại mẹ không được để trống')
                                })
                            }
                            onSubmit={handleSubmit}
                        >
                            <Form className="absolute border-2 border-blue-500 py-4 rounded-lg top-20 left-[10%] w-[80%] bg-white shadow-lg">
                                <button type='button' onClick={() => showForm(0)} className='top-0 right-0 absolute px-1 hover:text-red-400'><FontAwesomeIcon icon={faX} /></button>
                                <div className="w-1/2 mx-auto space-y-2">
                                    <div>
                                        <label className="text-xl font-medium" htmlFor="TenCha">Họ tên Cha:</label>
                                        <Field type="text" name="TenCha" className="w-full mb-1 rounded border-2 border-black p-2" placeholder="Nhập họ tên cha" />
                                        <ErrorMessage className="text-red-700" name="TenCha" component="div" />
                                    </div>
                                    <div>
                                        <label className="text-xl font-medium" htmlFor="SDTCha">Số điện thoại Cha:</label>
                                        <Field type="text" name="SDTCha" className="w-full mb-1 rounded border-2 border-black p-2" placeholder="Nhập số điện thoại cha" />
                                        <ErrorMessage className="text-red-700" name="SDTCha" component="div" />
                                    </div>
                                    <div>
                                        <label className="text-xl font-medium" htmlFor="TenMe">Họ tên Mẹ:</label>
                                        <Field type="text" name="TenMe" className="w-full mb-1 rounded border-2 border-black p-2" placeholder="Nhập họ tên mệ" />
                                        <ErrorMessage className="text-red-700" name="TenMe" component="div" />
                                    </div>
                                    <div>
                                        <label className="text-xl font-medium" htmlFor="SDTMe">Số điện thoại Mẹ:</label>
                                        <Field type="text" name="SDTMe" className="w-full mb-1 rounded border-2 border-black p-2" placeholder="Nhập số điện thoại mẹ" />
                                        <ErrorMessage className="text-red-700" name="SDTMe" component="div" />
                                    </div>
                                    <div className="w-1/2 mx-auto">
                                        <button type="submit" className="w-full border-2 rounded-md px-3 py-2 bg-blue-500 hover:bg-blue-700 hover:text-white">Lưu</button>
                                    </div>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                }
            </div>
        </div>
    )
}