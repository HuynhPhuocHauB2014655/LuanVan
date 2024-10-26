import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import Menu from "../components/Menu";
import { useUserContext } from "../context/userContext";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useStateContext } from "../../../Front_end_QL/src/context/Context";

export default function Info() {
    const [info, setInfo] = useState({});
    const { userName } = useUserContext();
    const [show, setShow] = useState(false);
    const { message, setMessage, setError } = useStateContext();
    const fetchData = async () => {
        try {
            const response = await axiosClient.get(`/hs/show/${userName}`);
            setInfo(response.data);
        } catch (error) {
            console.log(error);
        }
    }
    const Show = (ishow) => {
        setShow(ishow);
    }
    useEffect(() => {
        fetchData();
    }, [])
    const hadelSubmit = async (value) => {
        const payload = {
            MSHS: userName,
            oldPassword: value.oldPassword,
            newPassword: value.newPassword,
        }
        try {
            const response = await axiosClient.put('/tk/update/hs', payload);
            setMessage(response.data);
            setShow(false);
        } catch (error) {
            setError(typeof error.response.data == 'string' ? error.response.data : 'Lỗi không xác định');
            console.log(error);
        }
    }
    console.log(info);
    return (
        <div className="main-content">
            <Menu />
            <div className="right-part">
                <h1 className="page-name">Thông tin cá nhân</h1>
                <button className="button mt-2 border-2 border-blue-400 hover:bg-blue-300" onClick={() => Show(!show)}>Đổi mật khẩu</button>
                <div className="w-[70%] mx-auto">
                    {show &&
                        <Formik
                            initialValues={{
                                oldPassword: "",
                                newPassword: "",
                                confirmPassword: "",
                            }}
                            validationSchema={Yup.object().shape({
                                oldPassword: Yup.string().required("Vui lòng nhập mật khẩu cũ")
                                    .min(2, "Mật khẩu phải có ít nhất 2 ký tự")
                                    .max(20, "Mật khẩu có nhiều nhất 20 ký tự"),
                                newPassword: Yup.string().required("Vui lòng nhập mật khẩu mới")
                                    .min(2, "Mật khẩu phải có ít nhất 2 ký tự")
                                    .max(20, "Mật khẩu có nhiều nhất 20 ký tự")
                                    .notOneOf([Yup.ref('oldPassword'), null], 'Mật khẩu mới không trùng với mật khẩu cũ'),
                                confirmPassword: Yup.string()
                                    .required("Vui lòng nhập xác nhận mật khẩu")
                                    .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu không khớp'),
                            })}
                            onSubmit={hadelSubmit}
                        >
                            <Form className="my-5 border-2 bg-white shadow-lg rounded-lg py-10 relative space-y-3">
                                <button
                                    type="button"
                                    onClick={() => Show(false)}
                                    className="absolute top-0 right-0 px-1 text-red-500 border-b border-red-500 border-s rounded-bl-lg">X</button>
                                <div className="grid grid-cols-1 md:grid-cols-3">
                                    <div className="w-2/3 md:w-[80%] mx-auto">
                                        <label className="f-label">Mật khẩu cũ</label>
                                        <Field type="password"
                                            name="oldPassword"
                                            className="f-field" />
                                        <ErrorMessage name="oldPassword" component="div" className="text-red-500" />
                                    </div>
                                    <div className="w-2/3 md:w-[80%] mx-auto">
                                        <label className="f-label">Mật khẩu mới</label>
                                        <Field type="password"
                                            name="newPassword"
                                            className="f-field" />
                                        <ErrorMessage name="newPassword" component="div" className="text-red-500" />
                                    </div>
                                    <div className="w-2/3 md:w-[80%] mx-auto">
                                        <label className="f-label">Mật khẩu mới</label>
                                        <Field type="password"
                                            name="confirmPassword"
                                            className="f-field" />
                                        <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />
                                    </div>
                                </div>
                                <div>
                                    <button className="f-button" type="submit">Sửa</button>
                                </div>
                            </Form>
                        </Formik>
                    }
                </div>
                <div className="text-xl flex justify-center mt-5">
                    <table className="w-[70%] border-collapse">
                        <tbody>
                            <tr className="border-b border-slate-400">
                                <td className="py-2 font-semibold text-gray-700">Mã số học sinh</td>
                                <td className="py-2 text-gray-900">{info.MSHS}</td>
                            </tr>
                            <tr className="border-b border-slate-400">
                                <td className="py-2 font-semibold text-gray-700">Họ và tên</td>
                                <td className="py-2 text-gray-900">{info.HoTen}</td>
                            </tr>
                            <tr className="border-b border-slate-400">
                                <td className="py-2 font-semibold text-gray-700">Số điện thoại</td>
                                <td className="py-2 text-gray-900">{info.SDT}</td>
                            </tr>
                            <tr className="border-b border-slate-400">
                                <td className="py-2 font-semibold text-gray-700">Ngày sinh</td>
                                <td className="py-2 text-gray-900">{info.NgaySinh}</td>
                            </tr>
                            <tr className="border-b border-slate-400">
                                <td className="py-2 font-semibold text-gray-700">Giới tính</td>
                                <td className="py-2 text-gray-900">{info.GioiTinh}</td>
                            </tr>
                            <tr className="border-b border-slate-400">
                                <td className="py-2 font-semibold text-gray-700">Quê quán</td>
                                <td className="py-2 text-gray-900">{info.QueQuan}</td>
                            </tr>
                            <tr className="border-b border-slate-400">
                                <td className="py-2 font-semibold text-gray-700">Địa chỉ</td>
                                <td className="py-2 text-gray-900">{info.DiaChi}</td>
                            </tr>
                            <tr className="border-b border-slate-400">
                                <td className="py-2 font-semibold text-gray-700">Lịch sử học tập</td>
                                <td className="py-2 text-gray-900">
                                    <div>
                                        {info.lop?.map((lop) => (
                                            <div key={lop.MaLop}>
                                                {lop.nien_khoa.TenNK} - {lop.TenLop}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="absolute bottom-0 right-1 text-sm">*Nếu thông tin có sai xót liên hệ với nhà trường để chỉnh sửa</div>
            </div>
        </div>
    )
}