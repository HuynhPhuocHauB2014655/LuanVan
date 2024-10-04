import { Outlet, Link, Navigate } from "react-router-dom";
import axiosClient from "../axios-client"
import { useStateContext } from "../context/Context";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useUserContext } from "../context/userContext";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
export default function GuestLayout() {
    const { message, setMessage,error, setError } = useStateContext();
    const { userName, setUserName } = useUserContext();
    useEffect(() => {
    }, []);
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message]);
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [error]);
    if (userName) {
        return <Navigate to="/" />
    }
    const goToTop = () => {
        window.scrollTo(0, 0);
    }
    const handleSubmit = async (value) => {
        try {
            const payload = {
                TaiKhoan: value.TaiKhoan,
                MatKhau: value.MatKhau,
            }
            const response = await axiosClient.post(`/tk/admin/login`,payload);
            setMessage("Đăng nhập thành công");
            setUserName(response.data);
        } catch (error) {
            setError(typeof error.response.data == 'string' ? error.response.data : 'Lỗi không xác định');
        }
    }
    const validationSchema = Yup.object({
        TaiKhoan: Yup.string().required('Vui lòng nhập tên tài khoản')
            .min(2, 'Mã bảo mật có ít nhất 2 ký tự')
            .max(20, 'Mã bảo mật có nhiều nhất 20 ký tự'),
        MatKhau: Yup.string().required('Vui lòng nhập mật khẩu')
            .min(2, 'Mật khẩu có ít nhất 2 ký tự')
            .max(20, 'Mật khẩu có nhiều nhất 20 ký tự'),
    })
    return (
        <div className="mx-20 bg-amber-100 relative">
            {message && <div className="fixed bg-blue-600 text-white w-[90%] text-center py-3 rounded bottom-0 z-10 left-[5%]">{message}</div>}
            {error && <div className="fixed bg-red-600 text-white w-[90%] text-center py-3 rounded bottom-0 z-10 left-[5%]">{error}</div>}
            <header className="bg-cyan-400 py-2 rounded header">
                <p className="text-center text-2xl">Hệ thống quản lí <br /> Trường THPT Cần Thơ</p>
            </header>
            <div className="main-content">
                <Formik
                    initialValues={{
                        TaiKhoan: '',
                        MatKhau: '',
                    }}
                    validationSchema={validationSchema}
                    enableReinitialize={true}
                    onSubmit={handleSubmit}
                >
                    <Form className="border-2 min-w-[30%] px-10 m-auto py-10 border-cyan-500 bg-white space-y-5 rounded">
                        <div className="text-center text-xl font-bold text-blue-400 border-b-2 pb-3 border-blue-200">Đăng nhập</div>
                        <div className="w-[70%] mx-auto space-y-2">
                            <label htmlFor="TaiKhoan" className="f-lable">Tên tài khoản</label>
                            <Field name="TaiKhoan" type="text" className="f-field" placeholder="Nhập tên tài khoản"/>
                            <ErrorMessage className="text-red-700 block mb-2" name="TaiKhoan" component="div" />
                        </div>
                        <div className="w-[70%] mx-auto space-y-2">
                            <label htmlFor="MatKhau" className="f-lable">Mật khẩu</label>
                            <Field name="MatKhau" type="password" className="f-field" placeholder="Nhập mật khẩu"/>
                            <ErrorMessage className="text-red-700 block mb-2" name="MatKhau" component="div" />
                        </div>
                        <button type="submit" disabled={(error || message) ? true : false } className="f-button">Đăng nhập</button>
                    </Form>
                </Formik>
            </div>
            <footer className="footer bg-cyan-200 rounded flex items-center justify-center">
                Footer
            </footer>
            <button className="border-2 border-blue-600 px-3 py-1 text-2xl fixed bottom-1 right-1 rounded" onClick={goToTop}><FontAwesomeIcon icon={faArrowUp} color="blue" /></button>
        </div>
    )
}