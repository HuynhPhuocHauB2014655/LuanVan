import {createContext, useContext, useState } from "react";
import axiosClient from "../axios-client";

const StateContext = createContext({
    info:null,
    userName:null,
    _setUserName:() => {},
    setUserName:() => {},
    _setInfo:() => {},
    setInfo:() => {}
})

export const UserProvider = ({children}) => {
    const [userName,_setUserName] = useState(localStorage.getItem("userName"));
    const [info,_setInfo] = useState();
    const setUserName = (userName) => {
        _setUserName(userName)
        if(userName){
            localStorage.setItem('userName',userName)
        }
        else{
            localStorage.removeItem('userName')
        }
    }
    const setInfo = async (username) => {
        const response = await axiosClient.get(`/gv/show/${username}`);
        _setInfo(response.data);
    }
    return(
        <StateContext.Provider value={{
            userName,
            info,
            _setUserName,
            setUserName,
            _setInfo,
            setInfo
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useUserContext = () => useContext(StateContext)