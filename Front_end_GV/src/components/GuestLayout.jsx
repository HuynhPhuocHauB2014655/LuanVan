import { Outlet, Link, Navigate } from "react-router-dom";
import axiosClient from "../axios-client"
import { useStateContext } from "../context/Context";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useUserContext } from "../context/userContext";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Header from "./Header";
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
        value.MSGV = value.MSGV.toUpperCase();
        try {
            const response = await axiosClient.post(`/tk/gv/login`,value);
            setUserName(response.data);
        } catch (error) {
            setMessage(error.response.data);
            console.log(error);
        }
    }
    const validationSchema = Yup.object({
        MSGV: Yup.string().required("Vui lòng nhập mã giáo viên"),
        MatKhau: Yup.string().required('Vui lòng nhập mật khẩu')
            .min(2, 'Mật khẩu có ít nhất 2 ký tự')
            .max(20, 'Mật khẩu có nhiều nhất 10 ký tự'),
    })
    return (
        <div className="bg-[#eceff8] relative">
            {message && <div className="fixed bg-blue-600 text-white w-[90%] text-center py-3 rounded bottom-0 z-10 left-[5%]">{message}</div>}
            <Header/>
            <div className="main-content">
                <Formik
                    initialValues={{
                        MSGV: '',
                        MatKhau: ''
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
                                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="MSGV">
                                        Mã giáo viên
                                    </label>
                                    <Field
                                        type="text"
                                        name="MSGV"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <ErrorMessage className="text-red-700 block mb-2" name="MSGV" component="div" />
                                </div>
                                <div className="w-[70%] mx-auto">
                                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="password">
                                        Mật khẩu
                                    </label>
                                    <Field
                                        type="password"
                                        name="MatKhau"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <ErrorMessage className="text-red-700 block mb-2" name="MatKhau" component="div" />
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
            <footer className="footer bg-white border-t-2 flex px-4 items-center">
                Copyright © Trường THPT Cần Thơ
            </footer>
            <button className="border-2 border-blue-600 px-3 py-1 text-2xl fixed bottom-1 right-1 rounded" onClick={goToTop}><FontAwesomeIcon icon={faArrowUp} color="blue" /></button>
        </div>
    )
}