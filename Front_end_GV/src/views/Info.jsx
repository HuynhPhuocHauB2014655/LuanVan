import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import Menu from "../components/Menu";
import { useUserContext } from "../context/userContext";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useStateContext } from "../../../Front_end_QL/src/context/Context";
import Header from "../components/Header";

export default function Info() {
    const [info, setInfo] = useState({});
    const { userName } = useUserContext();
    const [show, setShow] = useState(false);
    const { message, setMessage, setError } = useStateContext();
    const fetchData = async () => {
        try {
            const response = await axiosClient.get(`/gv/show/${userName}`);
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
            MSGV: userName,
            oldPassword: value.oldPassword,
            newPassword: value.newPassword,
        }
        try {
            const response = await axiosClient.put('/tk/update/gv', payload);
            setMessage(response.data);
            setShow(false);
        } catch (error) {
            setError(typeof error.response.data == 'string' ? error.response.data : 'Lỗi không xác định');
            console.log(error);
        }
    }
    return (
        <div>
            <Header />
            <div className="main-content">
                <Menu />
                <div className="right-part relative">
                    <h1 className="page-name">Thông tin cá nhân</h1>
                    <button className="button mt-2 border-2 border-blue-400 hover:bg-blue-300" onClick={() => Show(!show)}>Đổi mật khẩu</button>
                    <div className="text-xl mt-5">
                        <div className="flex place-content-center">
                            <table className="w-[90%] border-collapse">
                                <tbody>
                                    <tr className=" bg-slate-200">
                                        <td className="p-4 font-semibold text-gray-700">Mã giáo viên</td>
                                        <td className="p-4 text-gray-900">{info.MSGV}</td>
                                    </tr>
                                    <tr className="">
                                        <td className="p-4 font-semibold text-gray-700">Họ và tên</td>
                                        <td className="p-4 text-gray-900">{info.TenGV}</td>
                                    </tr>
                                    <tr className=" bg-slate-200">
                                        <td className="p-4 font-semibold text-gray-700">Số điện thoại</td>
                                        <td className="p-4 text-gray-900">{info.SDT}</td>
                                    </tr>
                                    <tr className="">
                                        <td className="p-4 font-semibold text-gray-700">Ngày sinh</td>
                                        <td className="p-4 text-gray-900">{info.NgaySinh}</td>
                                    </tr>
                                    <tr className=" bg-slate-200">
                                        <td className="p-4 font-semibold text-gray-700">Giới tính</td>
                                        <td className="p-4 text-gray-900">{info.GioiTinh}</td>
                                    </tr>
                                    <tr className="">
                                        <td className="p-4 font-semibold text-gray-700">Địa chỉ</td>
                                        <td className="p-4 text-gray-900">{info.DiaChi}</td>
                                    </tr>
                                    <tr className=" bg-slate-200">
                                        <td className="p-4 font-semibold text-gray-700">Chuyên môn</td>
                                        <td className="p-4 text-gray-900">{info.mon_hoc?.TenMH || "Chưa có chuyên môn"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="text-sm mt-3 text-end">*Nếu thông tin có sai xót liên hệ với nhà trường để chỉnh sửa</div>
                    </div>
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
                                <Form className="mb-10 mt-5 border-2 bg-white shadow-lg rounded-lg py-10 relative space-y-3">
                                    <button
                                        type="button"
                                        onClick={() => Show(false)}
                                        className="absolute top-0 right-0 px-1 text-red-500 border-b border-red-500 border-s rounded-bl-lg">X</button>
                                    <div className="flex justify-center space-x-3">
                                        <div className="w-[30%]">
                                            <label className="f-label">Mật khẩu cũ</label>
                                            <Field type="password"
                                                name="oldPassword"
                                                className="f-field" />
                                            <ErrorMessage name="oldPassword" component="div" className="text-red-500" />
                                        </div>
                                        <div className="w-[30%]">
                                            <label className="f-label">Mật khẩu mới</label>
                                            <Field type="password"
                                                name="newPassword"
                                                className="f-field" />
                                            <ErrorMessage name="newPassword" component="div" className="text-red-500" />
                                        </div>
                                        <div className="w-[30%]">
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
                </div>
            </div>
        </div>
    )
}