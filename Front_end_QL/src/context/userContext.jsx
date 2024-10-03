import {createContext, useContext, useState } from "react";

const StateContext = createContext({
    userName:null,
    _setUserName:() => {},
    setUserName:() => {}
})

export const UserProvider = ({children}) => {
    const [userName,_setUserName] = useState(sessionStorage.getItem('userName'));
    const setUserName = (userName) => {
        _setUserName(userName)
        if(userName){
            sessionStorage.setItem('userName',userName)
        }
        else{
            sessionStorage.removeItem('userName')
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