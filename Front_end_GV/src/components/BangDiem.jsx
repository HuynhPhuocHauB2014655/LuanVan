import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useStateContext } from '../context/Context';
import axiosClient from '../axios-client';

const BangDiem = ({ hocSinh, loaiDiem, diemHK1,
    diemHK2, diemCN, show,
    _delete, _update
}) => {
    const [showEditForm, setShowEditForm] = useState(false);
    const [initialValues, setInitialValues] = useState({});
    const { nienKhoa, setMessage } = useStateContext();
    const countTX1 = {};
    if (diemHK1.length > 0) {
        hocSinh.map((student) => {
            const count = diemHK1.filter((item) => item.MSHS === student.MSHS && item.MaLoai === 'tx').length;
            countTX1[student.MSHS] = count;
        });
    }
    const countTX2 = {};
    if (diemHK2.length > 0) {
        hocSinh.map((student) => {
            const count = diemHK2.filter((item) => item.MSHS === student.MSHS && item.MaLoai === 'tx').length;
            countTX2[student.MSHS] = count;
        });
    }
    const showEdit = (data) => {
        if (data) {
            setInitialValues({
                MSHS: data.MSHS,
                MaLoai: data.MaLoai,
                Diem: data.Diem,
                MaHK: data.MaHK,
                id: data.id,
                MaMH: data.MaMH
            })
        }
        setShowEditForm(!showEditForm);
    }
    const generateTXCells = (grades, emptyCellsCount, student) => {
        if (grades.length == 0) {
            const cells = [...Array(4)].map((_, i) => (
                <td key={i} className="bd-td-normal"></td>
            ));
            return cells;
        } else {
            const cells = grades.map((data, index) => (
                data.Diem ?
                    show == 2 ?
                        <td key={`other-grade-${student.MSHS}-${index}`} className="bd-td-edit" onClick={() => showEdit(data)}>
                            {data.Diem}
                        </td> :
                        <td key={`other-grade-${student.MSHS}-${index}`} className="bd-td-normal">
                            {data.Diem}
                        </td>
                    :
                    <td key={`other-grade-${student.MSHS}-${index}`} className="bd-td-normal">
                    </td>
            ));
            for (let i = 0; i < emptyCellsCount; i++) {
                cells.push(<td key={`tx-empty-${student.MSHS}-${i + cells.length}`} className="bd-td-normal"></td>);
            }
            return cells;
        }
    };

    const generateOtherCells = (grades, student) => {
        if (grades.length == 0) {
            const cells = loaiDiem.map((data) => (
                data.MaLoai != 'tx' &&
                <td key={data.MaLoai} className="bd-td-normal">
                </td>
            ))
            return cells;
        } else {
            return grades.map((data, index) => (
                data.Diem ?
                    show == 2 ?
                        <td key={`other-grade-${student.MSHS}-${index}`} className="bd-td-edit" onClick={() => showEdit(data)}>
                            {data.Diem}
                        </td> :
                        <td key={`other-grade-${student.MSHS}-${index}`} className="bd-td-normal">
                            {data.Diem}
                        </td>
                    :
                    <td key={`other-grade-${student.MSHS}-${index}`} className="bd-td-normal">
                    </td>
            ));
        }
    };
    const hocki = {
        "Học kì 1": 1 + nienKhoa.NienKhoa,
        "Học kì 2": 2 + nienKhoa.NienKhoa
    };
    const handleSubmitEdit = async (value) => {
        if (_update) {
            _update(value);
        }
    }
    const deleteDiem = (id) => {
        if (_delete) {
            _delete(id);
        }
    }
    return (
        <div>
            <table className="w-full text-center table-auto border border-black border-collapse">
                <thead>
                    <tr>
                        <th className="border border-black"></th>
                        <th className="border border-black"></th>
                        <th className="border border-black"></th>
                        <th className="border border-black" colSpan={7}>Học kì I</th>
                        <th className="border border-black" colSpan={7}>Học kì II</th>
                        <th className="border border-black">Cả năm</th>
                    </tr>
                    <tr>
                    <th className="border border-black">STT</th>
                        <th className="border border-black">Mã số học sinh</th>
                        <th className="border border-black">Tên học sinh</th>
                        {loaiDiem.map((data) => (
                            data.MaLoai === 'tx' ?
                                <th key={data.MaLoai} className="border border-black" colSpan={4}>
                                    {data.TenLoai}
                                </th>
                                :
                                <th key={data.MaLoai} className="border border-black">
                                    {data.TenLoai}
                                </th>
                        ))}
                        <th className="border border-black">Trung bình học kì 1</th>
                        {loaiDiem.map((data) => (
                            data.MaLoai === 'tx' ?
                                <th key={data.MaLoai} className="border border-black" colSpan={4}>
                                    {data.TenLoai}
                                </th>
                                :
                                <th key={data.MaLoai} className="border border-black">
                                    {data.TenLoai}
                                </th>
                        ))}
                        <th className="border border-black">Trung bình học kì 2</th>
                        <th className="border border-black">Trung bình cả năm</th>
                    </tr>
                </thead>
                <tbody>
                    {hocSinh.map((student,index) => {
                        const txGrades1 = diemHK1.filter((item) => item.MSHS === student.MSHS && item.MaLoai === "tx");
                        const txGrades2 = diemHK2.filter((item) => item.MSHS === student.MSHS && item.MaLoai === "tx");
                        const otherGrades1 = diemHK1.filter((item) => item.MSHS === student.MSHS && (item.MaLoai === "ck" || item.MaLoai === "gk") );
                        const otherGrades2 = diemHK2.filter((item) => item.MSHS === student.MSHS && (item.MaLoai === "ck" || item.MaLoai === "gk") );
                        const TBHK1 = diemHK1.find((item) => item.MSHS === student.MSHS && item.MaLoai === "tbhk1");
                        const TBHK2 = diemHK2.find((item) => item.MSHS === student.MSHS && item.MaLoai === "tbhk2");
                        const TBCN = diemCN.find((item) => item.MSHS === student.MSHS);
                        const emptyTXCellsCount1 = 4 - (countTX1[student.MSHS] || 0);
                        const emptyTXCellsCount2 = 4 - (countTX2[student.MSHS] || 0);
                        return (
                            <tr key={student.MSHS}>
                                <td className="bd-td-normal">{index+1}</td>

                                <td className="bd-td-normal">{student.MSHS}</td>

                                <td className="bd-td-normal text-start">{student.HoTen}</td>

                                {generateTXCells(txGrades1, emptyTXCellsCount1, student,)}

                                {generateOtherCells(otherGrades1, student, !TBHK1)}

                                <td className="bd-td-normal">{TBHK1?.Diem || ""}</td>

                                {generateTXCells(txGrades2, emptyTXCellsCount2, student,)}

                                {generateOtherCells(otherGrades2, student, !TBHK2)}

                                <td className="bd-td-normal">{TBHK2?.Diem || ""}</td>

                                <td className="bd-td-normal">{TBCN?.Diem || ""}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {showEditForm &&
                <Formik
                    initialValues={initialValues}
                    validationSchema={Yup.object().shape({
                        MSHS: Yup.string().required('Bắt buộc'),
                        Diem: Yup.number().typeError("Không đúng định dạng")
                            .required('Bắt buộc')
                            .min(0, "Điểm không hợp lệ")
                            .max(10, "Điểm không hợp lệ"),
                        MaHK: Yup.string().required('Bắt buộc'),
                        MaLoai: Yup.string().required('Bắt buộc'),
                    })}
                    enableReinitialize={true}
                    onSubmit={handleSubmitEdit}
                >
                    <Form className="flex items-center justify-center absolute z-10 w-1/2 left-1/4 top-60 bg-white border-2 border-black rounded-lg">
                        <div className="absolute top-0 right-0">
                            <button className="X-button" onClick={showEdit}>X</button>
                        </div>
                        <div className="w-full max-w-lg p-3 space-y-4">
                            <h2 className="text-2xl font-bold text-center underline underline-offset-8 decoration-4 decoration-blue-300">Nhập điểm</h2>
                            <div className="grid grid-rows-2 grid-flow-col">
                                <div className="w-[80%] mx-auto">
                                    <Field disabled={true}
                                        type="hidden"
                                        name="id"
                                        className="f-field"
                                    />
                                    <ErrorMessage className="text-red-700 block mb-2" name="id" component="div" />
                                </div>
                                <div className="w-[80%] mx-auto">
                                    <Field disabled={true}
                                        type="hidden"
                                        name="MaMH"
                                        className="f-field"
                                    />
                                    <ErrorMessage className="text-red-700 block mb-2" name="MaMH" component="div" />
                                </div>
                                <div className="w-[80%] mx-auto">
                                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="MSHS">
                                        Mã học sinh
                                    </label>
                                    <Field disabled={true}
                                        type="text"
                                        name="MSHS"
                                        className="f-field"
                                        placeholder="Nhập mã học sinh"
                                    />
                                    <ErrorMessage className="text-red-700 block mb-2" name="MSHS" component="div" />
                                </div>
                                <div className="w-[80%] mx-auto">
                                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="Diem">
                                        Điểm
                                    </label>
                                    <Field
                                        type="text"
                                        name="Diem"
                                        className="f-field"
                                        placeholder="Nhập mã điểm"
                                    />
                                    <ErrorMessage className="text-red-700 block mb-2" name="Diem" component="div" />
                                </div>
                                <div className="w-[80%] mx-auto">
                                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="MaHK">
                                        Học kì
                                    </label>
                                    <Field disabled={true}
                                        as="select"
                                        name="MaHK"
                                        className="f-field"
                                    >
                                        <option value="">Chọn học kì</option>
                                        <option value={hocki["Học kì 1"]}>Học kì 1</option>
                                        <option value={hocki["Học kì 2"]}>Học kì 2</option>
                                    </Field>
                                    <ErrorMessage className="text-red-700 block mb-2" name="MaHK" component="div" />
                                </div>
                                <div className="w-[80%] mx-auto">
                                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="MaLoai">
                                        Loại điểm
                                    </label>
                                    <Field disabled={true}
                                        as="select"
                                        name="MaLoai"
                                        className="f-field"
                                    >
                                        <option value="">Chọn loại điểm</option>
                                        {loaiDiem.map((data) => (
                                            <option key={data.MaLoai} value={data.MaLoai}>{data.TenLoai}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage className="text-red-700 block mb-2" name="MaLoai" component="div" />
                                </div>
                            </div>
                            <div className='flex justify-around w-[80%] mx-auto'>
                                <button
                                    type="submit"
                                    className="w-[30%] px-5 border-2 rounded-md py-1 border-blue-500 hover:bg-blue-400 hover:text-white"
                                >
                                    Lưu
                                </button>
                                <button
                                    type="button"
                                    className="w-[30%] px-5 border-2 rounded-md py-1 border-red-500 hover:bg-red-400 hover:text-white"
                                    onClick={() => deleteDiem(initialValues.id)}
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </Form>
                </Formik>
            }
        </div >
    )
}

export default BangDiem;