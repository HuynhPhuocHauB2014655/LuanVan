import axiosClient from "../axios-client"
import React, { useEffect, useState } from 'react';
export default function Student(){
    const [datas,setDatas] = useState([])
    useEffect(() => {
        // Function to fetch data from the API when the component mounts
        const fetchData = async () => {
            try {
                const response = await axiosClient.get('/hs/index');
                setDatas(response.data);
                // console.log(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle errors (e.g., display an error message)
            }
        };

        fetchData();
    }, []);
    console.log(datas);
    return (
        <div className="student">
            <h2>Quản lí học sinh</h2>
            <div className="button-nav">
                <button className="btn-info">Danh sách học sinh</button>
                <button className="btn-add">Thêm học sinh</button>
            </div>
        </div>
    )
}