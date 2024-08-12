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
    const { maBaoMat, setMaBaoMat } = useUserContext();
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
    if(maBaoMat){
        return <Navigate to="/home"/>
    }
    const goToTop = () => {
        window.scrollTo(0, 0);
    }
    const handleSubmit = async (value) => {
        try {
            const response = await axiosClient.get(`/tk/adminLogin/${value.maBaoMat}`);
            setMessage(response.data);
            setMaBaoMat(true);
        }catch(error){
            setMessage(error.response.data);
            console.log(error);
        }
    }
    const validationSchema = Yup.object({
        maBaoMat: Yup.string().required('Vui lòng nhập mã bảo mật')
            .min(2, 'Mã bảo mật có ít nhất 2 ký tự')
            .max(10, 'Mã bảo mật có nhiều nhất 10 ký tự'),
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
                        maBaoMat: '',
                    }}
                    validationSchema={validationSchema}
                    enableReinitialize={true}
                    onSubmit={handleSubmit}
                >
                    <Form className="border-2 rounded w-[30%] flex justify-center m-auto text-center py-10 border-cyan-500 bg-slate-50">
                        <div className="columns-1">
                            <label htmlFor="maBaoMat" className="mb-3 block text-xl font-serif text-blue-500">Nhập mã bảo mật</label>
                            <Field name="maBaoMat" type="password" className="rounded border-blue-500 block mb-3" />
                            <ErrorMessage className="text-red-700 block mb-2" name="maBaoMat" component="div" />
                            <button type="submit" className="button border-blue-400 hover:bg-cyan-300">Đăng nhập</button>
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