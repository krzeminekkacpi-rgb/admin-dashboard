import { Switch } from './Switch'
import { Notepad } from './Notepad';
import './NotePage.css'
import { useTranslation } from 'react-i18next';

export function NotePage({ hidden, setHidden }) {
    const scrollHide = JSON.parse(localStorage.getItem('scrollHide'));
    const { t } = useTranslation();
    return (
         <div className="MainBoard" style={{ scrollbarWidth: scrollHide ? 'none' : 'auto' }}>
            <div className='Up-board'>
                <div className='Up-element'>
                    <input type='checkbox' id="butt" checked={hidden} onChange={(e) => setHidden(e.target.checked)} ></input>
                    <label htmlFor='butt' className='Hide-show'></label>
                    <h1 className='Font margin'>{t('Notepad.Name')}</h1>
                </div>
                <div className='Up-element2'>
                    <Switch/>
                </div>
            </div>
            <hr className="Line"></hr>
            <Notepad/>
        </div>
    );
}