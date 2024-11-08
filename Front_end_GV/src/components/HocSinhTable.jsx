import React from 'react';
import { useNavigate } from "react-router-dom";
const HocSinhTable = ({ datas}) => {
    const navigate = useNavigate();
    return (
        <table className="border-collapse mt-2 mb-2 w-full">
            <thead>
                <tr className='bg-slate-400'>
                    <th className="py-4 px-2">STT</th>
                    <th className="py-4 px-2">MSHS</th>
                    <th className="py-4 px-2">Tên học sinh</th>
                    <th className="py-4 px-2">Ngày Sinh</th>
                    <th className="py-4 px-2">Giới tính</th>
                    <th className="py-4 px-2">Quê quán</th>
                    <th className="py-4 px-2">Dân tộc</th>
                    <th className="py-4 px-2">Tôn Giáo</th>
                    <th className="py-4 px-2">Địa chỉ</th>
                    <th className="py-4 px-2">Số điện thoại</th>
                </tr>
            </thead>
            <tbody>
                {datas.map((data, index) => (
                    <tr key={index} className={`${index % 2 == 0 && "bg-slate-200"}`}>
                        <td className={`py-4 px-2`}>{index + 1}</td>
                        <td className={`py-4 px-2`}>{data.MSHS}</td>
                        <td className={`py-4 px-2`}>{data.HoTen}</td>
                        <td className={`py-4 px-2`}>{data.NgaySinh}</td>
                        <td className={`py-4 px-2`}>{data.GioiTinh}</td>
                        <td className={`py-4 px-2`}>{data.QueQuan}</td>
                        <td className={`py-4 px-2`}>{data.DanToc}</td>
                        <td className={`py-4 px-2`}>{data.TonGiao}</td>
                        <td className={`py-4 px-2`}>{data.DiaChi}</td>
                        <td className={`py-4 px-2`}>{data.SDT}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
export default HocSinhTable;