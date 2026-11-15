import axios from 'axios';
import { Routes, Route } from 'react-router';
import { useState, useEffect } from 'react';
import { DashBoard } from './Pages/DashBoard';
import { Kalendarz } from './Pages/Kalendarz';
import { SwitchProvider } from './components/SwitchContext';
import { Notatnik } from './Pages/Notatnik';
import { Kalkulator } from './Pages/Kalkulator';
import { Kasa } from './Pages/Kasa';
import { Wykresy } from './Pages/Wykresy';
import { Settings } from './Pages/Settings';
import { API_URL } from "./config";

import './App.css'


function App() {

    const [hidden, setHidden] = useState(true);
    const [pogodaDzis, setPogodaDzis] = useState([]);
    const [pogodaTydzien, setPogodaTydzien] = useState([]);
    const [timeFrame, setTimeFrame] = useState(true);
    const [btc, setBtc] = useState([]);
    const [eth, setEth] = useState([]);
    const [sol, setSol] = useState([]);
    const [gold, setGold] = useState([]);
    const [silver, setSilver] = useState([]);
    const [oil, setOil] = useState([]);
    const [usd, setUsd] = useState([]);
    const [eur, setEur] = useState([]);

    const [pageHide, setPageHide] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('pageHide')) || false
        } catch {
            return false;
        }
    });

    const [marketHide, setMarketHide] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('marketHide')) || false
        } catch {
            return false;
        }
    });

    const [newEvent, setNewEvent] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('newEvent')) || []
        } catch {
            return [];
        }
    });

    const [newEventWeek, setNewEventWeek] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('newEventWeek')) || []
        } catch {
            return [];
        }
    });
    const [operatorName, setOperatorName] = useState(() => {
         try {
            return JSON.parse(localStorage.getItem('operatorName')) || 'Admin'
        } catch {
            return 'Admin';
        }
    })

    useEffect(() => {

        const fetchPogoda = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/weather/warszawa/today`)
                setPogodaDzis(response.data)
            } catch (error) {
                console.log("fetch error", error);
            }
        }
        fetchPogoda();
    }, []);
    useEffect(() => {
        console.log(pogodaDzis);
    }, [pogodaDzis]);

    useEffect(() => {

        const fetchPogoda = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/weather/warszawa/week`)
                setPogodaTydzien(response.data)
            } catch (error) {
                console.log("fetch error", error);
            }
        }
        fetchPogoda();
    }, []);
    useEffect(() => {
        console.log(pogodaTydzien);
    }, [pogodaTydzien]);

    useEffect(() => {
        const promise = async () => {
            try {
                const wait = await axios.get(`${API_URL}/api/market/btc`);
                setBtc(wait.data);
            } catch (error) {
                console.log(error);
            }
        }
        promise();
        const id = setInterval(promise, 1000 * 60);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const promise = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/market/eth`);
                setEth(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        promise();
        const id = setInterval(promise, 1000 * 60);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const promise = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/market/sol`);
                setSol(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        promise();
        const id = setInterval(promise, 1000 * 60);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const promise = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/market/gold`);
                setGold(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        promise();
        const id = setInterval(promise, 1000 * 60);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const promise = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/market/silver`);
                setSilver(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        promise();
        const id = setInterval(promise, 1000 * 60);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const promise = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/market/oil`);
                setOil(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        promise();
        const id = setInterval(promise, 1000 * 60);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const promise = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/market/usdpln`);
                setUsd(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        promise();
        const id = setInterval(promise, 1000 * 60);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const promise = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/market/eurpln`);
                setEur(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        promise();
        const id = setInterval(promise, 1000 * 60);
        return () => clearInterval(id);
    }, []);

    return (
        <>
            <SwitchProvider>
                <Routes>
                    <Route path='/' element={<DashBoard operatorName={operatorName} hidden={hidden} setHidden={setHidden} pageHide={pageHide} pogodaDzis={pogodaDzis}
                        pogodaTydzien={pogodaTydzien} timeFrame={timeFrame} setTimeFrame={setTimeFrame} newEvent={newEvent} newEventWeek={newEventWeek}
                        btc={btc} eth={eth} sol={sol} gold={gold} silver={silver} oil={oil} usd={usd} eur={eur} marketHide={marketHide} />} />
                    <Route path='Kalendarz' element={<Kalendarz operatorName={operatorName} hidden={hidden} setHidden={setHidden} pageHide={pageHide} newEvent={newEvent} newEventWeek={newEventWeek} setNewEvent={setNewEvent} setNewEventWeek={setNewEventWeek} />} />
                    <Route path='Kalkulator' element={<Kalkulator operatorName={operatorName} hidden={hidden} setHidden={setHidden} pageHide={pageHide} />} />
                    <Route path='Notatnik' element={<Notatnik operatorName={operatorName} hidden={hidden} setHidden={setHidden} pageHide={pageHide} />} />
                    <Route path='Kasa' element={<Kasa operatorName={operatorName} hidden={hidden} pageHide={pageHide} setHidden={setHidden} />} />
                    <Route path='Wykresy' element={<Wykresy operatorName={operatorName} hidden={hidden} setHidden={setHidden} pageHide={pageHide} btc={btc} eth={eth} sol={sol} gold={gold} silver={silver} oil={oil} usd={usd} eur={eur} />} />
                    <Route path='Settings' element={<Settings setOperatorName={setOperatorName} operatorName={operatorName} hidden={hidden} setHidden={setHidden} setPageHide={setPageHide} pageHide={pageHide} marketHide={marketHide} setMarketHide={setMarketHide} />} />
                </Routes>
            </SwitchProvider>
        </>
    )
}

export default App
