import { useEffect, useState } from "react";
import Menu from "../components/Menu";
import { useUserContext } from "../context/userContext";
import axiosClient from "../axios-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPlusCircle, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { useStateContext } from "../context/Context";
import moment from 'moment-timezone';
export default function Notification() {
    const { userName } = useUserContext();
    const [tb, setTb] = useState([]);
    const [reading, setReading] = useState();
    const [update,setUpdate] = useState(0);
    const [info, setInfo] = useState();
    useEffect(() => {
        const fetchTB = async () => {
            const Info = await axiosClient.get(`/hs/show/${userName}`);
            setInfo(Info.data);
            const response = await axiosClient.get(`/tb/hs/${userName}`);
            setTb(response.data);
        };
        fetchTB();
    }, [userName]);
    const read = async (data) => {
        if (data.TrangThai == 0) {
            try {
                data.TrangThai = 1;
                const response = await axiosClient.put(`/tb/update/`, data);
            } catch (error) {
                console.log(error);
            }finally{
                setUpdate(1);
            }
        }
        setReading(data);
    }
    const getDate = (date) => {
        const d = moment(date).utc().format("HH:mm:ss DD/MM/YYYY");
        return d;
    }
    return (
        <div className="main-content">
            <Menu update={update}/>
            <div className="right-part">
                <div className="page-name">Thông báo</div>
                <div className="h-[70vh] mt-2 border-2 border-black flex bg-[#f2f2f2] relative">
                    <div className="w-[20%] border-e-2 border-black overflow-auto hover:overflow-contain">
                        {tb?.map((tb) => (
                            <div key={tb.id} 
                                className={reading?.id == tb.id ? "p-2 bg-cyan-300 cursor-pointer border-b-2 border-slate-500 relative" : (tb.TrangThai == 1 ? "p-2 hover:bg-sky-500 cursor-pointer border-b-2 border-slate-500 relative" : "p-2 hover:bg-gray-100 bg-slate-200 cursor-pointer border-b-2 border-slate-500 relative")}
                                onClick={() => read(tb)}
                            >
                                <div className="text-lg">{tb.NguoiGui}</div>
                                <div className="text-md">{tb.TieuDe.substring(0, 25)}{tb.TieuDe.length > 25 && "..."}</div>
                                <div className="text-xs ">{getDate(tb.created_at)}</div>
                            </div>
                        ))}
                    </div>
                    <div className="w-[80%] p-3 relative" >
                        {reading &&
                            <div >
                                <div className="absolute bottom-0 left-1">Gửi lúc: {getDate(reading.created_at)}</div>
                                <div className="text-xl">Từ: {reading.NguoiGui}</div>
                                <div className="text-lg">Tiêu đề: {reading.TieuDe}</div>
                                <div className="border-b-2 border-black"></div>
                                <div className="text-md mt-3">Nội dung: <div>{reading.NoiDung}</div></div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}