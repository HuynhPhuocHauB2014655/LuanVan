import { ErrorMessage, Field, Formik, Form } from "formik";
import React from 'react';
import * as Yup from 'yup';
const AccountForm = ({ userName, submit }) => {
    const validationSchema = Yup.object({
        old_password: Yup.string()
            .required("Không đuọc bỏ trống")
            .min(5, "Mật khẩu tối thiểu 5 ký tự")
            .max(20, "Mật khẩu tối đa 20 ký tự"),
        new_password: Yup.string()
            .required("Không đuọc bỏ trống")
            .min(5, "Mật khẩu tối thiểu 5 ký tự")
            .max(20, "Mật khẩu tối đa 20 ký tự")
            .notOneOf([Yup.ref('old_maBaoMat')], 'Mật khẩu mới trùng với mã cũ'),
        confirm_password: Yup.string()
            .required('Không đuọc bỏ trống')
            .oneOf([Yup.ref('new_password'), null], 'Mật khẩu không khớp'),
        userName: Yup.string()
    })
    return (
        <Formik
            initialValues={{
                new_password: "",
                confirm_password: "",
                old_password: "",
                userName: userName
            }}
            validationSchema={validationSchema}
            onSubmit={submit}
        >
            <Form className="w-full space-y-3">
                <div className="">
                    <label className="font-bold text-lg" htmlFor="userName">Tên đăng nhập</label>
                    <Field type="text" name="userName" disabled className="outline-none border-none text-lg" />
                    <ErrorMessage name="userName" className="text-red-500 font-semibold" component="div" />
                </div>
                <div className="">
                    <label className="font-bold text-lg" htmlFor="old_password">Mật khẩu cũ</label>
                    <Field type="password" name="old_password" className="rounded w-full p-2 focus:outline-blue-500 focus:outline-offset-2" />
                    <ErrorMessage name="old_password" className="text-red-500 font-semibold" component="div" />
                </div>
                <div className="">
                    <label className="font-bold text-lg" htmlFor="new_password">Mật khẩu mới</label>
                    <Field type="password" name="new_password" className="rounded w-full p-2 focus:outline-blue-500 focus:outline-offset-2" />
                    <ErrorMessage name="new_password" className="text-red-500 font-semibold" component="div" />
                </div>
                <div className="">
                    <label className="font-bold text-lg" htmlFor="confirm_password">Xác nhận Mật khẩu</label>
                    <Field type="password" name="confirm_password" className="rounded w-full p-2 focus:outline-blue-500 focus:outline-offset-2" />
                    <ErrorMessage name="confirm_password" className="text-red-500 font-semibold" component="div" />
                </div>
                <div className="mx-auto md:w-2/3 w-full">
                    <button type="submit" className="py-1 border-2 border-blue-500 rounded-md px-6 hover:bg-blue-400 w-full">Đổi</button>
                </div>
            </Form>
        </Formik>
    )
}

export default AccountForm;