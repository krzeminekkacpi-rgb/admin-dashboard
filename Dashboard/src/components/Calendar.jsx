import { useTranslation } from "react-i18next";
import "./Calendar.css"

export function Calendar({ newEvent, newEventWeek }) {
    const now = new Date();

    const rok = now.getFullYear();
    const miesiac = now.getMonth();
    const innymies = String(now.getMonth() + 1).padStart(2, '0');
    const innydzien = String(now.getDate()).padStart(2, '0');
    const fullDate = `${rok}-${innymies}-${innydzien}`;
    const dzienTyg = now.getDay();
    const { t } = useTranslation();

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
    return (

        <div className="Main-calendar">
            <div className="Element-one">
                <h2 className="Dzien-tygodnia Shadow">{now.toLocaleDateString(`${t('Dashboard.Weekdays')}`, { weekday: 'long' })} {now.toLocaleDateString(`${t('Dashboard.Weekdays')}`)}</h2>
                <div className='Events'>
                    {newEvent.filter(day => day.date === fullDate).map((days, i) => {
                        return (
                            <div className='Event-dashboard' key={i}>
                                <p>{days.Name}</p>
                            </div>
                        );
                    })}
                    {newEventWeek.filter(day => day.date == dzienTyg).map((days, i) => {
                        return (
                            <div className='Event-dashboard light' key={i}>
                                <p>{days.Name}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="Element-two">
                <div className="Date">
                    <h2 className="Dzien-tygodnia Shadow">{now.toLocaleDateString(`${t('Dashboard.Weekdays')}`, { month: 'long' })}</h2>
                </div>
                <div className="Calendar-div">
                    <div className="Dni-tygodnia">
                        <div className="Dni">{t('Calendar.Monday-short')}</div>
                        <div className="Dni">{t('Calendar.Tuesday-short')}</div>
                        <div className="Dni">{t('Calendar.Wednesday-short')}</div>
                        <div className="Dni">{t('Calendar.Thursday-short')}</div>
                        <div className="Dni">{t('Calendar.Friday-short')}</div>
                        <div className="Dni">{t('Calendar.Saturday-short')}</div>
                        <div className="Dni">{t('Calendar.Sunday-short')}</div>
                    </div>
                    <div className="Dni-miesiaca">
                        {dni.map((dzien, i) => {
                            return (
                                <div key={i} className={dzien && dzien.getYear() === now.getYear()
                                    && dzien.getMonth() === now.getMonth()
                                    && dzien.getDate() === now.getDate()
                                    ? 'Dzien-wyg current' : 'Dzien-wyg'}>
                                    {dzien ? dzien.getDate() : ''}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );

}