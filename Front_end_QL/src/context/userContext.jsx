import {createContext, useContext, useState } from "react";

const StateContext = createContext({
    maBaoMat:null,
    _setMaBaoMat:() => {},
    setMaBaoMat:() => {}
})

export const UserProvider = ({children}) => {
    const [maBaoMat,_setMaBaoMat] = useState(sessionStorage.getItem('maBaoMat'));
    const setMaBaoMat = (maBaoMat) => {
        _setMaBaoMat(maBaoMat)
        if(maBaoMat){
            sessionStorage.setItem('maBaoMat',maBaoMat)
        }
        else{
            sessionStorage.removeItem('maBaoMat')
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