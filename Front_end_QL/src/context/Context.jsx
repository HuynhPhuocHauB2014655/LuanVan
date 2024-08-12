import {createContext, useContext, useState } from "react";

const StateContext = createContext({
    message:null,
    nienKhoa:null,
    setMessage:() =>{},
    setNienKhoa:() => {},
    _setMessage:() =>{},
    _setNienKhoa:() => {},
})

export const ContextProvider = ({children}) => {
    const [message,_setMessage] = useState(localStorage.getItem("message"));
    const [nienKhoa, _setNienKhoa] = useState(localStorage.getItem("nienKhoa"));
    const setMessage = (message) => {
        _setMessage(message)
        if(message){
            localStorage.setItem('message',message)
        }
        else{
            localStorage.removeItem('message')
        }
    }
    const setNienKhoa = (nienKhoa) => {
        _setNienKhoa(nienKhoa)
        if(nienKhoa){
            localStorage.setItem('nienKhoa',nienKhoa)
        }
        else{
            localStorage.removeItem('nienKhoa')
        }
    }
    return(
        <StateContext.Provider value={{
            message,
            nienKhoa,
            _setMessage,
            _setNienKhoa,
            setMessage,
            setNienKhoa
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)