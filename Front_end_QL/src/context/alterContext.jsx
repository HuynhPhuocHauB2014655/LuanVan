import {createContext, useContext, useState } from "react";

const StateContext = createContext({
    message:null,
    setMessage:() =>{}
})

export const ContextProvider = ({children}) => {
    const [message,setMessage] = useState("");
    return(
        <StateContext.Provider value={{
            message,
            setMessage,
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)