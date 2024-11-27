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
import AccountForm from "../components/AccountForm";
import Header from "../components/Header";
export default function Account() {
    const [time, setTime] = useState();
    const [showForm, setShowForm] = useState("");
    const [show, setShow] = useState(1);
    const { setMessage, setError } = useStateContext();
    const { userName, setUserName } = useUserContext();
    const navigate = useNavigate();
    const searchString = useRef("");
    const [searchResponse, setSearchResponse] = useState({});
    const [searchresult, setSearchresult] = useState(0);
    useEffect(() => {
        if (userName != "admin") {
            setError("Bạn không có quyền truy cập trang này");
            navigate('/');
        }
    }, [userName]);
    const checkTime = async () => {
        const today = new Date().getTime();
        let time = [];
        const admin = await axiosClient.get(`/tk/admin/check/admin`);
        let lastUpdate = new Date(admin.data).getTime();
        let diffTime = Math.abs(today - lastUpdate);
        let diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
        time.push({
            userName: "admin",
            time: diffDays
        });
        const daotao = await axiosClient.get(`/tk/admin/check/daotao`);
        lastUpdate = new Date(daotao.data).getTime();
        diffTime = Math.abs(today - lastUpdate);
        diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
        time.push({
            userName: "daotao",
            time: diffDays
        });
        const nhansu = await axiosClient.get(`/tk/admin/check/nhansu`);
        lastUpdate = new Date(nhansu.data).getTime();
        diffTime = Math.abs(today - lastUpdate);
        diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
        time.push({
            userName: "nhansu",
            time: diffDays
        });
        setTime(time);
    }
    const validationSchema = Yup.object({
        old_password: Yup.string()
            .required("Không đuọc bỏ trống")
            .min(5, "Mật khẩu tối thiểu 5 ký tự")
            .max(20, "Mật khẩu tối đa 20 ký tự"),
        password: Yup.string()
            .required("Không đuọc bỏ trống")
            .min(5, "Mật khẩu tối thiểu 5 ký tự")
            .max(20, "Mật khẩu tối đa 20 ký tự")
            .notOneOf([Yup.ref('old_maBaoMat')], 'Mật khẩu mới trùng với mã cũ'),
        confirm_password: Yup.string()
            .required('Không đuọc bỏ trống')
            .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp'),
    })
    const handlesubmit = async (value) => {
        try {
            const payload = {
                TaiKhoan: value.userName,
                old_password: value.old_password,
                new_password: value.new_password,
            }
            const response = await axiosClient.post(`/tk/update/admin`, payload);
            setMessage(response.data);
            if (userName == value.userName) {
                setUserName("");
                navigate("/login");
            }
            setShowForm("");

        } catch (error) {
            console.log(error);
            setError(error.response.data);
        }
        console.log(value);

    }
    const Show = (id) => {
        setSearchresult(0);
        setSearchResponse({});
        if (id == 1 && !time) {
            checkTime();
        }
        setShow(id);
    }
    useEffect(()=>{
        checkTime();
    },[])
    const searchGV = async () => {
        const search = searchString.current.value.toUpperCase();
        try {
            const response = await axiosClient.get(`/tk/gv/${search}`);
            setSearchResponse(response.data);
            setSearchresult(2);
            console.log(response);
        } catch (error) {
            console.log(error);
            if (error.response.data == "not found") {
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
            if (error.response.data == "not found") {
                setSearchresult(1);
            }
        }
    }
    function formatDay(day) {
        return moment(new Date(day)).format('DD/MM/YYYY');
    }
    const changePassHS = async (value) => {
        try {
            const payload = {
                "MSHS": value.MSGV,
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
                "MSGV": value.MSGV,
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
    console.log();
    return (
        <div>
            <Header />
            <div className="main-content">
                <Menu />
                <div className="right-part">
                    <h1 className="page-name">Quản lí Tài khoản</h1>
                    <div className="my-2 ">
                        <div className="flex justify-between">
                            <button
                                className="w-full button border-2 me-1 border-red-500 rounded-md hover:bg-red-400 hover:text-white button-animation"
                                onClick={() => Show(1)}
                            >
                                Đổi mật khẩu quản lí
                            </button>
                            <button
                                className="w-full button border-2 me-1 border-blue-500 rounded-md hover:bg-blue-400 hover:text-white button-animation"
                                onClick={() => Show(2)}
                            >
                                Tài khoản giáo viên
                            </button>
                            <button
                                className="w-full button border-2 me-1 border-blue-500 rounded-md hover:bg-blue-400 hover:text-white button-animation"
                                onClick={() => Show(3)}
                            >
                                Tài khoản học sinh
                            </button>
                        </div>
                        {show == 1 &&
                            <div className="m-5 space-y-5">
                                {time?.map((item) => (
                                    <div key={item.userName} className=" py-3 border-2 rounded-lg shadow-md bg-white p-3 md:flex justify-between">
                                        <div>
                                            <h1 className="text-lg font-bold">Tài khoản: {item.userName}</h1>
                                            <div className="">
                                                <p className="text-red-500 font-semibold">Chuyển đổi mật khẩu lần cuối: {item.time} ngày</p>
                                            </div>
                                            <button
                                                className={`p-2 border rounded border-red-500 mt-2 ${item.time > 30 && "hover:bg-red-500 hover:text-white"}`}
                                                disabled={item.time <= 30}
                                                onClick={showForm == item.userName ? () => setShowForm("") : () => setShowForm(item.userName)}
                                            >
                                                {showForm === item.userName ? "Hủy" : "Đổi mật khẩu"}
                                            </button>
                                        </div>
                                        <div className="md:flex-initial md:w-[60%]">
                                            {showForm == item.userName &&
                                                <AccountForm userName={item.userName} submit={handlesubmit} />
                                            }
                                        </div>
                                    </div>
                                ))}
                                <h1 className="text-red-500 font-semibold">Thời gian giữa 2 lần đổi mật khẩu là hơn 30 ngày</h1>
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
                                            className="px-2 py-1 border-2 rounded bg-white border-black ms-1 hover:border-blue-500"><FontAwesomeIcon icon={faSearch} color="blue" /></button>
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
                                        <input type="text" ref={searchString} className="rounded h-9" placeholder="Nhập vào mã số học sinh" />
                                        <button
                                            onClick={searchHS}
                                            className="px-2 py-1 border-2 rounded bg-white border-black ms-1 hover:border-blue-500"><FontAwesomeIcon icon={faSearch} color="blue" /></button>
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
                                            <div>Mã số học sinh : {searchResponse.MSHS}</div>
                                            <div>Tên học sinh: {searchResponse.hoc_sinh.HoTen}</div>
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
        </div>
    )
}