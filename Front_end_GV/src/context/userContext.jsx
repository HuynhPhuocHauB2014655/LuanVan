import {createContext, useContext, useState } from "react";

const StateContext = createContext({
    userName:null,
    _setUserName:() => {},
    setUserName:() => {}
})

export const UserProvider = ({children}) => {
    const [userName,_setUserName] = useState(localStorage.getItem("userName"));
    const setUserName = (userName) => {
        _setUserName(userName)
        if(userName){
            localStorage.setItem('userName',userName)
        }
        else{
            localStorage.removeItem('userName')
        }
    }
    return(
        <StateContext.Provider value={{
            userName,
            _setUserName,
            setUserName
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useUserContext = () => useContext(StateContext)