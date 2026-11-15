import { useState, createContext, useContext } from "react"

const SwitchContext = createContext();
 
export function SwitchProvider({ children }) {
    const [checked, setChecked] = useState(false);
    return (
        <>
            <SwitchContext.Provider value={{checked, setChecked}}>
                {children}
            </SwitchContext.Provider>
        </>
    )
}

export function useSwitch() {
    return useContext(SwitchContext);
}