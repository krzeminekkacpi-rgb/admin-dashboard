import { Link } from 'react-router';
import { useEffect, useRef } from 'react'
import UserIcon from "../../public/img/icon-user.png"
import './NavPanel.css'
import { useTranslation } from 'react-i18next';

export function NavPanel({ hidden, pageHide, operatorName }) {
    const Element = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        hidden ? Element.current.classList.add("Vis") : Element.current.classList.remove("Vis");
    }, [hidden]);

    return (
        <div className="Navpan" ref={Element}>
            <div className="Top-section">
                <img src={UserIcon} className="User-icon"></img>
                <h1 className="Font-style">{operatorName}</h1>
            </div>
            <hr className="Line"></hr>
            <div className="Nav-links">
                <Link to='/'>
                 <div className="Link">
                    <h2 className="Link-font">🌐 Dashboard</h2>
                </div>
                </Link>
                <Link to='/Kalendarz'>
                <div className="Link">
                    <h2 className="Link-font">🗓️ {t('Calendar.Name')}</h2>
                </div>
                </Link>
                <Link to='/Kalkulator'>
                <div className="Link">
                    <h2 className="Link-font">🔢 {t('Calculator.Name')}</h2>
                </div>
                </Link>
                <Link to='/Notatnik'>
                <div className="Link">
                    <h2 className="Link-font">📝 {t('Notepad.Name')}</h2>
                </div>
                </Link>
                <Link to='/Kasa'>
                <div className="Link">
                    <h2 className="Link-font">💵 {t('Cash.Name')}</h2>
                </div>
                </Link>
                 <Link to='/Wykresy'>
                <div className="Link" style={{ display: pageHide ? '' : 'none'}}>
                    <h2 className="Link-font">💹 {t('Charts.Name')}</h2>
                </div>
               </Link>
                <div className="Link">
                    <h2 className="Link-font">✨ {t('Preferences.Name')}</h2>
                </div>
            </div>
            <hr className="Line"></hr>
            <div className="Down-section">
                <Link to='/Settings'>
                <div className="Link Expand">
                    <h2 className="Link-font Settings">⚙️ {t('Settings.Name')}</h2>
                </div>
                </Link>
                <div className="Space"></div>

                <div className="Link">
                    <h2 className="Link-font ">🔗 ({t('Dashboard.CurrentLang')}) Language</h2>
                </div>
            </div>
        </div>
    )
}