import { Switch } from '../components/Switch'
import { BarChart, Legend, Bar, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import BTC from '../assets/BTCimage.png'
import ETH from '../assets/ETHimage.png'
import SOL from '../assets/SOLimage.png'
import GOLD from '../assets/GOLDimage.png'
import SILVER from '../assets/SILVERimage.png'
import OIL from '../assets/OILimage.png'
import USD from '../assets/USDimage.png'
import EUR from '../assets/EURimage.png'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './WykresyComp.css';

export function WykresyComp({ hidden, setHidden, btc, eth, sol, gold, silver, oil, usd, eur }) {
    const [btcSelect, setBtcSelect] = useState('1h');
    const [ethSelect, setEthSelect] = useState('1h');
    const [solSelect, setSolSelect] = useState('');
    const [goldSelect, setGoldSelect] = useState('');
    const [silverSelect, setSilverSelect] = useState('');
    const [oilSelect, setOilSelect] = useState('');
    const [usdSelect, setUsdSelect] = useState('');
    const [eurSelect, setEurSelect] = useState('');
    const scrollHide = JSON.parse(localStorage.getItem('scrollHide'));
    const { t } = useTranslation();

    const candle = ({ x, y, height, width, payload }) => {
        const { open, close, high, low } = payload

        const color = close > open ? "green" : "red";
        const cnotColor = 'black';
        const pixelsPerUnit = height / (high - low);
        const bodyTop = y + (high - Math.max(open, close)) * pixelsPerUnit;
        const bodyHeight = Math.abs(open - close) * pixelsPerUnit;
        const middle = x + (width) / 2;

        return (
            <g>
                <line x1={middle} x2={middle} y1={y} y2={y + height} stroke={cnotColor} strokeWidth={2} />
                <rect x={x} y={bodyTop} height={bodyHeight} width={width} fill={color} />
            </g>
        )
    }
    const tooltipContent = ({ payload }) => {
        if (!payload || payload.length === 0) return;

        const { Time, open, close, high, low } = payload[0].payload;

        return (
            <div style={{ background: 'var(--bck-color)', color: 'var(--font-color)', padding: 10, border: '1px solid black' }}>
                <p>Time: {Time}</p>
                <p>Open: {open > 10000 ? open.toFixed(0) : open.toFixed(2)}</p>
                <p>High: {high > 10000 ? high.toFixed(0) : high.toFixed(2)}</p>
                <p>Low: {low > 10000 ? low.toFixed(0) : low.toFixed(2)}</p>
                <p>Close: {close > 10000 ? close.toFixed(0) : close.toFixed(2)}</p>
            </div>
        );


    }
    return (
        <div className="MainBoard" style={{ scrollbarWidth: scrollHide ? 'none' : 'auto' }}>
            <div className='Up-board'>
                <div className='Up-element'>
                    <input type='checkbox' id="butt" checked={hidden} onChange={(e) => setHidden(e.target.checked)} ></input>
                    <label htmlFor='butt' className='Hide-show'></label>
                    <h1 className='Font margin'>{t('Charts.Name')}</h1>
                </div>
                <div className='Up-element2'>
                    <Switch />
                </div>
            </div>
            <hr className="Line"></hr>
            <div className='Candle-chart-main'>
                <div className='Candle-main-title'>
                    <h1 className='Shadow Candle-name-style'>BTC-USD</h1>
                </div>
                <div className='Candle-main-section'>
                    <div className='Candle-chart'>
                        <ResponsiveContainer width="100%" height="100%" minWidth={600}>
                            <BarChart data={btc?.frames?.[`${btcSelect}`] ?? []} >
                                <XAxis dataKey="Time" stroke="white" />
                                <YAxis stroke="white" domain={['auto', 'auto']} />
                                <Bar dataKey="range" shape={candle} />
                                <Tooltip content={tooltipContent} />
                                <Legend />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className='Candle-chart-data'>
                        <select className='Candle-select' onChange={(e) => setBtcSelect(e.target.value)}>
                            <option >1h</option>
                            <option>1d</option>
                            <option>1mo</option>
                            <option>1y</option>
                        </select>
                        <div className='Candle-image-div'>
                            <img alt="BTC image" className='Candle-image' src={BTC} />
                        </div>
                        <div className='Candle-dayly-change'>
                            <h4 className='Text-align Shadow'>{t('Charts.Today')}</h4>
                            <hr className='Line'></hr>
                            <h1 className='Shadow Text-align'>{btc?.change24h?.percent}% <span className={btc?.change24h?.emoji === '↘' ? 'Shadow Cen Red' : 'Shadow Cen Green' }>{btc?.change24h?.emoji}</span></h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className='Candle-chart-main'>
                <div className='Candle-main-title'>
                    <h1 className='Shadow Candle-name-style'>ETH-USD</h1>
                </div>
                <div className='Candle-main-section'>
                    <div className='Candle-chart'>
                        <ResponsiveContainer width="100%" height="100%" minWidth={600}>
                            <BarChart data={eth?.frames?.[`${ethSelect}`] ?? []} >
                                <XAxis dataKey="Time" stroke="white" />
                                <YAxis stroke="white" domain={['auto', 'auto']} />
                                <Bar dataKey="range" shape={candle} />
                                <Tooltip content={tooltipContent} />
                                <Legend />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className='Candle-chart-data'>
                        <select className='Candle-select' onChange={(e) => setEthSelect(e.target.value)}>
                            <option>1h</option>
                            <option>1d</option>
                            <option>1mo</option>
                            <option>1y</option>
                        </select>
                        <div className='Candle-image-div'>
                            <img alt="BTC image" className='Candle-image' src={ETH} />
                        </div>
                        <div className='Candle-dayly-change'>
                            <h4 className='Text-align Shadow'>{t('Charts.Today')}</h4>
                            <hr className='Line'></hr>
                            <h1 className='Shadow Text-align'>{eth?.change24h?.percent}% <span className={eth?.change24h?.emoji === '↘' ? 'Shadow Cen Red' : 'Shadow Cen Green' }>{eth?.change24h?.emoji}</span></h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className='Candle-chart-main'>
                <div className='Candle-main-title'>
                    <h1 className='Shadow Candle-name-style'>SOL-USD</h1>
                </div>
                <div className='Candle-main-section'>
                    <div className='Candle-chart'>
                        <ResponsiveContainer width="100%" height="100%" minWidth={600}>
                            <BarChart data={sol?.frames?.[`${solSelect}`] ?? []} >
                                <XAxis dataKey="Time" stroke="white" />
                                <YAxis stroke="white" domain={['auto', 'auto']} />
                                <Bar dataKey="range" shape={candle} />
                                <Tooltip content={tooltipContent} />
                                <Legend />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className='Candle-chart-data'>
                        <select className='Candle-select' onChange={(e) => setSolSelect(e.target.value)}>
                            <option>---</option>
                            <option>1h</option>
                            <option>1d</option>
                            <option>1mo</option>
                            <option>1y</option>
                        </select>
                        <div className='Candle-image-div'>
                            <img alt="BTC image" className='Candle-image' src={SOL} />
                        </div>
                        <div className='Candle-dayly-change'>
                            <h4 className='Text-align Shadow'>{t('Charts.Today')}</h4>
                            <hr className='Line'></hr>
                            <h1 className='Shadow Text-align'>{sol?.change24h?.percent}% <span className={sol?.change24h?.emoji === '↘' ? 'Shadow Cen Red' : 'Shadow Cen Green' }>{sol?.change24h?.emoji}</span></h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className='Candle-chart-main'>
                <div className='Candle-main-title'>
                    <h1 className='Shadow Candle-name-style'>GOLD-USD</h1>
                </div>
                <div className='Candle-main-section'>
                    <div className='Candle-chart'>
                        <ResponsiveContainer width="100%" height="100%" minWidth={600}>
                            <BarChart data={gold?.frames?.[`${goldSelect}`] ?? []} >
                                <XAxis dataKey="Time" stroke="white" />
                                <YAxis stroke="white" domain={['auto', 'auto']} />
                                <Bar dataKey="range" shape={candle} />
                                <Tooltip content={tooltipContent} />
                                <Legend />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className='Candle-chart-data'>
                        <select className='Candle-select' onChange={(e) => setGoldSelect(e.target.value)}>
                            <option>---</option>
                            <option>1h</option>
                            <option>1d</option>
                            <option>1mo</option>
                            <option>1y</option>
                        </select>
                        <div className='Candle-image-div'>
                            <img alt="BTC image" className='Candle-image' src={GOLD} />
                        </div>
                        <div className='Candle-dayly-change'>
                            <h4 className='Text-align Shadow'>{t('Charts.Today')}</h4>
                            <hr className='Line'></hr>
                            <h1 className='Shadow Text-align'>{gold?.change24h?.percent}% <span className={gold?.change24h?.emoji === '↘' ? 'Shadow Cen Red' : 'Shadow Cen Green' }>{gold?.change24h?.emoji}</span></h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className='Candle-chart-main'>
                <div className='Candle-main-title'>
                    <h1 className='Shadow Candle-name-style'>SILVER-USD</h1>
                </div>
                <div className='Candle-main-section'>
                    <div className='Candle-chart'>
                        <ResponsiveContainer width="100%" height="100%" minWidth={600}>
                            <BarChart data={silver?.frames?.[`${silverSelect}`] ?? []} >
                                <XAxis dataKey="Time" stroke="white" />
                                <YAxis stroke="white" domain={['auto', 'auto']} />
                                <Bar dataKey="range" shape={candle} />
                                <Tooltip content={tooltipContent} />
                                <Legend />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className='Candle-chart-data'>
                        <select className='Candle-select' onChange={(e) => setSilverSelect(e.target.value)}>
                            <option>---</option>
                            <option>1h</option>
                            <option>1d</option>
                            <option>1mo</option>
                            <option>1y</option>
                        </select>
                        <div className='Candle-image-div'>
                            <img alt="BTC image" className='Candle-image' src={SILVER} />
                        </div>
                        <div className='Candle-dayly-change'>
                            <h4 className='Text-align Shadow'>{t('Charts.Today')}</h4>
                            <hr className='Line'></hr>
                            <h1 className='Shadow Text-align'>{silver?.change24h?.percent}% <span className={silver?.change24h?.emoji === '↘' ? 'Shadow Cen Red' : 'Shadow Cen Green' }>{silver?.change24h?.emoji}</span></h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className='Candle-chart-main'>
                <div className='Candle-main-title'>
                    <h1 className='Shadow Candle-name-style'>OIL-USD</h1>
                </div>
                <div className='Candle-main-section'>
                    <div className='Candle-chart'>
                        <ResponsiveContainer width="100%" height="100%" minWidth={600}>
                            <BarChart data={oil?.frames?.[`${oilSelect}`] ?? []} >
                                <XAxis dataKey="Time" stroke="white" />
                                <YAxis stroke="white" domain={['auto', 'auto']} />
                                <Bar dataKey="range" shape={candle} />
                                <Tooltip content={tooltipContent} />
                                <Legend />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className='Candle-chart-data'>
                        <select className='Candle-select' onChange={(e) => setOilSelect(e.target.value)}>
                            <option>---</option>
                            <option>1h</option>
                            <option>1d</option>
                            <option>1mo</option>
                            <option>1y</option>
                        </select>
                        <div className='Candle-image-div'>
                            <img alt="BTC image" className='Candle-image' src={OIL} />
                        </div>
                        <div className='Candle-dayly-change'>
                            <h4 className='Text-align Shadow'>{t('Charts.Today')}</h4>
                            <hr className='Line'></hr>
                            <h1 className='Shadow Text-align'>{oil?.change24h?.percent}% <span className={oil?.change24h?.emoji === '↘' ? 'Shadow Cen Red' : 'Shadow Cen Green' }>{oil?.change24h?.emoji}</span></h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className='Candle-chart-main'>
                <div className='Candle-main-title'>
                    <h1 className='Shadow Candle-name-style'>USD-PLN</h1>
                </div>
                <div className='Candle-main-section'>
                    <div className='Candle-chart'>
                        <ResponsiveContainer width="100%" height="100%" minWidth={600}>
                            <BarChart data={usd?.frames?.[`${usdSelect}`] ?? []} >
                                <XAxis dataKey="Time" stroke="white" />
                                <YAxis stroke="white" domain={['auto', 'auto']} />
                                <Bar dataKey="range" shape={candle} />
                                <Tooltip content={tooltipContent} />
                                <Legend />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className='Candle-chart-data'>
                        <select className='Candle-select' onChange={(e) => setUsdSelect(e.target.value)}>
                            <option >---</option>
                            <option >1h</option>
                            <option>1d</option>
                            <option>1mo</option>
                            <option>1y</option>
                        </select>
                        <div className='Candle-image-div'>
                            <img alt="BTC image" className='Candle-image' src={USD} />
                        </div>
                        <div className='Candle-dayly-change'>
                            <h4 className='Text-align Shadow'>{t('Charts.Today')}</h4>
                            <hr className='Line'></hr>
                            <h1 className='Shadow Text-align'>{usd?.change24h?.percent}% <span className={usd?.change24h?.emoji === '↘' ? 'Shadow Cen Red' : 'Shadow Cen Green' }>{usd?.change24h?.emoji}</span></h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className='Candle-chart-main'>
                <div className='Candle-main-title'>
                    <h1 className='Shadow Candle-name-style'>EUR-PLN</h1>
                </div>
                <div className='Candle-main-section'>
                    <div className='Candle-chart'>
                        <ResponsiveContainer width="100%" height="100%" minWidth={600}>
                            <BarChart data={eur?.frames?.[`${eurSelect}`] ?? []} >
                                <XAxis dataKey="Time" stroke="white" />
                                <YAxis stroke="white" domain={['auto', 'auto']} />
                                <Bar dataKey="range" shape={candle} />
                                <Tooltip content={tooltipContent} />
                                <Legend />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className='Candle-chart-data'>
                        <select className='Candle-select' onChange={(e) => setEurSelect(e.target.value)}>
                            <option >---</option>
                            <option>1h</option>
                            <option>1d</option>
                            <option>1mo</option>
                            <option>1y</option>
                        </select>
                        <div className='Candle-image-div'>
                            <img alt="BTC image" className='Candle-image' src={EUR} />
                        </div>
                        <div className='Candle-dayly-change'>
                            <h4 className='Text-align Shadow'>{t('Charts.Today')}</h4>
                            <hr className='Line'></hr>
                            <h1 className='Shadow Text-align'>{eur?.change24h?.percent}% <span className={eur?.change24h?.emoji === '↘' ? 'Shadow Cen Red' : 'Shadow Cen Green' }>{eur?.change24h?.emoji}</span></h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}