import { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Loading from "../components/Loading";
import Menu from "../components/Menu";
import { useStateContext } from "../context/Context";
import { useUserContext } from "../context/userContext";
import axiosClient from "../axios-client";
import { useLocation } from "react-router-dom";
import HocSinhTable from "../components/HocSinhTable";
import BangDiem from "../components/BangDiem";

export default function ClassInfo() {
    const { userName } = useUserContext();
    const { nienKhoa, setMessage } = useStateContext();
    const [loading, setLoading] = useState(true);
    const [loaiDiem, setLoaiDiem] = useState([]);
    const [diemHK1, setDiemHK1] = useState([]);
    const [diemHK2, setDiemHK2] = useState([]);
    const [diemCN, setDiemCN] = useState([]);
    const [show, setShow] = useState(1);
    const [showButton, setShowButton] = useState(false);
    const [showForm, setShowForm] = useState(0);
    const [disableHK1, setDisableHK1] = useState(true);
    const [disableHK2, setDisableHK2] = useState(true);
    const [disableNH, setDisableNH] = useState(true);
    const [showConfirm, setShowConfrim] = useState(false);
    const [type, setType] = useState(0);
    const [data, setData] = useState();
    const [content, setContent] = useState("");
    const location = useLocation();
    const [maHK1, setMaHK1] = useState("");
    const [maHK2, setMaHK2] = useState("");
    const { classData } = location.state || {};

    useEffect(() => {
        const fetchLoaiDiem = async () => {
            try {
                const { data } = await axiosClient.get('/diem/loaidiem');
                setLoaiDiem(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLoaiDiem();
    }, [userName]);

    if (loading) {
        return <Loading />;
    }
    const fetchDiem = async () => {
        const payloadHK1 = { MaHK: 1 + nienKhoa.NienKhoa, MaLop: classData.MaLop, MaMH: classData.MaMH };
        const payloadHK2 = { MaHK: 2 + nienKhoa.NienKhoa, MaLop: classData.MaLop, MaMH: classData.MaMH };
        const payloadCN = { MaNK: nienKhoa.NienKhoa, MaLop: classData.MaLop, MaMH: classData.MaMH };

        try {
            const [diemHk1, diemHk2, diemCn] = await Promise.all([
                axiosClient.post("/diem/get", payloadHK1),
                axiosClient.post("/diem/get", payloadHK2),
                axiosClient.post("/diem/getCN", payloadCN)
            ]);
            setDiemHK1(diemHk1.data);
            setDiemHK2(diemHk2.data);
            setDiemCN(diemCn.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleShow = (view) => {
        if (view === 2) {
            setLoading(true);
            fetchDiem();
            setLoading(false);
        }
        setShow(view);
    };
    const handleDelete = (id) => {
        setData(id);
        changeConfirm('delete');
    }
    const deleteDiem = async (id) => {
        try {
            const response = await axiosClient.delete(`/diem/delete/${id}`);
            setMessage(response.data);
        } catch (error) {
            console.log(error);
            setMessage(typeof error.response.data == 'string' ? error.response.data : 'Lỗi không xác định');
        } finally {
            fetchDiem();
            setShowButton(false);
        }
    }
    const handleUpdate = (value) => {
        setData(value);
        changeConfirm('update');
    }
    const updateDiem = async (value) => {
        try {
            const response = await axiosClient.post("/diem/update", value);
            setMessage(response.data);
        } catch (error) {
            console.log(error);
            setMessage(typeof error.response.data == 'string' ? error.response.data : 'Lỗi không xác định');
        } finally {
            if(disableHK1 == false){
                TongKetHK(maHK1);
            }
            if(disableHK2 == false){
                TongKetHK(maHK2);
            }
            if(disableNH == false){
                TongKetNH();
            }
            fetchDiem();
            setShowButton(false);
        }
    }
    const handleSubmit = async (value) => {
        const payload = {
            MaHK: value.MaHK,
            MaMH: classData.MaMH,
            MSHS: value.MSHS,
            Diem: value.Diem,
            MaLoai: value.MaLoai
        };
        setData(payload);
        changeConfirm('add');
    };
    const addDiem = async (payload) => {
        try {
            const response = await axiosClient.post("/diem/add", payload);
            setMessage(response.data);
        } catch (error) {
            console.error('Error submitting data:', error);
            setMessage(typeof error.response.data == 'string' ? error.response.data : 'Lỗi không xác định');
        } finally {
            fetchDiem();
            setShowButton(false);
        }
    }
    const loaiDiemHK = loaiDiem.filter(item => ['tx', 'gk', 'ck'].includes(item.MaLoai));
    const hocki = {
        "Học kì 1": 1 + nienKhoa.NienKhoa,
        "Học kì 2": 2 + nienKhoa.NienKhoa
    };
    const CheckTongKet = () => {
        let checkHK1 = true;
        let checkHK2 = true;
        let checkCN = true;
        classData.lop.hoc_sinh.map((student) => {
            const txGrades1 = diemHK1.filter((item) => item.MSHS === student.MSHS && item.MaLoai === "tx");
            const txGrades2 = diemHK2.filter((item) => item.MSHS === student.MSHS && item.MaLoai === "tx");
            const otherGrades1 = diemHK1.filter((item) => item.MSHS === student.MSHS && item.MaLoai != "tx");
            const otherGrades2 = diemHK2.filter((item) => item.MSHS === student.MSHS && item.MaLoai != "tx");
            const TBHK1 = diemHK1.filter((item) => item.MSHS === student.MSHS && item.MaLoai == "tbhk1");
            const TBHK2 = diemHK2.filter((item) => item.MSHS === student.MSHS && item.MaLoai == "tbhk2");
            if ((txGrades1.length == 0 || otherGrades1.length < 2)) {
                checkHK1 = false;
            }
            if ((txGrades2.length == 0 || otherGrades2.length < 2)) {
                checkHK2 = false;
            }
            if (!TBHK1.Diem || !TBHK2.Diem) {
                checkCN = false;
            }
        })
        if (checkHK1) {
            setDisableHK1(false);
            setMaHK1(1 + nienKhoa.NienKhoa);
        }
        else if (checkHK2) {
            setDisableHK2(false);
            setMaHK2(2 + nienKhoa.NienKhoa);
        }
        else {
            setDisableHK1(true);
            setDisableHK2(true);
            setMaHK1("");
            setMaHK2("");
        }
        if (checkCN) {
            setDisableNH(false);
        } else {
            setDisableNH(true);
        }
        setShowButton(!showButton);
    }
    const changeConfirm = (type) => {
        if (type == 'tkhk1') {
            setContent(`Bạn có chắc chắn muốn tổng kết học kì 1?`);
        }
        if (type == 'tkhk2') {
            setContent(`Bạn có chắc chắn muốn tổng kết học kì 2?`);
        }
        if (type == 'tknh') {
            setContent(`Bạn có chắc chắn muốn tổng kết năm học ${nienKhoa.TenNK}?`);
        }
        if (type == 'add') {
            setContent(`Bạn có chắc chắn muốn thêm mới?`);
        }
        if (type == 'update') {
            setContent(`Bạn có chắc chắn muốn cập nhật?`);
        }
        if (type == 'delete') {
            setContent(`Bạn có chắc chắn muốn xóa?`);
        }
        setType(type);
        setShowConfrim(true);
    }
    const onConfirm = () => {
        if (type == 'tkhk1') {
            TongKetHK(maHK1);
        }
        if (type == 'tkhk2') {
            TongKetHK(maHK2);
        }
        if (type == 'tknh') {
            TongKetNH();
        }
        if (type == 'add') {
            addDiem(data);
        }
        if (type == 'update') {
            updateDiem(data);
        }
        if (type == 'delete') {
            deleteDiem(data);
        }
        setShowConfrim(false);
    }
    const onCancel = () => {
        setShowConfrim(false);
    }
    const TongKetNH = async () => {
        const payload = {
            MaNK: nienKhoa.NienKhoa,
            MaLop: classData.MaLop,
            MaMH: classData.MaMH
        }
        try {
            const response = await axiosClient.post("/diem/tk/canam", payload);
            setMessage(response.data);
        } catch (error) {
            console.error('Error submitting data:', error);
            setMessage(typeof error.response.data == 'string' ? error.response.data : 'Lỗi không xác định');
        } finally {
            handleShow(2);
        }
    }
    const TongKetHK = async (maHK) => {
        const payload = {
            MaHK: maHK,
            MaLop: classData.MaLop,
            MaMH: classData.MaMH
        }
        try {
            const response = await axiosClient.post("/diem/tk/hocky", payload);
            setMessage(response.data);
        } catch (error) {
            console.error('Error submitting data:', error);
            setMessage(typeof error.response.data == 'string' ? error.response.data : 'Lỗi không xác định');
        } finally {
            handleShow(2);
        }
    }
    return (
        <div className="main-content relative">
            {showConfirm &&
                <div className="confirm-overlay">
                    <div className="confirm-box">
                        <p>{content}</p>
                        <div className="confirm-buttons">
                            <button onClick={onConfirm} id="confirm-yes">Xác nhận</button>
                            <button onClick={onCancel} id="confirm-no">Hủy</button>
                        </div>
                    </div>
                </div>
            }
            <Menu />
            <div className="right-part mb-2 relative">
                <h1 className="page-name">Thông tin lớp</h1>
                <div className="my-2 flex">
                    <button className="teacher-head" onClick={() => handleShow(1)}>Danh sách lớp</button>
                    <button className="teacher-head" onClick={() => handleShow(2)}>Quản lí điểm</button>
                </div>
                <div className="flex justify-between px-2 text-xl">
                    <p><strong>Tên lớp:</strong> {classData.lop.TenLop}</p>
                    <p><strong>Môn dạy:</strong> {classData.mon_hoc.TenMH}</p>
                    <p><strong>Sỉ số:</strong> {classData.lop.hoc_sinh.length}</p>
                </div>
                {show === 1 && <HocSinhTable datas={classData.lop.hoc_sinh} />}
                {show === 2 && (
                    <div>
                        <div className="flex justify-between space-x-2 my-2">
                            <div className="space-x-2 flex">
                                <button onClick={CheckTongKet} className="button button-animation border-blue-600 hover:bg-blue-600">Tổng kết</button>
                                {showButton && <div className="space-x-2">
                                    <button
                                        type="button"
                                        className={!disableNH ? "button button-animation border-blue-600 hover:bg-blue-600" : "button border-slate-500 text-slate-500"}
                                        disabled={disableNH}
                                        onClick={() => changeConfirm('tknh')}
                                    >
                                        Tổng kết năm học
                                    </button>
                                    <button
                                        type="button"
                                        className={!disableHK1 ? "button button-animation border-blue-600 hover:bg-blue-600" : "button border-slate-500 text-slate-500"}
                                        disabled={disableHK1}
                                        onClick={() => changeConfirm('tkhk1')}
                                    >
                                        Tổng kết học kì 1
                                    </button>
                                    <button
                                        type="button"
                                        className={!disableHK2 ? "button button-animation border-blue-600 hover:bg-blue-600" : "button border-slate-500 text-slate-500"}
                                        disabled={disableHK2}
                                        onClick={() => changeConfirm('tkhk2')}
                                    >
                                        Tổng kết học kì 2
                                    </button>
                                </div>}
                            </div>
                            <div className="space-x-2 flex">
                                {showForm === 2 && <div className="text-red-500 shadow-lag mt-1 text-xl">Nhấp chọn điểm cần sửa</div>}
                                {showForm !== 2 ? (
                                    <button className="button button-animation border-blue-600 hover:bg-blue-600" onClick={() => setShowForm(2)}>Sửa điểm</button>
                                ) : (
                                    <button className="button button-animation border-red-600 hover:bg-red-600" onClick={() => setShowForm(0)}>Hủy</button>
                                )}
                                <button className="button button-animation border-blue-600" onClick={() => setShowForm(1)}>Nhập điểm</button>
                            </div>
                        </div>
                        <BangDiem
                            hocSinh={classData.lop.hoc_sinh}
                            loaiDiem={loaiDiemHK}
                            diemHK1={diemHK1}
                            diemHK2={diemHK2}
                            diemCN={diemCN}
                            show={showForm}
                            _delete={handleDelete}
                            _update={handleUpdate}
                        />
                    </div>
                )}
                {showForm === 1 && (
                    <div className="z-10 absolute w-1/2 top-64 left-1/4 border-2 border-black rounded-lg bg-white">
                        <div className="absolute top-0 right-0">
                            <button className="X-button" onClick={() => setShowForm(0)}>X</button>
                        </div>
                        <div className="p-2 text-center text-xl border-b-2 border-slate-100 text-white bg-slate-400">Nhập điểm</div>
                        <div className="p-4">
                            <Formik
                                initialValues={{
                                    MSHS: '',
                                    Diem: '',
                                    MaHK: '',
                                    MaLoai: '',
                                }}
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
                                onSubmit={handleSubmit}
                            >
                                <Form className="flex items-center justify-center">
                                    <div className="w-full max-w-lg p-3 space-y-4">
                                        <h2 className="text-2xl font-bold text-center underline underline-offset-8 decoration-4 decoration-blue-300">Nhập điểm</h2>
                                        <div className="grid grid-rows-2 grid-flow-col">
                                            <div className="w-[80%] mx-auto">
                                                <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="MSHS">
                                                    Mã học sinh
                                                </label>
                                                <Field
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
                                                <Field
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
                                                <Field
                                                    as="select"
                                                    name="MaLoai"
                                                    className="f-field"
                                                >
                                                    <option value="">Chọn loại điểm</option>
                                                    {loaiDiemHK.map((data) => (
                                                        <option key={data.MaLoai} value={data.MaLoai}>{data.TenLoai}</option>
                                                    ))}
                                                </Field>
                                                <ErrorMessage className="text-red-700 block mb-2" name="MaLoai" component="div" />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="f-button"
                                        >
                                            Lưu
                                        </button>
                                    </div>
                                </Form>
                            </Formik>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
