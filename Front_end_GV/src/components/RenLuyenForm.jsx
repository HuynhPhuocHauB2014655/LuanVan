import React from 'react';
import { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AlterConfirm from './Confirm';
const RenLuyenForm = ({ initialValues, handler, showForm, disable }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const formRef = useRef();
    const onConfirm = () => {
        setShowConfirm(0);
        formRef.current.submitForm();
    }
    const onCancel = () => {
        setShowConfirm(0);
    }
    const handleSubmit = (value) => {
        if (handler) {
            handler(value);
        }
    }
    return (
        <div>
            <div className="border-2 border-black rounded-lg bg-white">
                <div className="absolute top-0 right-0">
                    <button className="X-button" onClick={() => showForm(0)}>X</button>
                </div>
                <div className="drag-handle cursor-move p-2 text-center text-xl border-b-2 border-slate-100 text-white bg-slate-400">Xét rèn luyện</div>
                <div className="p-4">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={
                            Yup.object().shape({
                                MSHS: Yup.string().required('Bắt buộc'),
                                RenLuyen: Yup.string().required('Bắt buộc'),
                                LoaiRL: Yup.string().required('Bắt buộc'),
                            })
                        }
                        enableReinitialize={true}
                        onSubmit={handleSubmit}
                        innerRef={formRef}
                    >
                        <Form className="flex items-center justify-center">
                            <div className="w-full max-w-lg p-3 space-y-4">
                                <div className="grid grid-cols-1 grid-flow-row">
                                    <div className="w-[80%] mx-auto">
                                        <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="MSHS">
                                            Mã học sinh
                                        </label>
                                        <Field
                                            type="text"
                                            name="MSHS"
                                            className="f-field"
                                            placeholder="Nhập mã học sinh"
                                            disabled={disable}
                                        />
                                        <ErrorMessage className="text-red-700 block mb-2" name="MSHS" component="div" />
                                    </div>
                                    <div className="w-[80%] mx-auto">
                                        <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="RenLuyen">
                                            Đánh giá rèn luyện
                                        </label>
                                        <Field
                                            as="select"
                                            name="RenLuyen"
                                            className="f-field"
                                        >
                                            <option value="">Chọn đánh giá</option>
                                            <option value="1">Chưa đạt</option>
                                            <option value="2">Đạt</option>
                                            <option value="3">Khá</option>
                                            <option value="4">Tốt</option>
                                        </Field>
                                        <ErrorMessage className="text-red-700 block mb-2" name="RenLuyen" component="div" />
                                    </div>
                                    <div className="w-[80%] mx-auto">
                                        <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="LoaiRL">
                                            Học kì
                                        </label>
                                        <Field
                                            as="select"
                                            name="LoaiRL"
                                            className="f-field"
                                            disabled={disable}
                                        >
                                            <option value="">Chọn học kì</option>
                                            <option value="1">Học kì 1</option>
                                            <option value="2">Học kì 2</option>
                                            <option value="3">Rèn luyện hè</option>
                                        </Field>
                                        <ErrorMessage className="text-red-700 block mb-2" name="LoaiRL" component="div" />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="f-button"
                                    onClick={() => setShowConfirm(1)}
                                >
                                    Lưu
                                </button>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
            {showConfirm === 1 &&
                <AlterConfirm message={'Bạn có chắc chắn với thao tác này không?'} onConfirm={onConfirm} onCancel={onCancel} />
            }
        </div>
    )
}

export default RenLuyenForm;