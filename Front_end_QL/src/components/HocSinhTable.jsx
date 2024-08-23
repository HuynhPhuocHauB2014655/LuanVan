import React from 'react';
import { useNavigate } from "react-router-dom";
const HocSinhTable = ({ datas}) => {
    const navigate = useNavigate();
    return (
        <table className="border-collapse mt-2 mb-2 w-full">
            <thead>
                <tr>
                    <th className="border border-gray-400 p-2">STT</th>
                    <th className="border border-gray-400 p-2">MSHS</th>
                    <th className="border border-gray-400 p-2">Tên học sinh</th>
                    <th className="border border-gray-400 p-2">Ngày Sinh</th>
                    <th className="border border-gray-400 p-2">Giới tính</th>
                    <th className="border border-gray-400 p-2">Quê quán</th>
                    <th className="border border-gray-400 p-2">Dân tộc</th>
                    <th className="border border-gray-400 p-2">Tôn Giáo</th>
                    <th className="border border-gray-400 p-2">Địa chỉ</th>
                    <th className="border border-gray-400 p-2">Số điện thoại</th>
                </tr>
            </thead>
            <tbody>
                {datas.map((data, index) => (
                    <tr key={index}>
                        <td className="border border-gray-400 p-2">{index + 1}</td>
                        <td className="border border-gray-400 p-2">{data.MSHS}</td>
                        <td className="border border-gray-400 p-2">{data.HoTen}</td>
                        <td className="border border-gray-400 p-2">{data.NgaySinh}</td>
                        <td className="border border-gray-400 p-2">{data.GioiTinh}</td>
                        <td className="border border-gray-400 p-2">{data.QueQuan}</td>
                        <td className="border border-gray-400 p-2">{data.DanToc}</td>
                        <td className="border border-gray-400 p-2">{data.TonGiao}</td>
                        <td className="border border-gray-400 p-2">{data.DiaChi}</td>
                        <td className="border border-gray-400 p-2">{data.SDT}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
export default HocSinhTable;