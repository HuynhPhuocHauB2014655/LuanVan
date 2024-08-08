import {createContext, useContext, useState } from "react";

const StateContext = createContext({
    currentPage: null,
    setCurrentPage:() =>{},
    totalPages: null,
    setTotalPages:() =>{},
    startPage: null,
    setStartPage:() =>{},
    endPage:null,
    setEndPage:() => {}
})

export const PageContextProvider = ({children}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [startPage, setStartPage] = useState(0);
    const [endPage, setEndPage] = useState(0);
    return(
        <StateContext.Provider value={{
            currentPage,
            setCurrentPage,
            totalPages,
            setTotalPages,
            startPage,
            setStartPage,
            endPage,
            setEndPage
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const usePageContext = () => useContext(StateContext);