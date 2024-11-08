import { useEffect, useState } from "react";
import Menu from "../components/Menu";
import { useUserContext } from "../context/userContext";
import axiosClient from "../axios-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPlusCircle, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import NoitifyForm from "../components/NoitifyForm";
import { useStateContext } from "../context/Context";
import moment from 'moment-timezone';
import Header from "../components/Header";
export default function Notification() {
    const { userName } = useUserContext();
    const { setMessage, setError } = useStateContext();
    const [tb, setTb] = useState([]);
    const [sended, setSended] = useState([]);
    const [reading, setReading] = useState();
    const [update, setUpdate] = useState(0);
    const [state, setState] = useState(1);
    const [showForm, setShowForm] = useState(0);
    const [info, setInfo] = useState();
    const fetchTB = async () => {
        const Info = await axiosClient.get(`/gv/show/${userName}`);
        setInfo(Info.data);
        const response = await axiosClient.get(`/tb/gv/${userName}`);
        setTb(response.data);
        const send = await axiosClient.get(`/tb/gv/send/${userName}`);
        setSended(send.data);
    };
    useEffect(() => {
        fetchTB();
    }, [userName]);
    const read = async (data) => {
        if (data.TrangThai == 0) {
            try {
                data.TrangThai = 1;
                const response = await axiosClient.put(`/tb/update/`, data);
            } catch (error) {
                console.log(error);
            } finally {
                setUpdate(1);
            }
        }
        setReading(data);
    }
    const sendTB = async (value) => {
        const nguoiNhan = value.NguoiNhan.split(';').filter(id => id !== '');
        nguoiNhan.map(async (item) => {
            const payload = {
                NguoiGui: info.TenGV + " - " + userName,
                NguoiNhan: item,
                NoiDung: value.NoiDung,
                TrangThai: 0,
                TieuDe: value.TieuDe
            };
            try {
                await axiosClient.post("/tb/add", payload);
                setMessage("Đã gửi thành công!");
            } catch (error) {
                setError(typeof error.response.data == 'string' ? error.response.data : 'Lỗi không xác định');
            } finally {
                fetchTB();
                setShowForm(0);
            }
        })
    }
    const getDate = (date) => {
        const d = moment(date).utc().format("HH:mm:ss DD/MM/YYYY");
        return d;
    }
    return (
        <div>
            <Header update={update}/>
            <div className="main-content">
                <Menu  />
                <div className="right-part">
                    <div className="page-name">Thông báo</div>
                    <div className="h-[70vh] mt-2 border-2 border-black flex bg-[#f2f2f2] relative">
                        <div className="w-[20%] border-e-2 border-black overflow-auto hover:overflow-contain">
                            <div className="w-full grid grid-rows-1 grid-flow-col">
                                <button className={state == 1 ? "border-b-2 border-e-2 border-black bg-slate-400 py-1" : "border-b-2 border-e-2 border-black py-1"} onClick={() => setState(1)}>Đã nhận</button>
                                <button className={state == 2 ? "border-b-2 border-black bg-slate-500 py-1" : "border-b-2 border-black py-1"} onClick={() => setState(2)}>Đã gửi</button>
                            </div>
                            {state == 1 && tb?.map((tb) => (
                                <div key={tb.id}
                                    className={reading?.id == tb.id ? "p-2 bg-cyan-300 cursor-pointer border-b-2 border-slate-500 relative" : (tb.TrangThai == 1 ? "p-2 hover:bg-sky-500 cursor-pointer border-b-2 border-slate-500 relative" : "p-2 hover:bg-gray-100 bg-slate-200 cursor-pointer border-b-2 border-slate-500 relative")}
                                    onClick={() => read(tb)}
                                >
                                    <div className="text-lg">{tb.NguoiGui}</div>
                                    <div className="text-md">{tb.TieuDe.substring(0, 25)}{tb.TieuDe.length > 25 && "..."}</div>
                                    <div className="text-xs">{getDate(tb.created_at)}</div>
                                </div>
                            ))}
                            {state == 2 && sended?.map((tb) => (
                                <div key={tb.id}
                                    className={reading?.id == tb.id ? "p-2 bg-cyan-300 cursor-pointer border-b-2 border-slate-500 relative" : "p-2 hover:bg-sky-500 cursor-pointer border-b-2 border-slate-500 relative"}
                                    onClick={() => setReading(tb)}
                                >
                                    <div className="text-lg">Đến: {tb.NguoiNhan}</div>
                                    <div className="text-md">{tb.TieuDe.substring(0, 25)}{tb.TieuDe.length > 25 && "..."}</div>
                                    <div className="text-xs">{getDate(tb.created_at)}</div>
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
                        <button
                            className="absolute z-10 bottom-1 right-1 text-xl border-2 border-blue-500 px-2 py-1 rounded-full hover:bg-blue-500 hover:text-white"
                            onClick={() => setShowForm(1)}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                        {showForm == 1 &&
                            <NoitifyForm close={() => setShowForm(0)} handleSubmit={sendTB} />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}