import { useState } from "react";
import axiosClient from "../axios-client";
import Menu from "../components/Menu";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useStateContext } from "../context/Context";
import { useUserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import { useEffect } from "react";
import moment from 'moment';
export default function Account() {
    const [time, setTime] = useState("");
    const [show, setShow] = useState(0);
    const { setMessage } = useStateContext();
    const { setMaBaoMat } = useUserContext();
    const navigate = useNavigate();
    const searchString = useRef("");
    const [searchResponse, setSearchResponse] = useState({});
    const [searchresult, setSearchresult] = useState(0);
    const checkTime = async () => {
        const response = await axiosClient.get("/tk/admin/check");
        const today = new Date().getTime();
        const lastUpdate = new Date(response.data).getTime();
        const diffTime = Math.abs(today - lastUpdate);
        const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
        setTime(diffDays);
        setShow(1);
    }
    const validationSchema = Yup.object({
        old_maBaoMat: Yup.string()
            .required("Không đuọc bỏ trống")
            .min(5, "Mã bảo mật tối thiểu 5 ký tự")
            .max(20, "Mã bảo mật tối đa 20 ký tự"),
        maBaoMat: Yup.string()
            .required("Không đuọc bỏ trống")
            .min(5, "Mã bảo mật tối thiểu 5 ký tự")
            .max(20, "Mã bảo mật tối đa 20 ký tự")
            .notOneOf([Yup.ref('old_maBaoMat')], 'Mã bảo mật mới trùng với mã cũ'),
        confirm_maBaoMat: Yup.string()
            .required('Không đuọc bỏ trống')
            .oneOf([Yup.ref('maBaoMat'), null], 'Mã bảo mật không khớp'),
    })
    const handlesubmit = async (value) => {
        try {
            const payload = {
                old_maBaoMat: value.old_maBaoMat,
                maBaoMat: value.maBaoMat,
            }
            const response = await axiosClient.post(`/tk/update/admin`, payload);
            setMessage(response.data);
            setMaBaoMat(false);
            navigate("/login");

        } catch (error) {
            console.log(error);
            setMessage(error.response.data);
        }

    }
    const Show = (id) => {
        setSearchresult(0);
        setSearchResponse({});
        setShow(id);
    }
    const searchGV = async () => {
        const search = searchString.current.value.toUpperCase();
        try {
            const response = await axiosClient.get(`/tk/gv/${search}`);
            setSearchResponse(response.data);
            setSearchresult(2);
            console.log(response);
        } catch (error) {
            console.log(error);
            if(error.response.data == "not found")
            {
                setSearchresult(1);
            }
        }
    }
    const searchHS = async () => {
        const search = searchString.current.value;
        try {
            const response = await axiosClient.get(`/tk/hs/${search}`);
            setSearchResponse(response.data);
            setSearchresult(2);
            console.log(response);
        } catch (error) {
            console.log(error);
            if(error.response.data == "not found")
            {
                setSearchresult(1);
            }
        }
    }
    function  formatDay(day){
        return moment(new Date(day)).format('DD/MM/YYYY');
    }
    const changePassHS = async (value) => {
        try {
            const payload = {
                "MSHS":value.MSGV,
                "password": value.password,
            }
            const response = await axiosClient.post("/tk/hs", payload);
            setSearchresult(0);
            setMessage(response.data);
        }
        catch (error) {
            console.log(error);
            setMessage(error.response.data);
        }
    }
    const changePassGV = async (value) => {
        try {
            const payload = {
                "MSGV":value.MSGV,
                "password": value.password,
            }
            const response = await axiosClient.post("/tk/gv", payload);
            setMessage(response.data);
            setSearchresult(0);
        }
        catch (error) {
            console.log(error);
            setMessage(error.response.data);
        }
    }
    return (
        <div className="main-content">
            <Menu />
            <div className="right-part">
                <h1 className="page-name">Quản lí Tài khoản</h1>
                <div className="my-2">
                    <button
                        className="button border-2 me-1 border-red-500 rounded-md hover:bg-red-400 hover:text-white button-animation"
                        onClick={checkTime}
                    >
                        Đổi mã bảo mật
                    </button>
                    <button
                        className="button border-2 me-1 border-blue-500 rounded-md hover:bg-blue-400 hover:text-white button-animation"
                        onClick={() => Show(2)}
                    >
                        Tài khoản giáo viên
                    </button>
                    <button
                        className="button border-2 me-1 border-blue-500 rounded-md hover:bg-blue-400 hover:text-white button-animation"
                        onClick={() => Show(3)}
                    >
                        Tài khoản học sinh
                    </button>
                    {show == 1 &&
                        <div className="h-[60vh] flex justify-center items-center">
                            <div className=" py-3 border-2 rounded-lg border-blue-700 shadow-md bg-slate-100 relative w-[50%]">
                                <div className="absolute top-0 right-0">
                                    <button className="px-1 border-s-2 border-b-2 rounded-bl-lg rounded-tr-lg border-red-500 text-red-900 hover:text-white hover:bg-red-500" onClick={() => Show(0)}>X</button>
                                </div>
                                {time <= 30 ?
                                    <div className="ms-5">
                                        <h1>Thời gian giữa 2 lần đổi mã bảo mật là hơn 30 ngày</h1>
                                        <p className="text-red-500 font-semibold">Chuyển đổi lần cuối: {time} ngày</p>
                                    </div>
                                    :
                                    <Formik
                                        initialValues={{
                                            maBaoMat: "",
                                            confirm_maBaoMat: "",
                                            old_maBaoMat: "",
                                        }}
                                        validationSchema={validationSchema}
                                        onSubmit={handlesubmit}
                                    >
                                        <Form className="w-1/2 mx-auto">
                                            <h1 className="text-center border-b-2 mb-4 text-xl font-semibold border-cyan-500">Đổi mã bảo mật</h1>
                                            <div className="form-group mb-2">
                                                <label className="form-label block" htmlFor="old_maBaoMat">Mã bảo mật cũ</label>
                                                <Field type="password" name="old_maBaoMat" className="rounded w-full" />
                                                <ErrorMessage name="old_maBaoMat" className="text-red-500" component="div" />
                                            </div>
                                            <div className="form-group mb-2">
                                                <label className="form-label block" htmlFor="maBaoMat">Mã bảo mật</label>
                                                <Field type="password" name="maBaoMat" className="rounded w-full" />
                                                <ErrorMessage name="maBaoMat" className="text-red-500" component="div" />
                                            </div>
                                            <div className="form--auto">
                                                <label className="form-label block" htmlFor="confirm_maBaoMat">Xác nhận mã bảo mật</label>
                                                <Field type="password" name="confirm_maBaoMat" className="rounded w-full" />
                                                <ErrorMessage name="confirm_maBaoMat" className="text-red-500" component="div" />
                                            </div>
                                            <div className="flex justify-center mt-2">
                                                <button type="submit" className="py-1 border-2 border-blue-500 rounded-md px-6 hover:bg-blue-400">Đổi</button>
                                            </div>
                                        </Form>
                                    </Formik>
                                }
                            </div>
                        </div>
                    }
                    {show == 2 &&
                        <div className="my-2 mx-3">
                            <div className="flex justify-between mb-2 pb-2">
                                <div className="mt-2 text-xl">Quản lí tài khoản giáo viên</div>
                                <div className="">
                                    <input type="text" ref={searchString} className="rounded h-9" placeholder="Nhập vào mã giáo viên" />
                                    <button
                                        onClick={searchGV}
                                        className="h-9 px-2 py-1 border rounded bg-white border-black ms-1 hover:border-blue-500"><FontAwesomeIcon icon={faSearch} color="blue" /></button>
                                </div>
                            </div>
                            {searchresult == 1 &&
                                <div className="flex justify-center mt-10 mb-2 pb-2">
                                    <div>Không tìm thấy kết quả</div>
                                </div>
                            }
                            {searchresult == 2 &&
                                <div className="flex justify-center mt-10 mb-2 pb-2 ">
                                    <div className="text-xl leading-10">
                                        <div>Mã số giáo viên: {searchResponse.MSGV}</div>
                                        <div>Tên giáo viên: {searchResponse.giao_vien.TenGV}</div>
                                        <div>Sửa đổi mật khẩu lần cuối: {formatDay(searchResponse.updated_at)}</div>
                                        <Formik
                                            initialValues={{
                                                password: "",
                                                confirm_password: "",
                                                MSGV: searchResponse.MSGV,
                                            }}
                                            validationSchema={Yup.object().shape({
                                                password: Yup.string().required('Mật khẩu không được để trống'),
                                                confirm_password: Yup.string().required('Xác nhận mật khẩu không được để trống')
                                                    .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp'),
                                            })}
                                            onSubmit={changePassGV}
                                        >
                                            <Form>
                                                <div className="">
                                                    <div className="flex justify-between">
                                                        <label htmlFor="password">Nhập mật khẩu:</label>
                                                        <Field type="password" name="password" className="h-9 rounded ms-2" />
                                                    </div>
                                                    <ErrorMessage name="password" className="text-red-500 text-sm" component="div" />
                                                </div>
                                                <div className="">
                                                    <div className="flex justify-between">
                                                        <label htmlFor="confirm_password">Nhập lại MK:</label>
                                                        <Field type="password" name="confirm_password" className="h-9 rounded ms-2" />
                                                    </div>
                                                    <ErrorMessage name="confirm_password" className="text-red-500 text-sm" component="div" />
                                                </div>
                                                <div className="flex justify-center mt-2">
                                                    <button type="submit" className="button text-lg border-blue-200 hover:bg-blue-400 hover:text-white">Xác nhận</button>
                                                </div>
                                            </Form>
                                        </Formik>
                                    </div>
                                </div>
                            }
                        </div>
                    }
                    {show == 3 &&
                        <div className="my-2 mx-3">
                            <div className="flex justify-between mb-2 pb-2">
                                <div className="mt-2 text-xl">Quản lí tài khoản học sinh</div>
                                <div className="">
                                    <input type="text" ref={searchString} className="rounded h-9" placeholder="Nhập vào mã giáo viên" />
                                    <button
                                        onClick={searchHS}
                                        className="h-9 px-2 py-1 border rounded bg-white border-black ms-1 hover:border-blue-500"><FontAwesomeIcon icon={faSearch} color="blue" /></button>
                                </div>
                            </div>
                            {searchresult == 1 &&
                                <div className="flex justify-center mt-10 mb-2 pb-2">
                                    <div>Không tìm thấy kết quả</div>
                                </div>
                            }
                            {searchresult == 2 &&
                                <div className="flex justify-center mt-10 mb-2 pb-2 ">
                                    <div className="text-xl leading-10">
                                        <div>Mã số giáo viên: {searchResponse.MSHS}</div>
                                        <div>Tên giáo viên: {searchResponse.hoc_sinh.HoTen}</div>
                                        <div>Sửa đổi mật khẩu lần cuối: {formatDay(searchResponse.updated_at)}</div>
                                        <Formik
                                            initialValues={{
                                                password: "",
                                                confirm_password: "",
                                                MSHS: searchResponse.MSHS,
                                            }}
                                            validationSchema={Yup.object().shape({
                                                password: Yup.string()
                                                    .required('Mật khẩu không được để trống')
                                                    .min(2, "Mật khẩu phải có ít nhất 2 ký tự")
                                                    .max(10, "Mật khẩu không được quá 10 ký tự"),
                                                confirm_password: Yup.string().required('Xác nhận mật khẩu không được để trống')
                                                    .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp'),
                                            })}
                                            onSubmit={changePassHS}
                                        >
                                            <Form>
                                                <Field type="hidden" name="MSHS" value={searchResponse.MSHS} />
                                                <div className="">
                                                    <div className="flex justify-between">
                                                        <label htmlFor="password">Nhập mật khẩu:</label>
                                                        <Field type="password" name="password" className="h-9 rounded ms-2" />
                                                    </div>
                                                    <ErrorMessage name="password" className="text-red-500 text-sm" component="div" />
                                                </div>
                                                <div className="">
                                                    <div className="flex justify-between">
                                                        <label htmlFor="confirm_password">Nhập lại MK:</label>
                                                        <Field type="password" name="confirm_password" className="h-9 rounded ms-2" />
                                                    </div>
                                                    <ErrorMessage name="confirm_password" className="text-red-500 text-sm" component="div" />
                                                </div>
                                                <div className="flex justify-center mt-2">
                                                    <button type="submit" className="button text-lg border-blue-200 hover:bg-blue-400 hover:text-white">Xác nhận</button>
                                                </div>
                                            </Form>
                                        </Formik>
                                    </div>
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}