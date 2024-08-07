import {createContext, useContext, useState } from "react";

const StateContext = createContext({
    message:null,
    nienKhoa:null,
    setMessage:() =>{},
    setNienKhoa:() => {}

})

export const ContextProvider = ({children}) => {
    const [message,setMessage] = useState("");
    const [nienKhoa, setNienKhoa] = useState("");
    return(
        <StateContext.Provider value={{
            message,
            nienKhoa,
            setMessage,
            setNienKhoa
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)