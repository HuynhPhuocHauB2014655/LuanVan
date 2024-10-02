import { useEffect, useState, useMemo } from "react";
import Menu from "../components/Menu";
import { useUserContext } from "../context/userContext";
import axiosClient from "../axios-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faMagnifyingGlass, faXmark, faArrowDown, faArrowLeft, faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useStateContext } from "../context/Context";
import { useRef } from "react";
import pusher from "../pusher";
import moment from 'moment';
export default function Message() {
    const { userName, info } = useUserContext();
    const [messages, setMessages] = useState([]);
    const [groups, setGroups] = useState([]);
    const [groupsMember, setGroupsMember] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState();
    const [toggleResult, setToggleResult] = useState(true);
    const [onMd, setOnMd] = useState(false);
    const [isGroupListVisible, setGroupListVisible] = useState(true);
    const [showSearch, setShowSearch] = useState(false);
    const [show, setShow] = useState(false);
    const [showMem, setShowMem] = useState(false);
    const [value, setValue] = useState("");
    const [count, setCount] = useState([]);
    const [update, setUpdate] = useState(0);
    const [focus, setForcus] = useState("");
    const [fakeMessage, setFakeMessage] = useState("");
    const [resultSearch, setResultSearch] = useState();
    const [showResult, setShowResult] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const { setMessage, setError } = useStateContext();
    const messageEndRef = useRef(null);
    const messageRef = useRef(null);
    const fetchGroup = async () => {
        try {
            const group = await axiosClient.get(`tn/${userName}`);
            setGroups(group.data);
            const c = await axiosClient.get(`tn/count/${userName}`);
            setCount(c.data);
        } catch (error) {
            console.log(error);
        }
    }
    const fetchMessages = async (id) => {
        try {
            const res = await axiosClient.get(`tn/group/${id}`);
            setMessages(res.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (info?.HoTen) {
            fetchGroup();
        }
    }, [info]);
    const select = (data) => {
        setShow(false);
        setShowMem(false);
        fetchMessages(data.id);
        setSeen(data);
        setSelectedGroup(data);
        if (onMd) {
            setGroupListVisible(false);
        }
    }
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setOnMd(true);
            } else {
                setOnMd(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
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
    const handleChange = (e) => {
        setValue(e.target.value);
    };
    const pressKey = async (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            setValue(prevValue => prevValue + '\n');
        }
        if (!e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            const payload = {
                "Nhom_id": selectedGroup.id,
                NguoiGui: `${userName}-${info.HoTen}`,
                TinNhan: value
            };
            setFakeMessage(payload.TinNhan);
            setValue("");
            try {
                const res = await axiosClient.post("tn/add", payload);
                setMessages(prevMessages => [...prevMessages, res.data]);
                setFakeMessage("");
            } catch (error) {
                console.log(error);
            }
        }
    }
    useEffect(() => {
        if (fakeMessage || personalMessage().length > 0) {
            scrollBottom();
        }
    }, [fakeMessage, messages]);
    const scrollBottom = () => {
        messageEndRef.current.scrollIntoView();
    }
    useEffect(() => {
        const channel = pusher.subscribe(`chat.${userName}`);

        channel.bind('App\\Events\\sendMessage', (data) => {
            fetchGroup();
            if (selectedGroup && selectedGroup.id == data.message.Nhom_id) {
                setSeen(selectedGroup);
                setMessages(prevMessages => [...prevMessages, data.message]);
            }
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [userName, selectedGroup]);
    const setSeen = async (data) => {
        try {
            const payload = {
                'Nhom_id': data.id,
                'NguoiNhan': `${userName}-${info.HoTen}`
            }
            await axiosClient.put('tn', payload);
        } catch (error) {
            console.log(error);
        } finally {
            fetchGroup();
            setUpdate(2);
        }
    }
    const personalMessage = () => {
        return messages.filter(item => (item.NguoiGui == `${userName}-${info.HoTen}` && item.NguoiNhan == selectedGroup.id) || item.NguoiNhan == `${userName}-${info.HoTen}`)
    }
    const ShowSearch = (state) => {
        setResultSearch(null);
        setShowResult(false);
        setForcus("");
        setShowSearch(state);
        setToggleResult(true);
    }
    const search = (e) => {
        const searchValue = e.target.value.toLowerCase();
        const filteredMessages = personalMessage().filter(item => item.Nhom_id == selectedGroup.id && item.TinNhan.toLowerCase().includes(searchValue));
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
        setToggleResult(false);
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
    const countNotSeen = (id) => {
        const c = count.find(item => item.id == id);
        if (c) {
            return c.unread_count;
        }
    }
    const showListGroup = () => {
        setSelectedGroup(null);
        setGroupListVisible(true);
    }
    const changeToogleResult = (state) => {
        setToggleResult(state);
    }
    return (
        <div className="main-content">
            <Menu update={update} />
            <div className="right-part">
                <div className="page-name relative">
                    <button className={`absolute left-0 hover:text-blue-300 ${(!onMd || isGroupListVisible) && "hidden"}`} onClick={showListGroup}><FontAwesomeIcon icon={faArrowLeft} /></button>
                    Tin nhắn
                </div>
                <div className="md:flex h-[80vh] bg-white shadow-lg mt-2 relative">
                    {(showResult && !toggleResult) &&
                        <button type="button" onClick={() => changeToogleResult(true)} className="absolute top-1/2 text-xl z-10"><FontAwesomeIcon icon={faAnglesRight} /></button>
                    }
                    {showResult &&
                        <div className={`w-1/2 h-full absolute left-0 bg-white z-10 border-2 border-slate-300 overflow-x-hidden ${!toggleResult && "hidden"}`}>
                            <div className="text-center font-bold my-3 relative">
                                Kết quả tìm kiếm
                                <button type="button" onClick={() => changeToogleResult(false)} className="absolute right-1 text-xl"><FontAwesomeIcon icon={faAnglesLeft} /></button>
                            </div>
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
                    <div
                        className={`
                            md:w-[30%] w-full border-e-2 border-slate-300 overflow-y-auto hover:overflow-contain relative
                            ${(!isGroupListVisible && onMd) && 'hidden'}
                        `}>
                        {groups?.map((gr) => (
                            <div key={gr.id} className={`px-2 py-5 overflow-hidden hover:cursor-pointer hover:bg-slate-200 flex justify-between items-center ${selectedGroup?.id == gr.id && "bg-slate-400"} `} onClick={() => select(gr)}>
                                <div>
                                    <div className="text-lg">{gr.TenNhom}</div>
                                    <div className="text-sm">{!gr.tin_nhan[0] ? "" : `${gr.tin_nhan[0]?.NguoiGui}: ${gr.tin_nhan[0]?.TinNhan.length > 10 ? `${gr.tin_nhan[0]?.TinNhan.substring(0, 10)}...` : gr.tin_nhan[0]?.TinNhan}`}</div>
                                </div>
                                {countNotSeen(gr.id) > 0 &&
                                    <div className="border border-red-500 rounded-full w-5 h-5 text-xs flex items-center justify-center text-white bg-red-500">{countNotSeen(gr.id)}</div>
                                }
                            </div>
                        ))}
                    </div>
                    <div className={`md:w-[70%] h-full w-full ${(onMd && isGroupListVisible) && "hidden"}`}>
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
                                    <div className="h-[76%] overflow-y-scroll w-full space-y-7 py-2" ref={messageRef} onScroll={checkBottom}>
                                        {personalMessage().map((tn) => (
                                            <div key={tn.id} id={tn.id} className={`w-[50%] mx-2 ${tn.NguoiGui !== `${userName}-${info.HoTen}` ? '' : 'ml-auto text-end'}`}>
                                                <div className="mx-2">{tn.NguoiGui}</div>
                                                <div className={`w-full relative whitespace-pre-wrap break-words rounded-md shadow-md border-2 border-slate-300 px-2 py-5 ${focus === tn.id ? "bg-red-200" : ""}`}>
                                                    {tn.TinNhan}
                                                    <div className={tn.NguoiGui !== `${userName}-${info.HoTen}` ? `absolute text-xs bottom-1 right-1` : `absolute text-xs bottom-1 left-1`}>{getDate(tn.created_at)}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {fakeMessage &&
                                            <div className={`w-[50%] mx-2 ml-auto text-end`}>
                                                <div className="mx-2">{`${userName}-${info.HoTen}`}</div>
                                                <div className={`w-full relative whitespace-pre-wrap break-words rounded-md shadow-md border-2 border-slate-300 px-2 py-5`}>
                                                    {fakeMessage}
                                                    <div className="absolute text-xs bottom-1 left-1">{getDate(new Date())}</div>
                                                </div>
                                            </div>
                                        }
                                        <div ref={messageEndRef} />
                                    </div>
                                    <div className="absolute bottom-0 w-full h-[10%]">
                                        <textarea type="text" name="TinNhan"
                                            placeholder="Nhập nội dung tin nhắn"
                                            onKeyDown={pressKey}
                                            onChange={handleChange}
                                            value={value}
                                            className="outline-none h-full w-full px-2 border-y-2 py-3 resize-none" />
                                        {showButton &&
                                            <button
                                                className="absolute right-2 h-[40%] top-[30%] hover:text-blue-400"
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