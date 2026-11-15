import { useEffect, useRef, useState } from 'react';
import { Switch } from './Switch'
import { useTranslation } from 'react-i18next';
import './Ustawienia.css';

export function Ustawienia({ hidden, setHidden, pageHide, setPageHide, marketHide, setMarketHide, operatorName, setOperatorName }) {
    const operator = useRef();
    const { t, i18n } = useTranslation();
    const [lang, setLang] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('lang')) || 'en';
        } catch {
            return 'en';
        }
    });
    const [font, setFont] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('font')) || 'Arial';
        } catch {
            return 'Arial';
        }
    });
    const [scrollHide, setScrollHide] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('scrollHide')) || false;
        } catch {
            return false;
        }
    });

    useEffect(() => {
        document.documentElement.style.setProperty('--page-font', font);
        try {
            return localStorage.setItem('lang', JSON.stringify(lang));
        } catch {
            return 'en';
        }
        
    }, [lang])

    useEffect(() => {
        i18n.changeLanguage(lang);
        
    }, [lang])

    useEffect(() => {
        document.documentElement.style.setProperty('--page-font', font);
        try {
            return localStorage.setItem('font', JSON.stringify(font));
        } catch {
            return 'Arial';
        }
        
    }, [font])

    useEffect(() => {
        try {
            return localStorage.setItem('scrollHide', JSON.stringify(scrollHide));
        } catch (error) {
            console.log(error);
            return false;
        }
    }, [scrollHide]);

    useEffect(() => {
        try {
            return localStorage.setItem('pageHide', JSON.stringify(pageHide));
        } catch (error) {
            console.log(error);
            return false;
        }
    }, [pageHide]);

    useEffect(() => {
        try {
            return localStorage.setItem('marketHide', JSON.stringify(marketHide));
        } catch (error) {
            console.log(error);
            return false;
        }
    }, [marketHide]);

    useEffect(() => {
        try {
            return localStorage.setItem('operatorName', JSON.stringify(operatorName));
        } catch (error) {
            console.log(error);
            return 'Admin';
        }
    }, [operatorName]);

    function SaveOperatorsName(value) {
        if (!value || value.length > 8) {
            setOperatorName('Admin');
        } else {
            setOperatorName(value);
        }

    }

    return (
        <div className="MainBoard" style={{ scrollbarWidth: scrollHide ? 'none' : 'auto' }}>
            <div className='Up-board'>
                <div className='Up-element'>
                    <input type='checkbox' id="butt" checked={hidden} onChange={(e) => setHidden(e.target.checked)} ></input>
                    <label htmlFor='butt' className='Hide-show'></label>
                    <h1 className='Font margin'>{t('Settings.Name')}</h1>
                </div>
                <div className='Up-element2'>
                    <Switch />
                </div>
            </div>
            <hr className="Line"></hr>
            <div className='Settings-content'>
                <div className='Settings-main'>
                    <h2 className='Shadow'>{t('Settings.MainSettings')}</h2>
                    <hr className='Line'></hr>
                    <div className='Settings-main-div'>
                        <div className='Settings-row'>
                            <h2 className='Font Bold'>{t('Settings.PageLanguage')}</h2>
                            <select className='Settings-select' onChange={(e) => setLang(e.target.value)} value={lang}>
                                <option value="pl">Polish</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                        <div className='Settings-row'>
                            <h2 className='Font Bold'>{t('Settings.HideMarketChanges')}</h2>
                            <input type='checkbox' id='Market-hide' checked={marketHide} onChange={(e) => setMarketHide(e.target.checked)}></input>
                            <label htmlFor='Market-hide' className='Settings-switch'></label>
                        </div>

                        <div className='Settings-row'>
                            <h2 className='Font Bold'>{t('Settings.UnlockCharts')}</h2>
                            <input type='checkbox' id='Page-hide' checked={pageHide} onChange={(e) => setPageHide(e.target.checked)}></input>
                            <label htmlFor='Page-hide' className='Settings-switch'></label>
                        </div>

                    </div>
                    <div className='Settings-row'>
                    </div>
                </div>

                <div className='Settings-side'>
                    <h2 className='Shadow'>{t('Settings.SideSettings')}</h2>
                    <hr className='Line'></hr>
                    <div className='Settings-side-div'>
                        <div className='Settings-row'>
                            <h2 className='Font Bold'>{t('Settings.PageFont')}</h2>
                            <select className='Settings-select' value={font} onChange={(e) => setFont(e.target.value)}>
                                <option value="Arial">Arial</option>
                                <option value="Times new roman">Times new roman</option>
                                <option value="Monospace">Monospace</option>
                                <option value="Roboto">Roboto</option>
                                <option value="Verdana">Verdana</option>
                                <option value="Comic Sans MS">Comic Sans MS</option>
                                <option value="System-ui">System-ui</option>
                                <option value="Garamond">Garamond</option>
                            </select>
                        </div>

                        <div className='Settings-row'>
                            <h2 className='Font Bold'>{t('Settings.HideScrollBar')}</h2>
                            <input type='checkbox' id='Scroll-hide' checked={scrollHide} onChange={(e) => setScrollHide(e.target.checked)}></input>
                            <label htmlFor='Scroll-hide' className='Settings-switch'></label>
                        </div>

                        <div className='Settings-row'>
                            <h2 className='Font Bold'>{t('Settings.PageOperator')}</h2>
                            <input className='Settings-input' defaultValue={operatorName} ref={operator}></input>
                            <button className='Add-event-btn Margin' onClick={() => SaveOperatorsName(operator.current.value)}>{t('Settings.SaveBtn')}</button>
                        </div>

                    </div>
                    <div className='Settings-row Copyright'>
                        <p className='Copyright'>{t('Settings.Copyright')}</p>
                    </div>
                </div>

            </div>
        </div>
    )
}