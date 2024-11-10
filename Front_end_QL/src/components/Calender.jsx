import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useStateContext } from '../context/Context';
import { useUserContext } from '../context/userContext';
import axiosClient from '../axios-client';
const Calendar = () => {
    library.add(fas);
    const [currentDate, setCurrentDate] = useState(new Date());
    const { message, setMessage, error, setError } = useStateContext();
    const { userName } = useUserContext();
    const [note, setNote] = useState();
    const [showF, setShowF] = useState(0);
    const [day, SetDay] = useState();
    const [month, SetMonth] = useState();
    const [year, SetYear] = useState();
    const [value, setValue] = useState();
    const [curentNote, setCurrentNote] = useState();
    const getNote = async () => {
        try {
            const res = await axiosClient.get(`/note/show/${userName}`);
            setNote(res.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (userName) {
            getNote();
        }
    }, [userName]);
    // Helper functions to get the month's data
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // Get current month and year
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Generate the list of days for the current month
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    // Generate empty cells for the first empty days of the month
    const daysArray = [];
    for (let i = 0; i < firstDay; i++) {
        daysArray.push(null); // Empty slots before the 1st of the month
    }

    for (let i = 1; i <= daysInMonth; i++) {
        daysArray.push(i);
    }

    // Handle month navigation
    const changeMonth = (direction) => {
        if (direction === 'prev') {
            setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
        } else if (direction === 'next') {
            setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
        }
    };
    const changeValue = (e) => {
        setValue(e.target.value);
    }
    const chooseCell = (data, d, m, y) => {
        SetDay(d);
        SetMonth(m);
        SetYear(y);
        if (data) {
            setValue(data.Note);
            setCurrentNote(data);
            setShowF(1);
        } else {
            setShowF(2);
        }
    }
    const submitF = async (e) => {
        e.preventDefault();
        if (showF == 2) {
            const payload = {
                UserName: userName,
                Note: value,
                Day: day,
                Month: month,
                Year: year
            }
            try {
                const res = await axiosClient.post("/note/create", payload);
                closeF();
                setNote((prevNotes) => [...prevNotes, res.data]);
                setMessage("Đã cập nhật thành công!");
            } catch (error) {
                console.log(error);
            }
        } else {
            var Note = curentNote;
            Note.Note = value;
            try {
                const res = await axiosClient.put("/note/update", Note);
                closeF();
                setNote((prevNotes) => [...prevNotes, res.data]);
                setMessage("Đã cập nhật thành công!");
            } catch (error) {
                console.log(error);
            }
        }
    }
    const closeF = () => {
        setShowF(0);
        setValue("");
    }
    const deleteNote = async () => {
        try {
            await axiosClient.delete(`/note/delete/${curentNote.id}`);
            setMessage("Đã cập nhật thành công!");
            closeF();
            setNote((prevNotes) => prevNotes.filter(note => note.id !== curentNote.id));
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="calendar h-full border-2 relative">
            <div className="calendar-header">
                <button onClick={() => changeMonth('prev')}><FontAwesomeIcon icon="fa-solid fa-angles-left" /></button>
                <h2>
                    {`Tháng ${currentDate.getMonth()+1} Năm ${currentDate.getFullYear()}`}
                </h2>

                <button onClick={() => changeMonth('next')}><FontAwesomeIcon icon="fa-solid fa-angles-right" /></button>
            </div>
            {showF > 0 &&
                <form onSubmit={submitF} className='absolute z-10 top-20 border-2 p-5 bg-white w-1/2 space-y-3'>
                    <button className='absolute top-1 right-1 text-sm rounded-full hover:text-red-500' onClick={closeF}>X</button>
                    <div className='text-lg text-center bg-slate-400 p-2 rounded text-white font-bold'>{showF == 2 ? "Nhập ghi chú" : "Sửa ghi chú"}</div>
                    <div>Ngày: {day}/{month}/{year}</div>
                    <div>
                        <div htmlFor="Note">Ghi chú</div>
                        <textarea
                            name="Note" cols="30" rows="5"
                            className='border-2 resize-none w-full p-3'
                            placeholder='Nhập ghi chú...'
                            value={value}
                            onChange={changeValue}
                        >
                        </textarea>
                    </div>
                    <div className='flex justify-between'>
                        {showF == 1 &&
                            <button type='button' onClick={deleteNote} className='p-2 border-2 border-red-400 rounded w-1/2 hover:bg-red-500 hover:text-white'>Xóa</button>
                        }
                        <button type='submit' className={`p-2 border-2 border-blue-400 rounded ${showF == 1 ? "w-1/2" : "w-full"} hover:bg-blue-500 hover:text-white`}>Lưu</button>
                    </div>
                </form>}
            <div className="calendar-grid">
                {['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'].map((day, index) => (
                    <div key={index} className="calendar-cell header flex items-center justify-center">{day}</div>
                ))}

                {note && daysArray.map((day, index) => {
                    const n = note.find(item => item.Day == day && item.Month == currentMonth + 1 && item.Year == currentYear);
                    return (
                        <div key={index}
                            className={`calendar-cell ${(day == new Date().getDate() && currentMonth == new Date().getMonth() && currentYear == new Date().getFullYear()) && "bg-slate-400"} p-2`}
                            onClick={day ? () => chooseCell(n || "", day, currentMonth + 1, currentYear) : undefined}
                        >
                            <p className=''>{day}</p>
                            <div className='mt-3 text-sm overflow-hidden'>{n?.Note}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default Calendar;
