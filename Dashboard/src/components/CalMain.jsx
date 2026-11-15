import { useState } from 'react';
import { Switch } from './Switch'
import './CalMain.css'
import { useTranslation } from 'react-i18next';

export function CalMain({ hidden, setHidden }) {
    const [countValue, setCountValue] = useState('');
    const scrollHide = JSON.parse(localStorage.getItem('scrollHide'));
    const { t } = useTranslation();

    return (
        <div className="MainBoard" style={{ scrollbarWidth: scrollHide ? 'none' : 'auto' }}>
            <div className='Up-board'>
                <div className='Up-element'>
                    <input type='checkbox' id="butt" checked={hidden} onChange={(e) => setHidden(e.target.checked)} ></input>
                    <label htmlFor='butt' className='Hide-show'></label>
                    <h1 className='Font margin'>{t('Calculator.Name')}</h1>
                </div>
                <div className='Up-element2'>
                    <Switch />
                </div>
            </div>
            <hr className='Line'></hr>
            <div className='Center'>
                <div className='Kalkulator-main'>
                    <div className='Uper-input'>
                        <input readOnly value={countValue} className='Cal-input' />
                    </div>
                    <div className='Down-buttons'>
                        <div className='Div-button'>
                            <button className='Bin-button B' onClick={() => setCountValue('')}>C</button>
                        </div>
                        <div className='Div-button'>
                            <button className='Bin-button B' onClick={() => setCountValue(countValue + '/')}>/</button>
                        </div>
                        <div className='Div-button'>
                            <button className='Bin-button B C' onClick={() => setCountValue(countValue + '*')}>x</button>
                        </div>
                        <div className='Div-button'>
                            <button className='Bin-button B' onClick={() => setCountValue(prev => prev.slice(0, -1))}>⌫</button>
                        </div>
                        <div className='Div-button'>
                            <button className='Bin-button B' onClick={() => setCountValue(countValue + '7')}>7</button>
                        </div>
                        <div className='Div-button'>
                            <button className='Bin-button B' onClick={() => setCountValue(countValue + '8')}>8</button>
                        </div>
                        <div className='Div-button'>
                            <button className='Bin-button B' onClick={() => setCountValue(countValue + '9')}>9</button>
                        </div>
                        <div className='Div-button'>
                            <button className='Bin-button B C' onClick={() => setCountValue(countValue + '-')}>-</button>
                        </div>
                        <div className='Div-button'>
                            <button className='Bin-button B' onClick={() => setCountValue(countValue + '4')}>4</button>
                        </div>
                        <div className='Div-button'>
                            <button className='Bin-button B' onClick={() => setCountValue(countValue + '5')}>5</button>
                        </div>
                        <div className='Div-button'>
                            <button className='Bin-button B' onClick={() => setCountValue(countValue + '6')}>6</button>
                        </div>
                        <div className='Div-button'>
                            <button className='Bin-button B C' onClick={() => setCountValue(countValue + '+')}>+</button>
                        </div>
                        <div className='Div-button'>
                            <button className='Bin-button B ' onClick={() => setCountValue(countValue + '1')}>1</button>
                        </div>
                        <div className='Div-button '>
                            <button className='Bin-button B' onClick={() => setCountValue(countValue + '2')}>2</button>
                        </div>
                        <div className='Div-button'>
                            <button className='Bin-button B' onClick={() => setCountValue(countValue + '3')}>3</button>
                        </div>
                        <div className='Div-button'>
                            <button className='Bin-button B C' onClick={() => setCountValue(String(eval(countValue)))}>=</button>
                        </div>
                        <div className='Div-button '>
                            <button className='Bin-button B'></button>
                        </div>
                        <div className='Div-button '>
                            <button className='Bin-button B' onClick={() => setCountValue(countValue + '0')}>0</button>
                        </div>
                        <div className='Div-button '>
                            <button className='Bin-button B' onClick={() => setCountValue(countValue + '.')}>.</button>
                        </div>
                        <div className='Div-button '>
                            <button className='Bin-button B C' onClick={() => setCountValue(countValue + '%')}>%</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}