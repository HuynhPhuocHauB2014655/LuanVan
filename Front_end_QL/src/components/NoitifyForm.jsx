import React from 'react';
import { useRef, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
const NotifyForm = ({ handleSubmit, close }) => {
    return (
        <Formik
            initialValues={{
                NguoiNhan: '',
                NoiDung: '',
                TieuDe: '',
            }}
            validationSchema={Yup.object().shape({
                NguoiNhan: Yup.string().required('Không được bỏ trống'),
                NoiDung: Yup.string(),
                TieuDe: Yup.string().required('Không được bỏ trống'),
            })}
            onSubmit={handleSubmit}
        >
            <Form className='z-20 absolute w-[80%] border-2 border-black h-[60vh] top-[10%] left-[10%] bg-white p-2 rounded-lg'>
                <button type='button' onClick={close} className='top-0 right-0 absolute px-1 hover:text-red-400'><FontAwesomeIcon icon={faX}/></button>
                <div >
                    <Field type="text" name="NguoiNhan" placeholder="Người nhận;..." className="w-full p-2 outline-none border-t-0 border-s-0 border-e-0 rounded-none"/>
                    <ErrorMessage className="text-red-700 text-xs p-2 text-end" name="NguoiNhan" component="div" />
                </div>
                <div >
                    <Field type="text" name="TieuDe" placeholder="Tiêu đề" className='w-full p-2 outline-none border-t-0 border-s-0 border-e-0 rounded-none'/>
                    <ErrorMessage className="text-red-700 text-xs p-2 text-end" name="TieuDe" component="div" />
                </div>
                <div className='h-[55%]'>
                    <Field as="textarea" name="NoiDung" placeholder="Nội dung" className='w-full resize-none outline-none p-2 h-full'/>
                    <ErrorMessage className="text-red-700 text-xs p-2 text-end" name="NoiDung" component="div" />
                </div>
                <button type='submit' className='button border-blue-500 hover:bg-blue-300 hover:text-white absolute bottom-1'>Gửi</button>
                <div className='absolute bottom-1 right-1 text-sm'>*Toàn trường: TT, Toàn Giáo viên: GV, Toàn Học sinh: HS</div>
            </Form>
        </Formik>
    )
}
export default NotifyForm;