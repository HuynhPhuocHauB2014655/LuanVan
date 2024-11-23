import { useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { useStateContext } from "../context/Context";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faScrewdriverWrench, faX } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import AlterConfirm from "../components/Confirm";
import { useUserContext } from "../context/userContext";
import Header from "../components/Header";
export default function StudentInfo() {
    const location = useLocation();
    const navigate = useNavigate();
    const { Mshs } = location.state || {};
    const { nienKhoa, setMessage, setError } = useStateContext();
    const [show, setShow] = useState(0);
    const [info, setInfo] = useState({});
    const [showConfirm, setShowConfirm] = useState(0);
    const [initialValues, setInitialValues] = useState({});
    const formRef = useRef();
    const phRef = useRef();
    const { userName } = useUserContext();
    const fetchData = async () => {
        const res = await axiosClient.get(`hs/show/${Mshs}`);
        setInfo(res.data);
    }
    useEffect(() => {
        fetchData();
    }, [Mshs]);
    const showForm = (value) => {
        if (value == 2) {
            const data = {
                TenCha: info.phu_huynh.TenCha,
                SDTCha: info.phu_huynh.SDTCha,
                TenMe: info.phu_huynh.TenMe,
                SDTMe: info.phu_huynh.SDTMe,
            }
            setInitialValues(data);
        } else {
            const data = {
                TenCha: '',
                SDTCha: '',
                TenMe: '',
                SDTMe: '',
            }
            setInitialValues(data);
        }
        setShow(value);
        document.getElementById("phForm").scrollIntoView();
    }
    const handleSubmit = async (value) => {
        value.MSHS = Mshs;
        try {
            if (show == 1) {
                const res = await axiosClient.post('hs/ph', value);
                setMessage('Cập nhật thông tin thành công');
            } else {
                const res = await axiosClient.put('hs/ph', value);
                setMessage('Cập nhật thông tin thành công');
            }
        } catch (error) {
            setError(typeof error.response.data == 'string' ? error.response.data : 'Lỗi không xác định');
        } finally {
            fetchData();
            setShow(0);
        }
    }
    const triggerConfirm = () => {
        setShowConfirm(1);
    }
    const onConfirm = () => {
        if (formRef.current) {
            formRef.current.submitForm();
        }
        setShowConfirm(0);
    }
    const onCancel = () => {
        setShowConfirm(0);
    }
    const updateHS = async (values) => {
        values.MSHS = Mshs;
        try {
            await axiosClient.put('/hs/update/' + values.MSHS, values);
            setMessage('Đã sửa học sinh thành công');
            fetchData();
            showForm(0);
        } catch (error) {
            console.error('Error submitting form:', error);
            setError('Có lỗi trong quá trình sửa học sinh');
        }
    };
    // console.log(info);
    return (
        <div>
            <Header />
            <div className="main-content">
                <Menu />
                <div className="right-part relative">
                    <h1 className="page-name">Thông tin học sinh</h1>
                    {info &&
                        <div className="w-[95%] mx-auto">
                            <div className="mt-2 flex justify-between">
                                <div>
                                    <button className="button border-cyan-500 hover:bg-cyan-400 hover:text-white" onClick={() => navigate(-1)}><FontAwesomeIcon icon={faChevronLeft} /></button>
                                    <button className="button border-cyan-500 hover:bg-cyan-400 hover:text-white" onClick={() => showForm(3)}><FontAwesomeIcon icon={faScrewdriverWrench} title="Sửa thông tin " /></button>
                                </div>
                                <button className="button border-cyan-500 hover:bg-cyan-400 hover:text-white" onClick={() => navigate('/student-result', { state: { studentData: info } })}>Thành tích học tập <FontAwesomeIcon icon={faChevronRight} /></button>
                            </div>
                            <div id="phForm">
                                {(show == 1 || show == 2) &&
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={
                                            Yup.object().shape({
                                                TenCha: Yup.string().required('Tên cha không được để trống'),
                                                SDTCha: Yup.string().matches(/^\d{10}$/, 'Số điện thoại không hợp lệ.').required('Số điện thoại cha không được để trống'),
                                                TenMe: Yup.string().required('Tên mẹ không được để trống'),
                                                SDTMe: Yup.string().matches(/^\d{10}$/, 'Số điện thoại không hợp lệ.').required('Số điện thoại mẹ không được để trống')
                                            })
                                        }
                                        onSubmit={handleSubmit}
                                    >
                                        <Form className="absolute p-10 border-2 border-blue-500 py-4 rounded-lg top-44 left-[25%] w-[50%] bg-white shadow-lg">
                                            <button type='button' onClick={() => showForm(0)} className='top-0 right-0 absolute px-1 hover:text-red-400'><FontAwesomeIcon icon={faX} /></button>
                                            <div className="w-full mx-auto space-y-2">
                                                <div className="text-2xl font-bold text-center py-2 bg-slate-300">Thông tin phụ huynh</div>
                                                <div>
                                                    <label className="text-xl font-medium" htmlFor="TenCha">Họ tên Cha:</label>
                                                    <Field type="text" name="TenCha" className="w-full mb-1 rounded border-2 border-black p-2" placeholder="Nhập họ tên cha" />
                                                    <ErrorMessage className="text-red-700" name="TenCha" component="div" />
                                                </div>
                                                <div>
                                                    <label className="text-xl font-medium" htmlFor="SDTCha">Số điện thoại Cha:</label>
                                                    <Field type="text" name="SDTCha" className="w-full mb-1 rounded border-2 border-black p-2" placeholder="Nhập số điện thoại cha" />
                                                    <ErrorMessage className="text-red-700" name="SDTCha" component="div" />
                                                </div>
                                                <div>
                                                    <label className="text-xl font-medium" htmlFor="TenMe">Họ tên Mẹ:</label>
                                                    <Field type="text" name="TenMe" className="w-full mb-1 rounded border-2 border-black p-2" placeholder="Nhập họ tên mệ" />
                                                    <ErrorMessage className="text-red-700" name="TenMe" component="div" />
                                                </div>
                                                <div>
                                                    <label className="text-xl font-medium" htmlFor="SDTMe">Số điện thoại Mẹ:</label>
                                                    <Field type="text" name="SDTMe" className="w-full mb-1 rounded border-2 border-black p-2" placeholder="Nhập số điện thoại mẹ" />
                                                    <ErrorMessage className="text-red-700" name="SDTMe" component="div" />
                                                </div>
                                                <div className="w-1/2 mx-auto">
                                                    <button type="submit" className="w-full border-2 rounded-md px-3 py-2 bg-blue-500 hover:bg-blue-700 hover:text-white">Lưu</button>
                                                </div>
                                            </div>
                                        </Form>
                                    </Formik>
                                }
                            </div>
                            <div className="text-2xl font-semibold my-2 text-center bg-slate-300 py-5 mt-10">Học sinh</div>
                            <table className="table-fixed text-left text-xl w-full">
                                <tbody>
                                    <tr>
                                        <th className="p-4 bg-slate-200">Mã số học sinh</th>
                                        <td className="p-4 bg-slate-200">{info.MSHS}</td>
                                    </tr>
                                    <tr>
                                        <th className="p-4">Tên học sinh</th>
                                        <td className="p-4">{info.HoTen}</td>
                                    </tr>
                                    <tr>
                                        <th className="p-4 bg-slate-200">Giới tính</th>
                                        <td className="p-4 bg-slate-200">{info.GioiTinh}</td>
                                    </tr>
                                    <tr>
                                        <th className="p-4">Ngày sinh</th>
                                        <td className="p-4">{info.NgaySinh}</td>
                                    </tr>
                                    <tr>
                                        <th className="p-4 bg-slate-200">Quê quán</th>
                                        <td className="p-4 bg-slate-200">{info.QueQuan}</td>
                                    </tr>
                                    <tr>
                                        <th className="p-4">Dân tộc</th>
                                        <td className="p-4">{info.DanToc}</td>
                                    </tr>
                                    <tr>
                                        <th className="p-4 bg-slate-200">Tôn giáo</th>
                                        <td className="p-4 bg-slate-200">{info.TonGiao}</td>
                                    </tr>
                                    <tr>
                                        <th className="p-4">Địa chỉ</th>
                                        <td className="p-4">{info.DiaChi}</td>
                                    </tr>
                                    <tr>
                                        <th className="p-4 bg-slate-200">Số điện thoại</th>
                                        <td className="p-4 bg-slate-200">{info.SDT}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div>
                                <div className="text-2xl font-semibold my-2 text-center bg-slate-300 py-5 mt-10">Quá trình học tập</div>
                                <table className="table-fixed text-left text-xl w-full">
                                    <tbody>
                                        {info.lop?.map((data, index) => (
                                            <tr key={data.MaLop}>
                                                <th className={`p-4 ${index % 2 == 0 && "bg-slate-200"}`}>{data.nien_khoa.TenNK}</th>
                                                <td className={`p-4 ${index % 2 == 0 && "bg-slate-200"}`}>{data.TenLop}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="relative mt-3">
                                <div className="text-2xl font-semibold my-2 text-center bg-slate-300 py-5 mt-10">Phụ Huynh</div>
                                <div className="absolute left-1 top-5">
                                    {info.phu_huynh ?
                                        <button className="button border-blue-500 hover:bg-blue-500 hover:text-white bg-white" onClick={() => showForm(2)}>Sửa Phụ huynh</button>
                                        :
                                        <button className="button border-blue-500 hover:bg-blue-500 hover:text-white bg-white" onClick={() => showForm(1)}>Thêm Phụ huynh</button>
                                    }
                                </div>
                            </div>
                            {info.phu_huynh ?
                                <table className="table-fixed text-left text-xl w-full">
                                    <tbody>
                                        <tr>
                                            <th className="p-4 bg-slate-200">Họ tên Cha:</th>
                                            <td className="p-4 bg-slate-200">{info.phu_huynh.TenCha}</td>
                                        </tr>
                                        <tr>
                                            <th className="p-4">Số điện thoại Cha:</th>
                                            <td className="p-4">{info.phu_huynh.SDTCha}</td>
                                        </tr>
                                        <tr>
                                            <th className="p-4 bg-slate-200">Họ tên Mẹ:</th>
                                            <td className="p-4 bg-slate-200">{info.phu_huynh.TenMe}</td>
                                        </tr>
                                        <tr>
                                            <th className="p-4">Số điện thoại Mẹ:</th>
                                            <td className="p-4">{info.phu_huynh.SDTMe}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                :
                                <div>
                                    <div className="text-red-500 text-3xl text-center">Chưa có thông tin</div>
                                </div>
                            }
                        </div>
                    }

                    {show == 3 &&
                        <div className="absolute z-10 w-[70%] left-[15%] top-10 bg-white shadow-lg rounded-lg border-2 border-black p-10">
                            <button className="absolute top-0 right-0 me-2 text-red-700 border border-black px-2 mt-2 hover:border-red-600" onClick={() => showForm(0)}>X</button>
                            <h1 className="text-center mb-3 text-2xl font-semibold bg-blue-400 rounded-md text-white py-2">Sửa thông tin học sinh</h1>
                            <Formik
                                initialValues={{
                                    HoTen: info.HoTen,
                                    NgaySinh: info.NgaySinh,
                                    GioiTinh: info.GioiTinh,
                                    QueQuan: info.QueQuan,
                                    DanToc: info.DanToc,
                                    TonGiao: info.TonGiao,
                                    DiaChi: info.DiaChi,
                                    SDT: info.SDT,
                                    MaBan: info.MaBan,
                                    TrangThai: info.TrangThai
                                }}
                                validationSchema={Yup.object({
                                    HoTen: Yup.string().required('Họ và tên không được bỏ trống'),
                                    NgaySinh: Yup.string().required('Ngày sinh không được bỏ trống'),
                                    GioiTinh: Yup.string().required('Giới tính không được bỏ trống'),
                                    QueQuan: Yup.string().required('Quê quán không được bỏ trống'),
                                    DanToc: Yup.string().required('Dân Tộc không được bỏ trống'),
                                    TonGiao: Yup.string().required('Tôn Giáo không được bỏ trống'),
                                    DiaChi: Yup.string().required('Địa chỉ không được bỏ trống'),
                                    SDT: Yup.string().matches(/^\d{10}$/, 'Số điện thoại phải có 10 chữ số.').required('Số điện thoại không được bỏ trống'),
                                    MaBan: Yup.string().required('Ban không được bỏ trống'),
                                    TrangThai: Yup.string(),
                                })}
                                onSubmit={updateHS}
                                enableReinitialize={true}
                                innerRef={formRef}
                            >
                                <Form className="relative" ref={formRef}>
                                    <div className="grid grid-cols-2 grid-flow-row gap-2">
                                        <div className="mb-2">
                                            <label htmlFor="HoTen" className="block mb-1">Họ và tên</label>
                                            <Field type="text" name="HoTen" id="HoTen" className="w-full mb-1 rounded border-2 border-black p-2" placeholder="Họ và tên" />
                                            <ErrorMessage className="text-red-700" name="HoTen" component="div" />
                                        </div>

                                        <div className="mb-2">
                                            <label htmlFor="NgaySinh" className="block mb-1">Ngày sinh</label>
                                            <Field type="text" name="NgaySinh" id="NgaySinh" className="w-full mb-1 rounded border-2 border-black p-2" placeholder="Ngày sinh" />
                                            <ErrorMessage className="text-red-700" name="NgaySinh" component="div" />
                                        </div>

                                        <div className="mb-2">
                                            <label htmlFor="GioiTinh" className="block mb-1">Giới tính</label>
                                            <Field as="select" name="GioiTinh" id="GioiTinh" className="border-2 border-black p-2 w-full mb-1 rounded">
                                                <option value="Nam" defaultChecked>Nam</option>
                                                <option value="Nữ">Nữ</option>
                                            </Field>
                                            <ErrorMessage className="text-red-700" name="GioiTinh" component="div" />
                                        </div>

                                        <div className="mb-2">
                                            <label htmlFor="QueQuan" className="block mb-1">Quê quán</label>
                                            <Field type="text" name="QueQuan" id="QueQuan" className="w-full mb-1 rounded border-2 border-black p-2" placeholder="Quê quán" />
                                            <ErrorMessage className="text-red-700" name="QueQuan" component="div" />
                                        </div>

                                        <div className="mb-2">
                                            <label htmlFor="DanToc" className="block mb-1">Dân Tộc</label>
                                            <Field type="text" name="DanToc" id="DanToc" className="w-full mb-1 rounded border-2 border-black p-2" placeholder="Dân Tộc" />
                                            <ErrorMessage className="text-red-700" name="DanToc" component="div" />
                                        </div>

                                        <div className="mb-2">
                                            <label htmlFor="TonGiao" className="block mb-1">Tôn Giáo</label>
                                            <Field type="text" name="TonGiao" id="TonGiao" className="w-full mb-1 rounded border-2 border-black p-2" placeholder="Tôn Giáo" />
                                            <ErrorMessage className="text-red-700" name="TonGiao" component="div" />
                                        </div>

                                        <div className="mb-2">
                                            <label htmlFor="DiaChi" className="block mb-1">Địa chỉ</label>
                                            <Field type="text" name="DiaChi" id="DiaChi" className="w-full mb-1 rounded border-2 border-black p-2" placeholder="Địa chỉ" />
                                            <ErrorMessage className="text-red-700" name="DiaChi" component="div" />
                                        </div>

                                        <div className="mb-2">
                                            <label htmlFor="SDT" className="block mb-1">Số điện thoại</label>
                                            <Field type="text" name="SDT" id="SDT" className="w-full mb-1 rounded border-2 border-black p-2" placeholder="Số điện thoại" />
                                            <ErrorMessage className="text-red-700" name="SDT" component="div" />
                                        </div>

                                        <div className="mb-2">
                                            <label htmlFor="MaBan" className="block mb-1">Mã Ban</label>
                                            <Field as="select" name="MaBan" id="MaBan" className="border-2 border-black p-2 w-full mb-1 rounded">
                                                <option value="TN">Tự nhiên</option>
                                                <option value="XH">Xã hội</option>
                                            </Field>
                                            <ErrorMessage className="text-red-700" name="MaBan" component="div" />
                                        </div>

                                        <div className="mb-2">
                                            <label htmlFor="TrangThai" className="block mb-1">Trạng thái</label>
                                            <Field as="select" name="TrangThai" id="TrangThai" className="border-2 border-black p-2 w-full rounded">
                                                <option value={0}>Đang học</option>
                                                <option value={1}>Đã thôi học</option>
                                                <option value={2}>Đã tốt nghiệp</option>
                                            </Field>
                                            <ErrorMessage className="text-red-700" name="TrangThai" component="div" />
                                        </div>


                                    </div>

                                    <div className="flex justify-center">
                                        <button type="button" onClick={() => triggerConfirm(1)} className="w-1/3 mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400">
                                            Sửa
                                        </button>
                                    </div>
                                    {showConfirm === 1 &&
                                        <AlterConfirm message={'Bạn có chắc chắn với hành động này không?'} onConfirm={onConfirm} onCancel={onCancel} />
                                    }
                                </Form>
                            </Formik>
                        </div>}
                </div>
            </div>
        </div>
    )
}