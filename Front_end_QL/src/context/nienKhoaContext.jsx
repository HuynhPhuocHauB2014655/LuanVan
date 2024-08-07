import {createContext, useContext, useState } from "react";

const StateContext = createContext({
    nienKhoa: '',
    setNienKhoa:() =>{}
})

export const ContextProvider = ({children}) => {
    const [nienKhoa,setNienKhoa] = useState("");
    return(
        <StateContext.Provider value={{
            nienKhoa,
            setNienKhoa,
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useNienKhoaContext = () => useContext(StateContext)