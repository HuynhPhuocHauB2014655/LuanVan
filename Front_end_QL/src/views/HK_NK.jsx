import axiosClient from "../axios-client"
import React, { useEffect, useRef, useState } from 'react';
import { useStateContext } from "../context/alterContext";
export default function HK_NK() {
    const {message,setMessage} = useStateContext();
    const [isShow, setIsShow] = useState(0);
    const [datas, setDatas] = useState([]);
    const MaNKRef = useRef();
    const TenNKRef = useRef();
    const fetchData = async () => {
        try {
            const response = await axiosClient.get('/nk/index');
            setDatas(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const showForm = () => {
        if (isShow == 1) {
            setIsShow(0);
        } else {
            setIsShow(1);
        }
    };
    const submit = (ev) => {
        ev.preventDefault();
        const payload = {
            MaNK: MaNKRef.current.value,
            TenNK: TenNKRef.current.value
        };
        const createHK = () =>{
            for (let index = 1; index <= 2; index++){
                const hocki = {
                    MaHK: index+payload.MaNK,
                    TenHK: "HK"+index,
                    MaNK: payload.MaNK,
                };
                axiosClient.post('/hk/create', hocki)
                .then(({ hocki }) => {
                })
                .catch((err) => {
                    const response = err.response;
                    console.log(response);
                });
            }
        }
        try{
            axiosClient.post('/nk/create', payload)
            .then(({ nienkhoa }) => {
                fetchData();
            })
            .catch((err) => {
                const response = err.response;
                console.log(response);
            });
            createHK();
            setMessage('Tạo mới thành công');
        }catch(err){
            setMessage('Có lỗi trong quá trình tạo mới');
        }
    }
    return (
        <div className="hk_nk">
            <h2 className="text-2xl font-bold text-center border-b-2 border-cyan-400 py-3">Học kì - Niên khóa</h2>
            <div className="button-nav">
                <button onClick={showForm} className="px-3 py-1 mt-2 bg-blue-500 text-white rounded shadow-md transition duration-300 ease-in-out transform hover:bg-blue-600 hover:scale-105 hover:shadow-lg">Thêm niên khóa</button>
            </div>
            {isShow === 1 &&
                <form onSubmit={submit} className="add_nk_form">
                    <input ref={MaNKRef} className="form-input rounded ms-2 mt-2" type="text" placeholder="Mã niên khóa" />
                    <input ref={TenNKRef} className="form-input rounded ms-2 mt-2" type="text" placeholder="Tên niên khóa" />
                    <button className="border px-3 py-1 ms-3 border-green-600 rounded hover:bg-green-600 text-slate-950">Lưu</button>
                </form>
            }
            <div className="hk_nk_content">
                <h2 className="text-2xl mt-2 font-semibold">Danh sách niên khóa</h2>
                <table className="table-auto border-collapse border border-slate-500 ">
                    <thead>
                        <tr>
                            <th className="border border-slate-600 p-2">Mã niên khóa</th>
                            <th className="border border-slate-600 p-2">Tên niên Khóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datas.map((data, index) => {
                            return (
                                <tr key={index}>
                                    <td className="border border-slate-600 p-2">{data.MaNK}</td>
                                    <td className="border border-slate-600 p-2">{data.TenNK}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}