import { AreaChart, Tooltip, Legend, XAxis, YAxis, ResponsiveContainer, Area, CartesianGrid } from 'recharts'
import { Calendar } from './Calendar.jsx';
import { Switch } from './Switch.jsx';
import Copy from '../../src/assets/copy-icon.png';
import Share from '../../src/assets/share-icon.png'
import { useEffect, useRef } from 'react';
import './Board.css'
import { useTranslation } from 'react-i18next';

export function Board({ operatorName, hidden, setHidden, pogodaDzis, pogodaTydzien, setTimeFrame, timeFrame, newEvent, newEventWeek, btc, eth, sol, gold, silver, oil, usd, eur, marketHide }) {
    const teraz = new Date();
    const { t } = useTranslation();
    const scroll = useRef();
    const scrollHide = JSON.parse(localStorage.getItem('scrollHide'));

    async function CopyToClipboard(value) {
        const link = await `https://krzeminekkacpi-rgb.github.io/${value}`;
        try {
            navigator.clipboard.writeText(link);
            alert('Link został skopiowany');
        } catch (error) {
            alert('Nie udało sie skopiować linku przez:', error);
        }
    }
    function Scroll() {
        const scrollpoz = scroll.current;
        const poz = scrollpoz.scrollWidth * (teraz.getHours() / 24);
        scrollpoz.scrollTo({ left: poz, behavior: 'smooth' });
    }
    useEffect(() => {
        Scroll();
    }, [pogodaDzis])

    return (
        <div className="MainBoard" style={{ scrollbarWidth: scrollHide ? 'none' : 'auto' }}>
            <div className='Up-board'>
                <div className='Up-element'>
                    <input type='checkbox' id="butt" checked={hidden} onChange={(e) => setHidden(e.target.checked)} ></input>
                    <label htmlFor='butt' className='Hide-show'></label>
                    <h1 className='Font margin'>Dashboard</h1>
                </div>
                <div className='Up-element2'>
                    <Switch />
                </div>
            </div>
            <hr className='Line'></hr>
            <div className='MainMiddle'>
                <h2 className="Font Back">{t('Dashboard.WelcomeMessage')} {operatorName} 🖐️🖐️</h2>
                <hr className='Line'></hr>
            </div>
            <div className='Data-elements'>
                <div className="Weather-div">
                    <div className='Weather-chart'>
                        <ResponsiveContainer height={300} className='resp'>
                            <AreaChart data={timeFrame ? pogodaDzis : pogodaTydzien}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <Area dataKey={timeFrame ? 'temperatura' : 'temperatura_srednia'} stroke='black' type='monotone' />
                                <Tooltip labelStyle={{ color: 'black' }} itemStyle={{ color: 'black' }} />
                                <XAxis dataKey={timeFrame ? 'godzina' : 'data'} stroke='white'
                                    tickFormatter={!timeFrame ? (value) => value.split('-').slice(1).join('-') : ''}
                                />
                                <YAxis dataKey={timeFrame ? 'temperatura' : 'temperatura_srednia'} stroke='white' />
                                <Legend />
                            </AreaChart>
                        </ResponsiveContainer>
                        <div className='Time-frames'>
                            <button className='Chart-button' onClick={() => setTimeFrame(true)}>{t('Dashboard.ButtonDaily')}</button>
                            <button className='Chart-button' onClick={() => setTimeFrame(false)}>{t('Dashboard.ButtonWeekly')}</button>
                        </div>
                    </div>
                    <div className='Weather-icons' ref={scroll}>
                        {(timeFrame ? pogodaDzis : pogodaTydzien).map((dzien, i) => {
                            return (
                                <div className={`${!timeFrame && Number(dzien.data.split('-').slice(2)) === teraz.getDate() ? 'Pogoda-div current' : 'Pogoda-div'} 
                                ${timeFrame && Number(dzien.godzina.split(':')[0]) === teraz.getHours() ? 'Pogoda-div current' : 'Pogoda-div'}`}
                                    key={i} data-godzina={dzien.godzina}>
                                    <p>{(timeFrame ? dzien.temperatura : dzien.temperatura_srednia).toFixed(0)}°C</p>
                                    <h1>{dzien.warunki}</h1>
                                    <p>{timeFrame ? dzien.godzina : dzien.data}</p>
                                </div>

                            )
                        })}
                    </div>
                </div>
                <Calendar newEvent={newEvent} newEventWeek={newEventWeek} />
                <div className='Main-calendar Chart-changes' style={{ display: marketHide ? 'none' : '' }}>
                    <div className='Cash-year-title Mar'>
                        <h2 className='Cen Shadow'>{t('Dashboard.MarketChanges')}</h2>
                    </div>
                    <div className='Chart-view'>
                        <div className='Cash-show-div Chart-box'>
                            <div className='Cash-nav-title'>
                                <span className='Font Currency-chart-name'>BTC</span>
                            </div>
                            <h1 className='Shadow Cen' >{btc?.change24h?.percent}% <span className={btc?.change24h?.emoji === '↘' ? 'Shadow Cen Red' : 'Shadow Cen Green'}>{btc?.change24h?.emoji}</span></h1>
                        </div>

                        <div className='Cash-show-div Chart-box'>
                            <div className='Cash-nav-title'>
                                <span className=' Font Currency-chart-name'>{t('Dashboard.MarketGold')}</span>
                            </div>
                            <h1 className='Cen Shadow'>{gold?.change24h?.percent}% <span className={gold?.change24h?.emoji === '↘' ? 'Shadow Cen Red' : 'Shadow Cen Green'}>{gold?.change24h?.emoji}</span></h1>
                        </div>

                        <div className='Cash-show-div Chart-box'>
                            <div className='Cash-nav-title'>
                                <span className=' Font Currency-chart-name'>ETH</span>
                            </div>
                            <h1 className='Cen Shadow'>{eth?.change24h?.percent}% <span className={eth?.change24h?.emoji === '↘' ? 'Shadow Cen Red' : 'Shadow Cen Green'}>{eth?.change24h?.emoji}</span></h1>
                        </div>

                        <div className='Cash-show-div Chart-box'>
                            <div className='Cash-nav-title'>
                                <span className=' Font Currency-chart-name'>{t('Dashboard.MarketSilver')}</span>
                            </div>
                            <h1 className='Cen Shadow'>{silver?.change24h?.percent}% <span className={silver?.change24h?.emoji === '↘' ? 'Shadow Cen Red' : 'Shadow Cen Green'}>{silver?.change24h?.emoji}</span></h1>
                        </div>

                        <div className='Cash-show-div Chart-box'>
                            <div className='Cash-nav-title'>
                                <span className=' Font Currency-chart-name'>SOL</span>
                            </div>
                            <h1 className='Cen Shadow'>{sol?.change24h?.percent}% <span className={sol?.change24h?.emoji === '↘' ? 'Shadow Cen Red' : 'Shadow Cen Green'}>{sol?.change24h?.emoji}</span></h1>
                        </div>

                        <div className='Cash-show-div Chart-box'>
                            <div className='Cash-nav-title'>
                                <span className=' Font Currency-chart-name'>{t('Dashboard.MarketOil')}</span>
                            </div>
                            <h1 className='Cen Shadow'>{oil?.change24h?.percent}% <span className={oil?.change24h?.emoji === '↘' ? 'Shadow Cen Red' : 'Shadow Cen Green'}>{oil?.change24h?.emoji}</span></h1>
                        </div>

                        <div className='Cash-show-div Chart-box'>
                            <div className='Cash-nav-title'>
                                <span className=' Font Currency-chart-name'>USD</span>
                            </div>
                            <h1 className='Cen Shadow'>{usd?.change24h?.percent}% <span className={usd?.change24h?.emoji === '↘' ? 'Shadow Cen Red' : 'Shadow Cen Green'}>{usd?.change24h?.emoji}</span></h1>
                        </div>

                        <div className='Cash-show-div Chart-box'>
                            <div className='Cash-nav-title'>
                                <span className=' Font Currency-chart-name'>EUR</span>
                            </div>
                            <h1 className='Cen Shadow'>{eur?.change24h?.percent}% <span className={eur?.change24h?.emoji === '↘' ? 'Shadow Cen Red' : 'Shadow Cen Green'}>{eur?.change24h?.emoji}</span></h1>
                        </div>
                    </div>
                </div>
                <div className='Main-calendar Column Border'>
                    <div className='Other-projects-div'>
                        <h2 className='Other-projects-title Shadow'>{t('Dashboard.SeeOtherProjects')}</h2>
                    </div>
                    <div className='Other-readings-div'>
                        <h3 className='Shadow'>{t('Dashboard.MaybeStar')}✨</h3>
                    </div>
                    <div className='Other-all-projects'>
                        <div className='Dashboard-project'>
                            <h2 className='Shadow'>Admin Dashboard</h2>
                            <div className='Space-div'>
                                <img src={Copy} className='Copy-icon' onClick={() => CopyToClipboard('admin-dashboard')}></img>
                                <a href='https://krzeminekkacpi-rgb.github.io/admin-dashboard'><img src={Share} className='Copy-icon'></img></a>
                            </div>
                        </div>

                        <div className='Spotify-project'>
                            <h2 className='Shadow'>Spotify {t('Dashboard.Spotify')}</h2>
                            <div className='Space-div'>
                                <img src={Copy} className='Copy-icon' onClick={() => CopyToClipboard('test-spotify')}></img>
                                <a href='https://krzeminekkacpi-rgb.github.io/test-spotify'><img src={Share} className='Copy-icon'></img></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}