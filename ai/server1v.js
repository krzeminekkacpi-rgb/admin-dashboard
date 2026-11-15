import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3001;

// Pozwala frontowi (np. localhost:5173 - Vite) odpytywać ten backend bez błędu CORS
app.use(cors());

const IMGW_BASE_URL = 'https://danepubliczne.imgw.pl/api/data/synop';

// Bardzo prosty cache w pamięci - IMGW aktualizuje dane co ok. 10-15 min,
// więc nie ma sensu odpytywać ich serwera przy każdym requeście od użytkownika.
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minut

function getFromCache(key) {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
        cache.delete(key);
        return null;
    }
    return entry.data;
}

function setCache(key, data) {
    cache.set(key, { data, timestamp: Date.now() });
}

// GET /api/synop -> dane ze wszystkich stacji synoptycznych
app.get('/api/synop', async (req, res) => {
    const cacheKey = 'all';
    const cached = getFromCache(cacheKey);
    if (cached) {
        return res.json(cached);
    }

    try {
        const response = await axios.get(IMGW_BASE_URL, { timeout: 7000 });
        setCache(cacheKey, response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Błąd pobierania danych z IMGW:', error.message);
        res.status(502).json({
            error: 'Nie udało się pobrać danych z IMGW',
            details: error.message
        });
    }
});

// GET /api/synop/station/:name -> dane dla konkretnej stacji po nazwie
// np. /api/synop/station/warszawa
app.get('/api/synop/station/:name', async (req, res) => {
    const { name } = req.params;
    const cacheKey = `station:${name.toLowerCase()}`;
    const cached = getFromCache(cacheKey);
    if (cached) {
        return res.json(cached);
    }

    try {
        const url = `${IMGW_BASE_URL}/station/${encodeURIComponent(name)}`;
        const response = await axios.get(url, { timeout: 7000 });
        setCache(cacheKey, response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Błąd pobierania danych z IMGW:', error.message);
        res.status(502).json({
            error: 'Nie udało się pobrać danych z IMGW',
            details: error.message
        });
    }
});

// GET /api/synop/id/:id -> dane dla konkretnej stacji po id
app.get('/api/synop/id/:id', async (req, res) => {
    const { id } = req.params;
    const cacheKey = `id:${id}`;
    const cached = getFromCache(cacheKey);
    if (cached) {
        return res.json(cached);
    }

    try {
        const url = `${IMGW_BASE_URL}/id/${encodeURIComponent(id)}`;
        const response = await axios.get(url, { timeout: 7000 });
        setCache(cacheKey, response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Błąd pobierania danych z IMGW:', error.message);
        res.status(502).json({
            error: 'Nie udało się pobrać danych z IMGW',
            details: error.message
        });
    }
});

// Współrzędne Warszawy (Open-Meteo wymaga lat/lon, nie nazwy miasta)
const WARSZAWA_LAT = 52.2297;
const WARSZAWA_LON = 21.0122;
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

// Mapowanie kodów pogodowych WMO (używanych przez Open-Meteo) na czytelne opisy PL
/*
function opisPogody(code) {
    if (code === 0) return 'Słonecznie / bezchmurnie';
    if ([1, 2, 3].includes(code)) return 'Częściowo pochmurno';
    if ([45, 48].includes(code)) return 'Mgła';
    if ([51, 53, 55].includes(code)) return 'Mżawka';
    if ([56, 57].includes(code)) return 'Mżawka z marznącym deszczem';
    if ([61, 63, 65].includes(code)) return 'Deszcz';
    if ([66, 67].includes(code)) return 'Marznący deszcz';
    if ([71, 73, 75].includes(code)) return 'Śnieg';
    if (code === 77) return 'Śnieg ziarnisty';
    if ([80, 81, 82].includes(code)) return 'Przelotny deszcz';
    if ([85, 86].includes(code)) return 'Przelotny śnieg';
    if ([95, 96, 99].includes(code)) return 'Burza';
    return 'Nieznane warunki';
}
    */

function opisPogody(code) {
    if (code === 0) return '☀️';
    if ([1, 2, 3].includes(code)) return '⛅';
    if ([45, 48].includes(code)) return '🌫️';
    if ([51, 53, 55].includes(code)) return '🌦️';
    if ([56, 57].includes(code)) return '🌧️❄️';
    if ([61, 63, 65].includes(code)) return '🌧️';
    if ([66, 67].includes(code)) return '🌧️❄️';
    if ([71, 73, 75].includes(code)) return '❄️';
    if (code === 77) return '🌨️';
    if ([80, 81, 82].includes(code)) return '🌧️';
    if ([85, 86].includes(code)) return '🌨️';
    if ([95, 96, 99].includes(code)) return '⛈️';
    return '❓';
}

// GET /api/weather/warszawa/today -> temperatura, opady i warunki co godzinę, dziś 00:00-23:00
app.get('/api/weather/warszawa/today', async (req, res) => {
    const cacheKey = 'warszawa-today';
    const cached = getFromCache(cacheKey);
    if (cached) {
        return res.json(cached);
    }

    try {
        const response = await axios.get(OPEN_METEO_URL, {
            params: {
                latitude: WARSZAWA_LAT,
                longitude: WARSZAWA_LON,
                hourly: 'temperature_2m,precipitation,weathercode',
                timezone: 'Europe/Warsaw'
            },
            timeout: 7000
        });

        // Open-Meteo zawsze zaczyna dane od 0:00 dzisiaj, więc bierzemy pierwsze 24 godziny
        const hours = response.data.hourly.time.slice(0, 24);
        const temps = response.data.hourly.temperature_2m.slice(0, 24);
        const opady = response.data.hourly.precipitation.slice(0, 24);
        const kody = response.data.hourly.weathercode.slice(0, 24);

        const result = hours.map((time, i) => ({
            godzina: time.split('T')[1], // np. "14:00"
            temperatura: temps[i],
            opady_mm: opady[i],
            warunki: opisPogody(kody[i])
        }));

        setCache(cacheKey, result);
        res.json(result);
    } catch (error) {
        console.error('Błąd pobierania danych z Open-Meteo:', error.message);
        res.status(502).json({
            error: 'Nie udało się pobrać danych pogodowych',
            details: error.message
        });
    }
});

// GET /api/weather/warszawa/week -> dziś + 7 dni w przód, średnia temp/dzień + opady
app.get('/api/weather/warszawa/week', async (req, res) => {
    const cacheKey = 'warszawa-week';
    const cached = getFromCache(cacheKey);
    if (cached) {
        return res.json(cached);
    }

    try {
        const response = await axios.get(OPEN_METEO_URL, {
            params: {
                latitude: WARSZAWA_LAT,
                longitude: WARSZAWA_LON,
                daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode',
                timezone: 'Europe/Warsaw',
                forecast_days: 7 // dziś + 6 kolejnych dni
            },
            timeout: 7000
        });

        const dni = response.data.daily.time;
        const tempMax = response.data.daily.temperature_2m_max;
        const tempMin = response.data.daily.temperature_2m_min;
        const opady = response.data.daily.precipitation_sum;
        const kody = response.data.daily.weathercode;

        const result = dni.map((data, i) => ({
            data,
            temperatura_srednia: Math.round(((tempMax[i] + tempMin[i]) / 2) * 10) / 10,
            temperatura_min: tempMin[i],
            temperatura_max: tempMax[i],
            opady_mm: opady[i],
            warunki: opisPogody(kody[i])
        }));

        setCache(cacheKey, result);
        res.json(result);
    } catch (error) {
        console.error('Błąd pobierania danych z Open-Meteo:', error.message);
        res.status(502).json({
            error: 'Nie udało się pobrać danych pogodowych',
            details: error.message
        });
    }
});

// Healthcheck - przydatne do sprawdzenia czy serwer żyje
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Backend IMGW działa na http://localhost:${PORT}`);
    console.log(`Przykład: http://localhost:${PORT}/api/synop`);
});
