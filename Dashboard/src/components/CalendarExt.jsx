import { useState, useEffect, useRef } from 'react'
import "./CalendarExt.css"
import { useTranslation } from 'react-i18next';

export function CalendarExt({ newEvent, newEventWeek, setNewEvent, setNewEventWeek }) {
    const [visible, setVisible] = useState(true);
    const Elem = useRef(null);
    const [visib, setVisib] = useState(true);
    const Elemen = useRef(null);
    const Empty = useRef(null);
    const Nothing = useRef(null);
    const { t } = useTranslation();

    const [dateName, setDateName] = useState('');
    const [dateDay, setDateDay] = useState('');

    const [dateNameWeek, setDateNameWeek] = useState('');
    const [dateWeek, setDateWeek] = useState('');
   


    useEffect(() => {
        visible ? Elem.current.classList.add('viss') : Elem.current.classList.remove('viss');
    }, [visible])

    useEffect(() => {
        visib ? Elemen.current.classList.add('viss') : Elemen.current.classList.remove('viss');
    }, [visib])

    useEffect(() => {
         localStorage.setItem('newEvent', JSON.stringify(newEvent));
    }, [newEvent])

    useEffect(() => {
         localStorage.setItem('newEventWeek', JSON.stringify(newEventWeek));
    }, [newEventWeek])


    const now = new Date();

    const [rok] = useState(now.getFullYear());
    const [miesiac] = useState(now.getMonth());

    const pierwszy = new Date(rok, miesiac, 1);
    const dzienTygodnia = pierwszy.getDay();
    const dniPuste = (dzienTygodnia + 6) % 7;

    const ostatniDzienMiesiaca = new Date(rok, miesiac + 1, 0);
    const iloscDni = ostatniDzienMiesiaca.getDate();

    const dni = Array(dniPuste).fill(null);
    for (let d = 1; d <= iloscDni; d++) {
        dni.push(new Date(rok, miesiac, d));
    }
    for (let t = dni.length; t % 7 !== 0; t++) {
        dni.push(null);
    }

    function AddNewDate(e) {
        e.preventDefault();
        if (dateName.trim() === "") {
            setVisible(true)
            Empty.current.value="";
            return
        } else {
            setNewEvent(prev => [...prev, {
                date: String(dateDay),
                Name: dateName,
                id: crypto.randomUUID()
            }]);
            setVisible(true)
            Empty.current.value="";
            console.log(newEvent);
            console.log(dateDay);
        }
    }
    function AddNewDateWeek(e) {
        e.preventDefault();
        if (dateNameWeek.trim() === "") {
            setVisib(true)
            Nothing.current.value="";
            return
        } else {
            setNewEventWeek(prev => [...prev, {
                date: String(dateWeek),
                Name: dateNameWeek,
                id: crypto.randomUUID()
            }]);
            setVisib(true)
            Nothing.current.value="";
            console.log(newEventWeek);
        }
    }
    function EventRemove(item) {
        setNewEvent(prev => prev.filter((each) => each.id !== item))
    }
    function RemoveWeekEvent(day) {
        setNewEventWeek(prev => prev.filter(each => each.id !== day))
    }
    return (

        <div className="Main-calendar id2">
            <div className="Element-one">
                <h2 className="Dzien-tygodnia Shadow Big">{now.toLocaleDateString(`${t('Dashboard.Weekdays')}`, { weekday: 'long' })} {now.toLocaleDateString(`${t('Dashboard.Weekdays')}`)}</h2>
                
                <p className='text text-center'>{t('Calendar.FirstDescription')}</p>
                <hr className="Line"></hr>
                <div className='Add-event-div' ref={Elem}>
                    <form className='Add-event' id="padd" onSubmit={AddNewDate}>
                        <p className='Shadow'>{t('Calendar.AddEvent')}</p>
                    <input type="text" className='Event-name Shrink' placeholder={t('Calendar.EventName')}
                    required onChange={(e) => setDateName(e.target.value)} ref={Empty}></input>
                    
                    <input className='Event-name' type="date" required onChange={(e) => setDateDay(e.target.value)}></input>
                    <button className='Add-event-btn' type="submit">{t('Calendar.AddBtn')}</button>
                    <span className='Add-event-btn Margin Custom-btn text' onClick={() => setVisible(true)} >X</span>
                    </form>
                </div>
                 <div className='Add-event-div' ref={Elemen}>
                    <form className='Add-event' id="padd" onSubmit={AddNewDateWeek}>
                        <p className='Shadow'>{t('Calendar.AddWeeklyEvent')}</p>
                    <input type="text" ref={Nothing} className='Event-name' placeholder={t('Calendar.EventName')} required onChange={(e) => setDateNameWeek(e.target.value)}></input>
                    
                    <select className='Event-name Shrink' onChange={(e) => setDateWeek(e.target.value)} required defaultValue=''>
                        <option value=''>{t('Calendar.SelectOption')}</option>
                        <option value='1'>{t('Calendar.Monday')}</option>
                        <option value='2'>{t('Calendar.Tuesday')}</option>
                        <option value='3'>{t('Calendar.Wednesday')}</option>
                        <option value='4'>{t('Calendar.Thursday')}</option>
                        <option value='5'>{t('Calendar.Friday')}</option>
                        <option value='6'>{t('Calendar.Saturday')}</option>
                        <option value='0'>{t('Calendar.Sunday')}</option>
                    </select>
                    <button className='Add-event-btn' type="submit">{t('Calendar.AddBtn')}</button>
                    <span className='Add-event-btn Margin Custom-btn text' onClick={() => setVisib(true)} >X</span>
                    </form>
                </div>
                <h2 className='Shadow'>{t('Calendar.Events')}</h2>
                <hr className="Line"></hr>
                <div className='Upcomming-events'>
                    <div className='Bck-space'>
                        {newEvent.length === 0 && <p className='text text-center'>{t('Calendar.NoEvents')}</p>}
                        
                    {newEvent.map((dayly, i) => {
                        return (
                            <div className='Event-each' key={i}>
                                <p className='Shadow Increase'>{dayly.date}</p>
                                <p className='Shadow Increase'>{dayly.Name}</p>
                                <button onClick={() => EventRemove(dayly.id)} className='Add-event-btn'>{t('Calendar.RemoveBtn')}</button>
                            </div>
                        );
                    })}
                    </div>
                    
                    <h2 className='Shadow text-center'>{t('Calendar.WeeklyEvents')}</h2>
                    
                    <p className='text text-center'>{t('Calendar.SecondDescription')}</p>

                    <hr className="Line"></hr>
                    <div className='Event-week'>
                        <div className='Each-day'>
                            <div className='Center-text'>
                            <h2>{t('Calendar.Monday')}</h2>
                            </div>
                            {newEventWeek.filter((dayn) => dayn.date == 1).map((day, i) => {
                                return (
                                    <div className='Todo-tasks' key={i}>
                                        <p>{day.Name}</p>
                                        <button className='Add-event-btn' onClick={() => RemoveWeekEvent(day.id) }>{t('Calendar.RemoveBtn')}</button>
                                    </div>
                                )
                            })}
                        </div>
                        <div className='Each-day'>
                            <div className='Center-text'>
                            <h2>{t('Calendar.Tuesday')}</h2>
                            </div>
                            {newEventWeek.filter((dayn) => dayn.date == 2).map((day, i) => {
                                return (
                                    <div className='Todo-tasks' key={i}>
                                        <p>{day.Name}</p>
                                        <button className='Add-event-btn' onClick={() => RemoveWeekEvent(day.id) }>{t('Calendar.RemoveBtn')}</button>
                                    </div>
                                )
                            })}
                        </div>
                        <div className='Each-day'>
                            <div className='Center-text'>
                            <h2>{t('Calendar.Wednesday')}</h2>
                            </div>
                            {newEventWeek.filter((dayn) => dayn.date == 3).map((day, i) => {
                                return (
                                    <div className='Todo-tasks' key={i}>
                                        <p>{day.Name}</p>
                                        <button className='Add-event-btn' onClick={() => RemoveWeekEvent(day.id) }>{t('Calendar.RemoveBtn')}</button>
                                    </div>
                                )
                            })}
                        </div>
                         <div className='Each-day'>
                            <div className='Center-text'>
                            <h2>{t('Calendar.Thursday')}</h2>
                            </div>
                            {newEventWeek.filter((dayn) => dayn.date == 4).map((day, i) => {
                                return (
                                    <div className='Todo-tasks' key={i}>
                                        <p>{day.Name}</p>
                                        <button className='Add-event-btn' onClick={() => RemoveWeekEvent(day.id) }>{t('Calendar.RemoveBtn')}</button>
                                    </div>
                                )
                            })}
                        </div>
                         <div className='Each-day'>
                            <div className='Center-text'>
                            <h2>{t('Calendar.Friday')}</h2>
                            </div>
                            {newEventWeek.filter((dayn) => dayn.date == 5).map((day, i) => {
                                return (
                                    <div className='Todo-tasks' key={i}>
                                        <p>{day.Name}</p>
                                        <button className='Add-event-btn' onClick={() => RemoveWeekEvent(day.id) }>{t('Calendar.RemoveBtn')}</button>
                                    </div>
                                )
                            })}
                        </div>
                         <div className='Each-day'>
                            <div className='Center-text'>
                            <h2>{t('Calendar.Saturday')}</h2>
                            </div>
                            {newEventWeek.filter((dayn) => dayn.date == 6).map((day, i) => {
                                return (
                                    <div className='Todo-tasks' key={i}>
                                        <p>{day.Name}</p>
                                        <button className='Add-event-btn' onClick={() => RemoveWeekEvent(day.id) }>{t('Calendar.RemoveBtn')}</button>
                                    </div>
                                )
                            })}
                        </div>
                         <div className='Each-day'>
                            <div className='Center-text'>
                            <h2>{t('Calendar.Sunday')}</h2>
                            </div>
                            {newEventWeek.filter((dayn) => dayn.date == 0).map((day, i) => {
                                return (
                                    <div className='Todo-tasks' key={i}>
                                        <p>{day.Name}</p>
                                        <button className='Add-event-btn' onClick={() => RemoveWeekEvent(day.id) }>{t('Calendar.RemoveBtn')}</button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div className="Element-two" >
                <div className="Date">
                    <h2 className="Dzien-tygodnia Shadow">{now.toLocaleDateString(`${t('Dashboard.Weekdays')}`, { month: 'long' })}</h2>
                </div>
                <div className="Calendar-div">
                    <div className="Dni-tygodnia Pointer">
                        <div className="Dni" onClick={() => setVisib(false)}>{t('Calendar.Monday-short')}</div>
                        <div className="Dni" onClick={() => setVisib(false)}>{t('Calendar.Tuesday-short')}</div>
                        <div className="Dni" onClick={() => setVisib(false)}>{t('Calendar.Wednesday-short')}</div>
                        <div className="Dni" onClick={() => setVisib(false)}>{t('Calendar.Thursday-short')}</div>
                        <div className="Dni" onClick={() => setVisib(false)}>{t('Calendar.Friday-short')}</div>
                        <div className="Dni" onClick={() => setVisib(false)}>{t('Calendar.Saturday-short')}</div>
                        <div className="Dni" onClick={() => setVisib(false)}>{t('Calendar.Sunday-short')}</div>
                    </div>
                    <div className="Dni-miesiaca Pointer">
                        {dni.map((dzien, i) => {
                            return (
                                <div key={i} onClick={() => setVisible(false)} id='id20' className={dzien && dzien.getFullYear() === now.getFullYear()
                                    && dzien.getMonth() === now.getMonth()
                                    && dzien.getDate() === now.getDate()
                                    ? 'Dzien-wyg current' : 'Dzien-wyg'}>
                                    {dzien ? dzien.getDate() : ''}
                                </div>
                            )
                        })}
                    </div>
                    <div className="Date">
                        <h2 className="Dzien-tygodnia"></h2>
                    </div>
                </div>
            </div>
        </div>
    );

}