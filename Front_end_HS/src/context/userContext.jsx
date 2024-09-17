import {createContext, useContext, useState } from "react";
import axiosClient from "../axios-client";

const StateContext = createContext({
    info:null,
    userName:null,
    userNamePH:null,
    _setUserName:() => {},
    setUserName:() => {},
    _setInfo:() => {},
    setInfo:() => {},
    _setUserNamePH:() => {},
    setUserNamePH:() => {}
})

export const UserProvider = ({children}) => {
    const [userName,_setUserName] = useState(localStorage.getItem("userName"));
    const [info,_setInfo] = useState();
    const [userNamePH,_setUserNamePH] = useState(localStorage.getItem("userNamePH"));
    const setUserNamePH = (userName) => {
        _setUserNamePH(userName)
        if(userName){
            localStorage.setItem('userNamePH',userName)
        }
        else{
            localStorage.removeItem('userNamePH')
        }
    }
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
        const response = await axiosClient.get(`/hs/show/${username}`);
        _setInfo(response.data);
    }
    return(
        <StateContext.Provider value={{
            userName,
            info,
            userNamePH,
            _setUserName,
            setUserName,
            _setInfo,
            setInfo,
            _setUserNamePH,
            setUserNamePH
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useUserContext = () => useContext(StateContext)