import { useEffect, useState } from "react";
import Menu from "../components/Menu";
import { useUserContext } from "../context/userContext";
import axiosClient from "../axios-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useStateContext } from "../context/Context";
import { useRef } from "react";
import pusher from "../pusher";
export default function Message() {
    const { userName } = useUserContext();
    const [messages, setMessages] = useState([]);
    const [groups, setGroups] = useState([]);
    const [groupsMember, setGroupsMember] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState();
    const [show, setShow] = useState(false);
    const [showMem, setShowMem] = useState(false);
    const [value, setValue] = useState("");
    const [info, setInfo] = useState({});
    const { setMessage, setError } = useStateContext();
    const messageEndRef = useRef(null);

    const fetchGroup = async () => {
        try {
            const group = await axiosClient.get(`tn/${userName}`);
            setGroups(group.data);
            const response = await axiosClient.get(`/hs/show/${userName}`);
            setInfo(response.data);
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
        fetchGroup();
    }, [userName]);
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
                NguoiNhan:selectedGroup.id,
                TinNhan: value
            };
            setMessages(prevMessages => [...prevMessages, payload]);
            setValue("");
            try {
                await axiosClient.post("tn/add", payload);
            } catch (error) {
                console.log(error);
            } finally {
                fetchMessages(selectedGroup.id);
            }
        }
    }
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    useEffect(() => {
        const channel = pusher.subscribe(`chat.${userName}`);

        channel.bind('App\\Events\\sendMessage', (data) => {
            fetchMessages(selectedGroup.id);
            setMessages(prevMessages => [...prevMessages, data.message]);
        });

        // Clean up on component unmount
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);
    console.log(selectedGroup);
    return (
        <div className="main-content">
            <Menu />
            <div className="right-part">
                <div className="page-name">Tin nhắn</div>
                <div className="flex h-[80vh] bg-white shadow-lg mt-2">
                    <div className="w-[20%] border-e-2 border-slate-300 overflow-y-auto hover:overflow-contain">
                        {groups?.map((gr) => (
                            <div key={gr.id} className={selectedGroup?.id == gr.id ? "px-2 py-5 hover:cursor-pointer bg-slate-400" : "px-2 py-5 hover:cursor-pointer hover:bg-slate-200"} onClick={() => select(gr)}>
                                <div>{gr.TenNhom}</div>
                            </div>
                        ))}
                    </div>
                    <div className="w-[80%] ">
                        {selectedGroup &&
                            <div className="grid grid-rows-1 grid-flow-col h-full">
                                <div className="relative h-full w-full">
                                    <div className="border-b-2 border-slate-300 px-2 py-3 flex justify-between items-center h-[14%]">
                                        <div >
                                            <div className="text-xl font-bold">{selectedGroup.TenNhom}</div>
                                            <div>{countMem(selectedGroup?.thanh_vien)} thành viên</div>
                                        </div>
                                        <div>
                                            <button className="text-2xl"><FontAwesomeIcon icon={show ? faCaretRight : faCaretLeft} onClick={() => setShow(!show)} /></button>
                                        </div>
                                    </div>
                                    <div className="h-[76%] overflow-y-auto flex-col-reverse w-full space-y-7">
                                        {messages?.filter(item => (item.NguoiGui == `${userName}-${info.HoTen}` && item.NguoiNhan == selectedGroup.id) || item.NguoiNhan == `${userName}-${info.HoTen}`).map((tn) => (
                                            <div key={tn.id} className={` whitespace-pre-wrap rounded-md shadow-md w-[40%] border-2 px-2 py-3 mx-2 flex ${tn.NguoiGui !== `${userName}-${info.HoTen}` ? '' : 'ml-auto justify-end'}`}>{tn.TinNhan}</div>
                                        ))}
                                        <div ref={messageEndRef} />
                                    </div>
                                    <div className="absolute bottom-0 w-full h-[10%]">
                                        <textarea type="text" name="TinNhan"
                                            placeholder="Nhập nội dung tin nhắn"
                                            onKeyDown={pressKey}
                                            onChange={handleChange}
                                            value={value}
                                            className="outline-none h-full w-full px-2 border-y-2 py-3 resize-none" />
                                    </div>
                                </div>
                                {show &&
                                    <div className="relative h-full w-full border-s-2 border-slate-300">
                                        <div className="justify-center text-xl font-bold border-b-2 border-slate-300 flex items-center h-[14%]">Thông tin nhóm</div>
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