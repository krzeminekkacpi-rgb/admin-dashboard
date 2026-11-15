import { useSwitch } from "./SwitchContext";

export function Switch() {
    const {checked, setChecked} = useSwitch(); 
    return (
        <>
            <input type="checkbox" id="switch" checked={checked} onChange={(e) => setChecked(e.target.checked)}></input>
            <label htmlFor='switch' className='Switch-mode'></label>
        </>
    );
}