import {createContext, useContext, useState } from "react";

const StateContext = createContext({
    message:null,
    nienKhoa:null,
    error:null,
    setError:()=>{},
    setMessage:() =>{},
    setNienKhoa:() => {},
    _setMessage:() =>{},
    _setNienKhoa:() => {},
    _setError:() => {},
})

export const ContextProvider = ({children}) => {
    const [message,_setMessage] = useState(localStorage.getItem("message"));
    const [nienKhoa, _setNienKhoa] = useState(localStorage.getItem("nienKhoa"));
    const [error, _setError] = useState(localStorage.getItem("error"));
    const setError = (error) => {
        _setError(error)
        if(error){
            localStorage.setItem('error',error)
        }
        else{
            localStorage.removeItem('error')
        }
    }
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
            error,
            _setError,
            _setMessage,
            _setNienKhoa,
            setMessage,
            setNienKhoa,
            setError
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)