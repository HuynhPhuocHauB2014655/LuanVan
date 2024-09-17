import { useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { useStateContext } from "../context/Context";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import AlterConfirm from "../components/Confirm";
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
    const fetchData = async () => {
        const res = await axiosClient.get(`hs/show/${Mshs}`);
        setInfo(res.data);
    }
    useEffect(() => {
        fetchData();
    }, [Mshs]);
    // console.log(info);
    return (
        <div className="main-content">
            <Menu />
            <div className="right-part relative">
                <h1 className="page-name">Thông tin học sinh</h1>
                {info &&
                    <div className="w-[90%] mx-auto">
                        <div className="mt-2 flex justify-between">
                            <button className="button border-cyan-500 hover:bg-cyan-400 hover:text-white" onClick={() => navigate(-1)}>Trở về</button>
                            <div>
                                <button className="button border-cyan-500 hover:bg-cyan-400 hover:text-white" onClick={()=>navigate('/student-result', { state: { studentData: info } })}>Thành tích học tập</button>
                            </div>
                        </div>
                        <div className="text-2xl font-semibold my-2 text-center">Học sinh</div>
                        <table className="table-fixed text-left text-xl w-full">
                            <tbody>
                                <tr>
                                    <th className="border border-gray-400 p-2">Mã số học sinh</th>
                                    <td className="border border-gray-400 p-2">{info.MSHS}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-400 p-2">Tên học sinh</th>
                                    <td className="border border-gray-400 p-2">{info.HoTen}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-400 p-2">Giới tính</th>
                                    <td className="border border-gray-400 p-2">{info.GioiTinh}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-400 p-2">Ngày sinh</th>
                                    <td className="border border-gray-400 p-2">{info.NgaySinh}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-400 p-2">Quê quán</th>
                                    <td className="border border-gray-400 p-2">{info.QueQuan}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-400 p-2">Dân tộc</th>
                                    <td className="border border-gray-400 p-2">{info.DanToc}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-400 p-2">Tôn giáo</th>
                                    <td className="border border-gray-400 p-2">{info.TonGiao}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-400 p-2">Địa chỉ</th>
                                    <td className="border border-gray-400 p-2">{info.DiaChi}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-400 p-2">Số điện thoại</th>
                                    <td className="border border-gray-400 p-2">{info.SDT}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <div className="text-2xl font-semibold my-2 text-center">Quá trình học tập</div>
                            <table className="table-fixed text-left text-xl w-full">
                                <tbody>
                                    {info.lop?.map((data) => (
                                        <tr key={data.MaLop}>
                                            <th className="border border-gray-400 p-2">{data.MaNK}</th>
                                            <td className="border border-gray-400 p-2">{data.TenLop}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="relative mt-3">
                            <div className="text-2xl font-semibold my-2 text-center">Phụ Huynh</div>
                        </div>
                        {info.phu_huynh ?
                            <table className="table-fixed text-left text-xl w-full">
                                <tbody>
                                    <tr>
                                        <th className="border border-gray-400 p-2">Họ tên Cha:</th>
                                        <td className="border border-gray-400 p-2">{info.phu_huynh.TenCha}</td>
                                    </tr>
                                    <tr>
                                        <th className="border border-gray-400 p-2">Số điện thoại Cha:</th>
                                        <td className="border border-gray-400 p-2">{info.phu_huynh.SDTCha}</td>
                                    </tr>
                                    <tr>
                                        <th className="border border-gray-400 p-2">Họ tên Mẹ:</th>
                                        <td className="border border-gray-400 p-2">{info.phu_huynh.TenMe}</td>
                                    </tr>
                                    <tr>
                                        <th className="border border-gray-400 p-2">Số điện thoại Mẹ:</th>
                                        <td className="border border-gray-400 p-2">{info.phu_huynh.SDTMe}</td>
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
            </div>
        </div>
    )
}