import { Switch } from './Switch'
import { useEffect, useRef, useState } from 'react';
import { AreaChart, Area, Tooltip, Legend, ResponsiveContainer, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie } from 'recharts';
import { useTranslation } from 'react-i18next';
import './Cash.css'

export function Cash({ hidden, setHidden }) {
    const [range, setRange] = useState();
    const { t } = useTranslation();
    const input = useRef();
    const inputForSpend = useRef();
    const flaga = useRef(false);
    const teraz = new Date();
    const Savings = useRef();
    const pad = (p) => String(p).padStart(2, "0");
    const dateKey = `${teraz.getFullYear()}.${pad(teraz.getMonth())}.${pad(teraz.getDate())}.${pad(teraz.getHours())}.${pad(teraz.getMinutes())}.${pad(teraz.getSeconds())}`;
    const trueDateKey = `${teraz.getFullYear()}.${pad(teraz.getMonth() + 1)}.${pad(teraz.getDate())}.${pad(teraz.getHours())}.${pad(teraz.getMinutes())}.${pad(teraz.getSeconds())}`;
    const keyDateType = `${teraz.getFullYear()}.${pad(teraz.getMonth())}`;
    const TooltipFont = { color: '#000000' };
    const [cash, setCash] = useState();
    const [savedMoney, setSavedMoney] = useState();
    const scrollHide = JSON.parse(localStorage.getItem('scrollHide'));
    const [cashData, setCashData] = useState(() => {
        return JSON.parse(localStorage.getItem('cashData')) || [{ data: '2026.7.21', Kasa: 100, id: '1' }];
    })
    const [inputSavingsName, setInputSavingsName] = useState(() => {
        return JSON.parse(localStorage.getItem('inputSavingsName')) || ['Nazwa Celu'];
    })
    const [cashSpendings, setCashSpendings] = useState(() => {
        return JSON.parse(localStorage.getItem('cashSpendings')) || [];
    })
    const [totalSpendings, setTotalSpendings] = useState(() => {
        return JSON.parse(localStorage.getItem('totalSpendings')) || [{ Time: '2025.07', Wydane: 10 }];
    })
    const [pieChartData, setPieChartData] = useState(() => {
        return JSON.parse(localStorage.getItem('pieChartData')) || [{ Name: "Pozostalo do celu", value: 100, fill: 'grey'}, { Name: "Osiagnieto", value: 50, fill: 'rgb(118, 112, 173)'}];
    })
    const equationValue = pieChartData[0].value - pieChartData[1].value;
    const equationIf = pieChartData[0].value > pieChartData[1].value;

    const pieChartExtended = [{
        ...pieChartData[0], chartValue: equationIf ? equationValue : 0
    }, {
        ...pieChartData[1], chartValue: equationIf ? pieChartData[1].value : 100
    }]
    const sums = totalSpendings.reduce((total, s) => {
        total[s.Time] = (total[s.Time] || 0) + s.Wydane
        return total
    }, [])
    const sumsArray = Object.entries(sums).map(([Time, Wydane]) => ({ Time, Wydane }));

    useEffect(() => {
        localStorage.setItem('cashData', JSON.stringify(cashData));
    }, [cashData]);

    useEffect(() => {
        localStorage.setItem('cashSpendings', JSON.stringify(cashSpendings));
    }, [cashSpendings]);

    useEffect(() => {
        localStorage.setItem('totalSpendings', JSON.stringify(totalSpendings));
    }, [totalSpendings]);

    useEffect(() => {
        localStorage.setItem('pieChartData', JSON.stringify(pieChartData));
    }, [pieChartData]);

     useEffect(() => {
        localStorage.setItem('inputSavingsName', JSON.stringify(inputSavingsName));
    }, [inputSavingsName]);

    useEffect(() => {
        const equationKey = `${cashData.at(-2)?.Kasa - cashData.at(-1).Kasa}`;
        if (!flaga.current) {
            flaga.current = true;
            return
        }

        if (cashData.length > 1) {
            if (Number(cashData.at(-2).Kasa) > Number(cashData.at(-1).Kasa)) {
                setTotalSpendings((spend) => [...spend, {
                    Time: String([keyDateType]),
                    Wydane: Number([equationKey])
                }
                ])
                console.log(sumsArray);
                setCashSpendings((saved) => [...saved, {
                    Time: String([trueDateKey]),
                    Wydane: Number([equationKey]),
                    id: crypto.randomUUID()
                }]
                );
            }
        }

    }, [cashData])



    useEffect(() => {
        if (cashData) {
            if (Number(cashData.at(-1).data.split('.')[1]) !== teraz.getMonth() || Number(cashData.at(-1).data.split('.')[0]) !== teraz.getFullYear()) {
                setCashData(arr => [...arr, {
                    data: dateKey,
                    Kasa: `${cashData.at(-1).Kasa}`,
                    id: crypto.randomUUID()
                }])
            }
        }
    }, [])

    function SetChartData(e) {
        e.preventDefault();
        setCashData(prev => [...prev, {
            data: dateKey,
            Kasa: cash,
            id: crypto.randomUUID()
        }])
        input.current.value = '';
        console.log(sumsArray);
    }

    async function AddSpendings(e) {
        e.preventDefault();
        await setTotalSpendings((spend) => [...spend, {
            Time: String(keyDateType),
            Wydane: Number([inputForSpend.current.value])
        }
        ])
        await setCashSpendings((saved) => [...saved, {
            Time: String([trueDateKey]),
            Wydane: Number([inputForSpend.current.value]),
            id: crypto.randomUUID()
        }])
        inputForSpend.current.value = "";
    }
    function AddSavings(e) {
        e.preventDefault();
        setPieChartData(arr => [...arr.slice(0, 1), {...arr[1], value: Number(pieChartData[1].value + Number(savedMoney))}]);
        Savings.current.value="";
    }

    return (
        <div className="MainBoard" style={{ scrollbarWidth: scrollHide ? 'none' : 'auto' }}>
            <div className='Up-board'>
                <div className='Up-element'>
                    <input type='checkbox' id="butt" checked={hidden} onChange={(e) => setHidden(e.target.checked)} ></input>
                    <label htmlFor='butt' className='Hide-show'></label>
                    <h1 className='Font margin'>{t('Cash.Name')}</h1>
                </div>
                <div className='Up-element2'>
                    <Switch />
                </div>
            </div>
            <hr className="Line"></hr>
            <div className='Cash-mainboard'>
                <div className='Cash-data'>
                    <div className='Cash-title'>
                        <h1 className='Capital Big Shadow'>{teraz.toLocaleDateString(`${t('Dashboard.Weekdays')}`, { month: 'long' })}</h1>
                    </div>
                    <div className='Cash-chart'>
                        <ResponsiveContainer>
                            <AreaChart data={cashData.filter(str => Number(str.data.split('.')[1]) === teraz.getMonth() && Number(str.data.slice(0, 4)) === teraz.getFullYear())}>
                                <Area dataKey='Kasa' type='monotone' stroke='black' />
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='data' stroke='white' tickFormatter={(data) => Number(data.split('.').slice(2, 3).join('.'))} />
                                <YAxis dataKey='Kasa' stroke='white' />
                                <Tooltip />
                                <Legend />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className='Cash-creator'>
                        <form onSubmit={SetChartData} className='Money-form'>
                            <p className='text White Shadow'>{t('Cash.AddingDescription')}</p>
                            <input ref={input} required type="number" min="1" className='Event-name Str' onChange={(e) => setCash(e.target.value)} />
                            <button type='submit' className='Add-event-btn'>{t('Calendar.AddBtn')}</button>
                        </form>
                    </div>
                </div>
                <div className='Cash-future'>
                    <div className='Cash-inYears'>
                        <div className='Cash-show-div'>
                            <div className='Cash-nav-title'>
                                <p className='Cash-word Font Increase'>{t('Cash.AfterYear')}</p>
                            </div>
                            <h1 className='Cen'>{range ? range * 12 : 18600}</h1>
                        </div>
                        <div className='Cash-show-div'>
                            <div className='Cash-nav-title'>
                                <p className='Cash-word Font Increase'>{t('Cash.After3Years')}</p>
                            </div>
                            <h1 className='Cen'>{range ? range * 36 : 55800}</h1>
                        </div>
                        <div className='Cash-show-div'>
                            <div className='Cash-nav-title'>
                                <p className='Cash-word Font Increase'>{t('Cash.After5Years')}</p>
                            </div>
                            <h1 className='Cen'>{range ? range * 60 : 93000}</h1>
                        </div>
                        <div className='Cash-show-div'>
                            <div className='Cash-nav-title'>
                                <p className='Cash-word Font Increase'>{t('Cash.After10Years')}</p>
                            </div>
                            <h1 className='Cen'>{range ? range * 120 : 186000}</h1>
                        </div>
                        <div className='Cash-show-div'>
                            <div className='Cash-nav-title'>
                                <p className='Cash-word Font Increase'>{t('Cash.After25Years')}</p>
                            </div>
                            <h1 className='Cen'>{range ? range * 300 : 465000}</h1>
                        </div>
                        <div className='Cash-show-div'>
                            <div className='Cash-nav-title'>
                                <p className='Cash-word Font Increase'>{t('Cash.After50Years')}</p>
                            </div>
                            <h1 className='Cen'>{range ? range * 600 : 930000}</h1>
                        </div>
                    </div>
                    <div className='Cash-slider-div'>
                        <input className='Cash-range-selector' type='range' step='10' max='3000' min='100' onChange={(e) => setRange(e.target.value)}></input>
                        <div className='Cash-slider-limit'>
                            <p className='Shadow Increase'>100</p>
                            <p className='Shadow Increase'>{range ? range : 1550}</p>
                            <p className='Shadow Increase'>3000</p>
                        </div>
                    </div>
                </div>
                <div className='Cash-spendings'>
                    <div className='Cash-year-title'>
                        <div className='Cash-layout-one'>
                            <h2 className='Cash-spendings-year Shadow'>{teraz.getFullYear()}</h2>
                        </div>

                    </div>

                    <div className='Cash-sections'>
                        <div className='Cash-section-one'>

                            <div className='Cash-barChart'>
                                <ResponsiveContainer minWidth={600}>
                                    <BarChart data={sumsArray.filter(cash => Number(cash.Time.split('.')[0]) === Number(teraz.getFullYear()))}>
                                        <Bar dataKey="Wydane" stroke='black' fill='#7670ad' />
                                        <YAxis dataKey='Wydane' stroke='white' />
                                        <XAxis dataKey='Time' stroke='white' tickFormatter={data => new Date(0, data.split('.')[1]).toLocaleDateString(`${t('Dashboard.Weekdays')}`, { month: "long" })} />
                                        <Legend />
                                        <Tooltip itemStyle={TooltipFont} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className='Cash-section-two'>
                            <div className='Cash-layout-two'>
                                <p className='Shadow text'>{t('Cash.LastSpendings')}</p>
                            </div>
                            {cashSpendings.map((spend) => {
                                return (
                                    <div className='Cash-spend-div' key={spend.id}>
                                        <p className='Shadow Marg Cash-par' >{spend.Wydane}</p>
                                        <p className='Font-style Marg Bold' >{spend.Time.slice(0, 10)}</p>
                                        <p className='Font-style' >{spend.Time.slice(11, 16).split('.').join(':')}</p>
                                    </div>
                                )
                            })}

                        </div>

                    </div>
                    <div className='Spend-creator'>
                        <form onSubmit={AddSpendings} className='Money-form'>
                            <p className='text White Shadow'>{t('Cash.AddingSpendings')}</p>
                            <input ref={inputForSpend} required type="number" min="1" className='Event-name Str' onChange={(e) => setCash(e.target.value)} />
                            <button type='submit' className='Add-event-btn'>Dodaj</button>
                        </form>
                    </div>
                </div>
                <div className='Cash-savings'>
                    <div className='Cash-savings-title'>
                            <h2 className='Shadow'>{t('Cash.Savings')}</h2>
                    </div>
                    <div className='Cash-savings-one'>
                    <div className='Cash-piechart'>
                        <ResponsiveContainer width="100%" height="200">
                            <PieChart data={pieChartExtended}>
                                <Pie nameKey="Name" dataKey="chartValue"/>


                                <Tooltip itemStyle={TooltipFont} formatter={(key) => equationIf ? key : t('Cash.ReachGoal')}/>
                                <Legend formatter={(value) => <span style={{color: 'var(--font-color)'}}>{value}</span>}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className='Cash-savings-data'>
                        <div className='Cash-savings-info Align'><input value={inputSavingsName} className='Cash-savings-name Shadow'onChange={(e) => setInputSavingsName(e.target.value)} /></div>
                        <div className='Cash-savings-info Align'><h3 className='Shadow'>{t('Cash.Goal')}</h3><input className='Cash-savings-input Shadow' value={pieChartData[0].value} onChange={(e) => setPieChartData(arr => [{...arr[0], value: Number(e.target.value)}, ...arr.slice(1)])} type="number" min="1"/></div>
                        <div className='Cash-savings-info Align'><h3 className='Shadow Text-break'>{t('Cash.Saved')} {pieChartData[1].value}</h3></div>
                        <div className='Cash-savings-info'><h3 className='Align Block Text-break Shadow'>{equationIf ? ((pieChartData[1].value / pieChartData[0].value) * 100).toFixed(0) : 100}% {t('Cash.Percent')}</h3></div>
                    </div>
                    </div>
                    <div className='Savings-editor'>
                        <form className='Money-form'>
                            <p className='text White Shadow'>{t('Cash.Edit-savings')}</p>
                            <input value={pieChartData[1].value} required type="number" min="1" className='Event-name Str'  onChange={(e) => setPieChartData(arr => [...arr.slice(0, 1), {...arr[1], value: Number(e.target.value)}])} type="number" min="1" />
                            <button type='submit' className='Add-event-btn'>{t('Cash.ChangeBtn')}</button>
                        </form>
                    </div>
                    <div className='Savings-adder'>
                        <form onSubmit={AddSavings} className='Money-form'>
                            <p className='text White Shadow'>{t('Cash.Add-savings')}</p>
                            <input ref={Savings} required type="number" min="1" className='Event-name Str' onChange={(e) => setSavedMoney(e.target.value)} />
                            <button type='submit' className='Add-event-btn'>{t('Calendar.AddBtn')}</button>
                        </form>
                    </div>
                </div>
                <div className='Outer-space'>

                </div>
            </div>
        </div>
    );
}
