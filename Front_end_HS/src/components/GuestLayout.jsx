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
    const { message, setMessage } = useStateContext();
    const { userName, setUserName } = useUserContext();
    useEffect(() => {
    }, []);
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
            }, 3000);

            return () => clearTimeout(timer); // Cleanup timer on component unmount
        }
    }, [message]);
    if (userName) {
        return <Navigate to="/" />
    }
    const goToTop = () => {
        window.scrollTo(0, 0);
    }
    const handleSubmit = async (value) => {
        value.MSHS = value.MSHS.toUpperCase();
        try {
            const response = await axiosClient.post(`/tk/hs/login`,value);
            setUserName(response.data);
        } catch (error) {
            setMessage(error.response.data);
            console.log(error);
        }
    }
    const validationSchema = Yup.object({
        MSHS: Yup.string().required("Vui lòng nhập mã giáo viên"),
        password: Yup.string().required('Vui lòng nhập mật khẩu')
            .min(2, 'Mật khẩu có ít nhất 2 ký tự')
            .max(20, 'Mật khẩu có nhiều nhất 10 ký tự'),
    })
    return (
        <div className="mx-20 bg-amber-100 relative">
            {message && <div className="fixed bg-blue-600 text-white w-[90%] text-center py-3 rounded bottom-0 z-10 left-[5%]">{message}</div>}
            <header className="bg-cyan-400 py-2 rounded header">
                <p className="text-center text-2xl">Hệ thống quản lí <br /> Trường THPT Cần Thơ</p>
            </header>
            <div className="main-content">
                <Formik
                    initialValues={{
                        MSHS: '',
                        password: ''
                    }}
                    validationSchema={validationSchema}
                    enableReinitialize={true}
                    onSubmit={handleSubmit}
                >
                    <Form className="flex items-center justify-center min-[60vh] w-[50%] mx-auto">
                        <div className="w-full max-w-lg p-8 space-y-4 bg-white rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold text-center">Đăng nhập</h2>
                            <div className="space-y-6">
                                <div className="w-[70%] mx-auto">
                                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="MSHS">
                                        Mã số học sinh
                                    </label>
                                    <Field
                                        type="text"
                                        name="MSHS"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <ErrorMessage className="text-red-700 block mb-2" name="MSHS" component="div" />
                                </div>
                                <div className="w-[70%] mx-auto">
                                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="password">
                                        Mật khẩu
                                    </label>
                                    <Field
                                        type="password"
                                        name="password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <ErrorMessage className="text-red-700 block mb-2" name="password" component="div" />
                                </div>
                                <button
                                    type="submit"
                                    className="f-button"
                                >
                                    Đăng nhập
                                </button>
                            </div>
                        </div>
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