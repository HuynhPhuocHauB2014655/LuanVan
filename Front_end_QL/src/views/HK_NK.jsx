import axiosClient from "../axios-client"
import React, { useEffect, useRef, useState } from 'react';
import { useStateContext } from "../context/alterContext";
export default function HK_NK() {
    const {message,setMessage} = useStateContext();
    const [isShow, setIsShow] = useState(0);
    const [datas, setDatas] = useState([]);
    const MaNKRef = useRef();
    const TenNKRef = useRef();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get('/nk/index');
                setDatas(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    console.log(datas);
    const showForm = () => {
        if (isShow == 1) {
            setIsShow(0);
        } else {
            setIsShow(1);
        }
    };
    const submit = (ev) => {
        ev.preventDefault();
        // const payload = {
        //     MaNK: MaNKRef.current.value,
        //     TenNK: TenNKRef.current.value
        // };
        // axiosClient.post('/nk/create', payload)
        //     .then(({ data }) => {
        //         setMessage('Tạo mới thành công');
        //     })
        //     .catch((err) => {
        //         const response = err.response;
        //         setErrors(response.data.errors);
        //         console.log(response);
        //     })
        setMessage('Tạo mới thành công');
    }
    return (
        <div className="hk_nk">
            {message && <div className="alter">{message}</div>}
            <h2>Học kì - Niên khóa</h2>
            <div className="button-nav">
                <button onClick={showForm} className="btn-add">Thêm niên khóa</button>
            </div>
            {isShow === 1 &&
                <form onSubmit={submit} className="add_nk_form">
                    <input ref={MaNKRef} type="text" placeholder="Mã niên khóa" />
                    <input ref={TenNKRef} type="text" placeholder="Tên niên khóa" />
                    <button className="btn-outline-submit">Lưu</button>
                </form>
            }
            <div className="hk_nk_content">
                <h3>Danh sách niên khóa</h3>
                <table className="nk_table">
                    <thead>
                        <tr>
                            <th>Mã niên khóa</th>
                            <th>Tên niên Khóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datas.map((data, index) => {
                            return (
                                <tr key={index}>
                                    <td>{data.MaNK}</td>
                                    <td>{data.TenNK}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}