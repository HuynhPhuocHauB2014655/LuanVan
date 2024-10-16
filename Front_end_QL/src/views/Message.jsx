import { useEffect, useState } from "react";
import Menu from "../components/Menu";
import { useUserContext } from "../context/userContext";
import axiosClient from "../axios-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faMagnifyingGlass, faXmark, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useStateContext } from "../context/Context";
import { useRef } from "react";
import pusher from "../pusher";
import moment from 'moment';
import { useNavigate } from "react-router-dom";
export default function Message() {
    const [messages, setMessages] = useState([]);
    const [groups, setGroups] = useState([]);
    const [groupsMember, setGroupsMember] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState();
    const [showSearch, setShowSearch] = useState(false);
    const [show, setShow] = useState(false);
    const [showMem, setShowMem] = useState(false);
    const [value, setValue] = useState("");
    const [update, setUpdate] = useState(0);
    const [focus, setForcus] = useState("");
    const [fakeMessage, setFakeMessage] = useState("");
    const [resultSearch, setResultSearch] = useState();
    const [showResult, setShowResult] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const messageEndRef = useRef(null);
    const messageRef = useRef(null);
    const navigate = useNavigate();
    const {setError} = useStateContext();
    const {userName} = useUserContext();
    useEffect(()=>{
        if(userName != "admin"){
            setError("Bạn không có quyền truy cập trang này");
            navigate('/');
        }
    },[userName]);
    const fetchGroup = async () => {
        try {
            const group = await axiosClient.get(`tn`);
            setGroups(group.data);
        } catch (error) {
            console.log(error);
        }
    }
    const fetchMessages = async (id) => {
        try {
            const res = await axiosClient.get(`tn/all/${id}`);
            setMessages(res.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
            fetchGroup();
    },[]);
    const select = (data) => {
        setShow(false);
        setShowMem(false);
        fetchMessages(data.id);
        setSelectedGroup(data);
    }
    const countMem = (data) => {
        return data.length;
    }
    useEffect(() => {
        const fetchMemberNames = async () => {
            if (selectedGroup) {
                const members = await Promise.all(selectedGroup.thanh_vien.map(async (tv) => {
                    const res = await axiosClient.get(`tn/name/${tv.MaTV}`);
                    return {
                        id: tv.MaTV,
                        name: res.data
                    };
                }));
                setGroupsMember(members);
            }
        };
        fetchMemberNames();
    }, [selectedGroup]);
    useEffect(() => {
        if (fakeMessage || messages?.length > 0) {
            scrollBottom();
        }
    }, [fakeMessage, messages]);
    const scrollBottom = () => {
        messageEndRef.current.scrollIntoView({block: 'nearest',});
    }
    const ShowSearch = (state) => {
        setResultSearch(null);
        setShowResult(false);
        setForcus("");
        setShowSearch(state);
    }
    const search = (e) => {
        const searchValue = e.target.value.toLowerCase();
        const filteredMessages = messages?.filter(item => item.Nhom_id == selectedGroup.id && item.TinNhan.toLowerCase().includes(searchValue));
        setResultSearch(filteredMessages);
        if (searchValue) {
            setShowResult(true);
        } else {
            setShowResult(false);
        }
    }
    const scrollTo = (id) => {
        const element = document.getElementById(id);
        element.scrollIntoView({ inline: 'center' });
        setForcus(id);
    }
    const getDate = (date) => {
        const d = moment(date).format("hh:mm:ss DD/MM/YYYY");
        return d;
    }
    const checkBottom = () => {
        if (messageRef.current) {
            const { scrollTop, clientHeight, scrollHeight } = messageRef.current;
            const scrollBottom = scrollHeight - scrollTop - clientHeight;
            if (scrollBottom > 100) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        }
    }
    return (
        <div className="main-content">
            <Menu update={update} />
            <div className="right-part">
                <div className="page-name">Tin nhắn</div>
                <div className="flex h-[80vh] bg-white shadow-lg mt-2">
                    <div className="w-[30%] border-e-2 border-slate-300 overflow-y-auto hover:overflow-contain relative">
                        {showResult &&
                            <div className="w-full h-full absolute left-0 bg-white z-10 border-2 border-slate-300 overflow-x-hidden">
                                <div className="text-center font-bold my-3">Kết quả tìm kiếm</div>
                                {resultSearch?.length == 0 ?
                                    <div className="text-center text-red-400">Không tìm thấy kết quả trùng khớp</div>
                                    :
                                    resultSearch?.map((item) => (
                                        <div key={item.id} className="p-2 hover:bg-slate-100 cursor-pointer text-sm" onClick={() => scrollTo(item.id)}>
                                            <div className="">{item.NguoiGui}</div>
                                            <div className="">{item.TinNhan}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        }
                        {groups?.map((gr) => (
                            <div key={gr.id} className={`px-2 py-5 overflow-hidden hover:cursor-pointer hover:bg-slate-200 flex justify-between items-center ${selectedGroup?.id == gr.id && "bg-slate-400"} `} onClick={() => select(gr)}>
                                <div>
                                    <div className="text-lg">{gr.TenNhom}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="w-[70%]">
                        {selectedGroup &&
                            <div className="h-full relative">
                                <div className="relative h-full w-full">
                                    <div className="border-b-2 border-slate-300 px-2 py-3 flex justify-between items-center h-[14%]">
                                        <div >
                                            <div className="text-xl font-bold">{selectedGroup.TenNhom}</div>
                                            <div>{countMem(selectedGroup?.thanh_vien)} thành viên</div>
                                        </div>
                                        <div className="space-x-2 w-1/2 flex justify-end">
                                            {showSearch &&
                                                <input type="text" className="w-full border-2 border-slate-400 rounded-full px-5 py-2" placeholder="Nhập từ khóa tìm kiếm..." onChange={search} />
                                            }
                                            <button className="text-xl hover:text-blue-500"><FontAwesomeIcon icon={showSearch ? faXmark : faMagnifyingGlass} onClick={() => ShowSearch(!showSearch)} /></button>
                                            <button className="text-2xl hover:text-blue-500"><FontAwesomeIcon icon={faCaretLeft} onClick={() => setShow(!show)} /></button>
                                        </div>
                                    </div>
                                    <div className="h-[86%] overflow-y-scroll w-full space-y-7 py-2" ref={messageRef} onScroll={checkBottom}>
                                        {messages?.map((tn) => (
                                            <div key={tn.id} id={tn.id} className={`w-[50%] mx-2`}>
                                                <div className="mx-2">{tn.NguoiGui}</div>
                                                <div className={`w-full relative whitespace-pre-wrap break-words rounded-md shadow-md border-2 border-slate-300 px-2 py-5 ${focus === tn.id ? "bg-red-200" : ""}`}>
                                                    {tn.TinNhan}
                                                    <div className={`absolute text-xs bottom-1 right-1`}>{getDate(tn.created_at)}</div>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messageEndRef} />
                                    </div>
                                    <div className="absolute bottom-0 w-full h-[10%]">
                                        {showButton &&
                                            <button
                                                className="absolute right-5 h-[40%] top-[30%] hover:text-blue-400"
                                                onClick={scrollBottom}><FontAwesomeIcon icon={faArrowDown}
                                                    className="h-full" />
                                            </button>
                                        }
                                    </div>
                                </div>
                                {show &&
                                    <div className="absolute z-10 right-0 top-0 h-full w-1/2 bg-white border-s-2 border-slate-300">
                                        <div className="relative justify-center text-xl font-bold border-b-2 border-slate-300 flex items-center h-[14%]">
                                            <div>Thông tin nhóm</div>
                                            <button className="text-2xl absolute left-2 h-full flex justify-center items-center"><FontAwesomeIcon icon={faCaretRight} onClick={() => setShow(!show)} /></button>
                                        </div>
                                        <div className="text-center text-xl font-bold border-b-2 border-slate-300 py-5">{selectedGroup.TenNhom}</div>
                                        <div className="border-b-2 border-slate-300 px-2 py-5 min-h-[80%]">
                                            <div className="flex justify-between items-center hover:bg-slate-200 hover:cursor-pointer px-2 py-3" onClick={() => setShowMem(!showMem)}>
                                                <div>Thành viên nhóm ({countMem(selectedGroup?.thanh_vien)})</div>
                                                <button><FontAwesomeIcon icon={showMem ? faChevronUp : faChevronDown} /></button>
                                            </div>
                                            {showMem &&
                                                <div className="max-h-80 overflow-y-auto hover:overflow-contain">
                                                    {groupsMember.map((item, index) => (
                                                        <div className="ms-3 px-2 py-3 hover:bg-slate-200 hover:cursor-pointer" key={index}>{item.name}</div>
                                                    ))}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}