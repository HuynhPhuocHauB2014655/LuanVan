import {createContext, useContext, useState } from "react";

const StateContext = createContext({
    maBaoMat:null,
    _setMaBaoMat:() => {},
    setMaBaoMat:() => {}
})

export const UserProvider = ({children}) => {
    const [maBaoMat,_setMaBaoMat] = useState(localStorage.getItem("maBaoMat"));
    const setMaBaoMat = (maBaoMat) => {
        _setMaBaoMat(maBaoMat)
        if(maBaoMat){
            localStorage.setItem('maBaoMat',maBaoMat)
        }
        else{
            localStorage.removeItem('maBaoMat')
        }
    }
    return(
        <StateContext.Provider value={{
            maBaoMat,
            _setMaBaoMat,
            setMaBaoMat
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useUserContext = () => useContext(StateContext)