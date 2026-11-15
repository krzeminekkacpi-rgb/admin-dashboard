import { useEffect, useState, useRef } from 'react';
import Bin from '../assets/bin.png'
import F from '../assets/letter-f.png'
import Sound from '../assets/keyboard.mp3'
import Volume from '../assets/m-volume.png'
import './Notepad.css';

export function Notepad() {
    const [isBold, setIsBold] = useState(false);
    const [isFont, setIsFont] = useState(false);
    const textField = useRef();
    const Music = new Audio(Sound);
    const [textValue, setTextValue] = useState(() => {
        try {
        return JSON.parse(localStorage.getItem('textValue'));
        } catch {
            return '';
        }
    });

function Save(value) {
    setTextValue(value)
    isBold && Music.play();
}

    function Clear() {
        setTextValue('');
    }

    useEffect(() => {
        isFont ? textField.current.classList.add('Cursive') : textField.current.classList.remove('Cursive');
    }, [isFont])

    useEffect(() => {
        localStorage.setItem('textValue', JSON.stringify(textValue))
    }, [textValue])
    return (
        <div className="Notepad-main">
            <textarea className='Text-max' ref={textField} onChange={(e) => Save(e.target.value)}  value={textValue}></textarea>
            <div className='Notepad-sidebar'>
                <button className='Bin-button' onClick={() => isFont ? setIsFont(false) : setIsFont(true)}><img src={F} className='Icon-size'/></button>
                <button className='Bin-button' onClick={() => isBold ? setIsBold(false) : setIsBold(true)}><img src={Volume} className='Icon-size'/></button>
                <button className='Bin-button' onClick={Clear}><img src={Bin} className='Icon-size'/></button>
            </div>
        </div>
    )
}