import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useStateContext } from '../context/Context';
import axiosClient from '../axios-client';

const BangDiem = ({ hocSinh, loaiDiem, diemHK1,
    diemHK2, diemCN, show,
    _delete, _update, closeF
}) => {
    const [showEditForm, setShowEditForm] = useState(false);
    const [initialValues, setInitialValues] = useState({});
    const { nienKhoa } = useStateContext();
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
                <td key={i} className="bd-td-normal">-</td>
            ));
            return cells;
        } else {
            const cells = grades.map((data, index) => (
                data.Diem >= 0 ?
                    show == 2 ?
                        <td key={`other-grade-${student.MSHS}-${index}`} className="bd-td-edit" onClick={() => showEdit(data)}>
                            {data.MaMH == 'CB4' || data.MaMH == 'CB5' ? data.Diem == 0 ? "Chưa đạt" : "Đạt" : data.Diem}
                        </td> :
                        <td key={`other-grade-${student.MSHS}-${index}`} className="bd-td-normal">
                            {data.MaMH == 'CB4' || data.MaMH == 'CB5' ? data.Diem == 0 ? "Chưa đạt" : "Đạt" : data.Diem}
                        </td>
                    :
                    <td key={`other-grade-${student.MSHS}-${index}`} className="bd-td-normal">-
                    </td>
            ));
            for (let i = 0; i < emptyCellsCount; i++) {
                cells.push(<td key={`tx-empty-${student.MSHS}-${i + cells.length}`} className="bd-td-normal">-</td>);
            }
            return cells;
        }
    };

    const generateOtherCells = (grades, student) => {
        if (grades.length == 0) {
            const cells = loaiDiem.map((data) => (
                data.MaLoai != 'tx' && data.MaLoai != 'rlh' &&
                <td key={data.MaLoai} className="bd-td-normal">-
                </td>
            ))
            return cells;
        } else {
            return grades.map((data, index) => (
                data.Diem >= 0 ?
                    show == 2 ?
                        <td key={`other-grade-${student.MSHS}-${index}`} className="bd-td-edit" onClick={() => showEdit(data)}>
                            {data.MaMH == 'CB4' || data.MaMH == 'CB5' ? data.Diem == 0 ? "Chưa đạt" : "Đạt" : data.Diem}
                        </td> :
                        <td key={`other-grade-${student.MSHS}-${index}`} className="bd-td-normal">
                            {data.MaMH == 'CB4' || data.MaMH == 'CB5' ? data.Diem == 0 ? "Chưa đạt" : "Đạt" : data.Diem}
                        </td>
                    :
                    <td key={`other-grade-${student.MSHS}-${index}`} className="bd-td-normal">-
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
        setShowEditForm(false);
    }
    const deleteDiem = (id) => {
        if (_delete) {
            _delete(id);
        }
        setShowEditForm(false);
    }
    return (
        <div>
            <table className="w-full text-center table-auto border-collapse">
                <thead>
                    <tr className='bg-slate-200'>
                        <th className="py-3 px-2 border border-black"></th>
                        <th className="py-3 px-2 border border-black"></th>
                        <th className="py-3 px-2 border border-black"></th>
                        <th className="py-3 px-2 border border-black" colSpan={7}>Học kì I</th>
                        <th className="py-3 px-2 border border-black" colSpan={7}>Học kì II</th>
                        <th className="py-3 px-2 border border-black">Cả năm</th>
                    </tr>
                    <tr className='bg-slate-200'>
                        <th className="py-3 px-2 border border-black">STT</th>
                        <th className="py-3 px-2 border border-black text-start">Mã số học sinh</th>
                        <th className="py-3 px-2 border border-black text-start">Tên học sinh</th>
                        <th className="py-3 px-2 border border-black" colSpan={4}>Thường xuyên</th>
                        <th className="py-3 px-2 border border-black">Giữa kì</th>
                        <th className="py-3 px-2 border border-black">Cuối kì</th>
                        <th className="py-3 px-2 border border-black">TBHK1</th>
                        <th className="py-3 px-2 border border-black" colSpan={4}>Thường xuyên</th>
                        <th className="py-3 px-2 border border-black">Giữa kì</th>
                        <th className="py-3 px-2 border border-black">Cuối kì</th>
                        <th className="py-3 px-2 border border-black">TBHK2</th>
                        <th className="py-3 px-2 border border-black">TBCN</th>
                    </tr>
                </thead>
                <tbody>
                    {hocSinh.map((student, index) => {
                        const txGrades1 = diemHK1.filter((item) => item.MSHS === student.MSHS && item.MaLoai === "tx");
                        const txGrades2 = diemHK2.filter((item) => item.MSHS === student.MSHS && item.MaLoai === "tx");
                        const otherGrades1 = diemHK1.filter((item) => item.MSHS === student.MSHS && (item.MaLoai === "ck" || item.MaLoai === "gk"));
                        const otherGrades2 = diemHK2.filter((item) => item.MSHS === student.MSHS && (item.MaLoai === "ck" || item.MaLoai === "gk"));
                        const TBHK1 = diemHK1.find((item) => item.MSHS === student.MSHS && item.MaLoai === "tbhk1");
                        const TBHK2 = diemHK2.find((item) => item.MSHS === student.MSHS && item.MaLoai === "tbhk2");
                        const TBCN = diemCN.find((item) => item.MSHS === student.MSHS && item.MaLoai == 'tbcn');
                        const emptyTXCellsCount1 = 4 - (countTX1[student.MSHS] || 0);
                        const emptyTXCellsCount2 = 4 - (countTX2[student.MSHS] || 0);
                        return (
                            <tr key={student.MSHS} className="bg-slate-50">
                                <td className="bd-td-normal">{index + 1}</td>

                                <td className="bd-td-normal text-start">{student.MSHS}</td>

                                <td className="bd-td-normal text-start">{student.HoTen}</td>

                                {generateTXCells(txGrades1, emptyTXCellsCount1, student)}

                                {generateOtherCells(otherGrades1, student, )}

                                <td className="bd-td-normal">{TBHK1?.Diem >= 0 ? TBHK1?.MaMH == "CB4" || TBHK1?.MaMH == "CB5" ? TBHK1?.Diem == 0 ? "Chưa đạt" : "Đạt" : TBHK1.Diem : "-"}</td>

                                {generateTXCells(txGrades2, emptyTXCellsCount2, student)}

                                {generateOtherCells(otherGrades2, student)}

                                <td className="bd-td-normal">{TBHK2?.Diem >= 0 ? TBHK2?.MaMH == 'CB4' || TBHK2?.MaMH == 'CB5' ? TBHK2?.Diem == 0 ? "Chưa đạt" : "Đạt" : TBHK2.Diem : "-"}</td>
                                <td className="bd-td-normal">{TBCN?.Diem >= 0 ? TBCN?.MaMH == 'CB4' || TBCN?.MaMH == 'CB5' ? TBCN?.Diem == 0 ? "Chưa đạt" : "Đạt" : TBCN.Diem : "-"}</td>
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
                                        <option value="tx">Đánh giá thường xuyên</option>
                                        <option value="gk">Đánh giá giữa kì</option>
                                        <option value="ck">Đánh giá cuối kì</option>
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