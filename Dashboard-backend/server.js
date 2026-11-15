import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;
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

const weatherCache = new Map();
const WEATHER_TTL_MS = 30 * 60 * 1000; // 30 minut

async function fetchOpenMeteo(params) {
    const key = JSON.stringify(params);
    const hit = weatherCache.get(key);
    if (hit && Date.now() - hit.timestamp < WEATHER_TTL_MS) {
        return hit.data;
    }
    try {
        const response = await axios.cachedGet(OPEN_METEO_URL, { params, timeout: 10000 });
        weatherCache.set(key, { data: response.data, timestamp: Date.now() });
        return response.data;
    } catch (error) {
        if (hit) return hit.data;
        throw error;
    }
}

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
        const response = await axios.cachedGet(OPEN_METEO_URL, {
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

// ============================================================================
// RYNKI: krypto, surowce, waluty -> świece OHLC w 4 ramkach czasowych
// Źródło: Yahoo Finance, endpoint wykresów (nieoficjalny, bez klucza API).
// Dane są odświeżane co minutę i trzymane w pamięci (marketStore).
// ============================================================================

const YAHOO_CHART_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

// Co ile odświeżać dane. Zwiększ (np. do 5 * 60 * 1000), jeśli Yahoo zacznie zwracać błąd 429.
const MARKET_REFRESH_MS = 60 * 1000;
// Przerwa między kolejnymi zapytaniami do Yahoo, żeby nie wysyłać wszystkich naraz.
const MARKET_REQUEST_GAP_MS = 300;

// Jeśli coś z listy ma być inne (np. ropa Brent), zmień tylko pole "yahoo".
const MARKET_SYMBOLS = {
    btc:    { name: 'Bitcoin',        yahoo: 'BTC-USD',  quote: 'USD' },
    eth:    { name: 'Ethereum',       yahoo: 'ETH-USD',  quote: 'USD' },
    sol:    { name: 'Solana',         yahoo: 'SOL-USD',  quote: 'USD' },
    gold:   { name: 'Złoto',          yahoo: 'GC=F',     quote: 'USD' },
    silver: { name: 'Srebro',         yahoo: 'SI=F',     quote: 'USD' },
    oil:    { name: 'Ropa (WTI)',     yahoo: 'CL=F',     quote: 'USD' },
    usdpln: { name: 'Dolar / złoty',  yahoo: 'USDPLN=X', quote: 'PLN' },
    eurpln: { name: 'Euro / złoty',   yahoo: 'EURPLN=X', quote: 'PLN' },
    eurusd: { name: 'Euro / dolar',   yahoo: 'EURUSD=X', quote: 'USD' }
};

// Trzy rodzaje zapytań do Yahoo. Roczne świece powstają z miesięcznych, bo Yahoo nie ma interwału rocznego.
const YAHOO_REQUESTS = {
    hourly:  { interval: '1h',  range: '5d'  },
    daily:   { interval: '1d',  range: '3mo' },
    monthly: { interval: '1mo', range: '10y' }
};

// Ramki czasowe: z którego zapytania pochodzą, jak grupować świece i ile ich zostawić.
const MARKET_FRAMES = {
    '1h':  { source: 'hourly',  groupBy: 'hour',  limit: 24 }, // 24 świece godzinowe
    '1d':  { source: 'daily',   groupBy: 'day',   limit: 30 }, // 30 świec dziennych
    '1mo': { source: 'monthly', groupBy: 'month', limit: 12 }, // 12 świec miesięcznych
    '1y':  { source: 'monthly', groupBy: 'year',  limit: 10 }  // 10 świec rocznych
};

// "1m" traktujemy jako miesiąc (minutowej ramki nie ma)
const MARKET_FRAME_ALIASES = { '1m': '1mo' };

// Dane trzymane w pamięci. Klucz: "btc:1h" -> { candles, updatedAt }
const marketStore = new Map();
// Ostatnie błędy pobierania. Klucz: "btc:hourly" -> { message, at }
const marketErrors = new Map();
// Zmiana ceny z ostatnich 24h. Klucz: "btc" -> { percent, direction, emoji, price, previousPrice }
const marketChange = new Map();
let marketRefreshRunning = false;

// --- pomocnicze: czas w strefie Europe/Warsaw ---------------------------------

const warsawFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23'
});

function warsawParts(ms) {
    const parts = {};
    for (const part of warsawFormatter.formatToParts(new Date(ms))) {
        parts[part.type] = part.value;
    }
    return parts; // { year, month, day, hour }
}

// Podpis świecy (pole "Time") w formacie takim jak w Twoich wydatkach: 2026.10.28 14.00
// Jest unikalny w obrębie ramki, więc nadaje się na dataKey osi X.
const TIME_LABEL = {
    hour:  (p) => `${p.year}.${p.month}.${p.day} ${p.hour}.00`,
    day:   (p) => `${p.year}.${p.month}.${p.day}`,
    month: (p) => `${p.year}.${p.month}`,
    year:  (p) => `${p.year}`
};

// --- pobieranie i przetwarzanie danych ----------------------------------------

async function fetchYahooCandles(yahooSymbol, { interval, range }) {
    // Symbole pochodzą z listy MARKET_SYMBOLS, więc nie trzeba ich kodować (GC=F zostaje GC=F).
    const response = await axios.get(`${YAHOO_CHART_URL}/${yahooSymbol}`, {
        params: { interval, range, includePrePost: false },
        // Bez przeglądarkowego User-Agent Yahoo częściej odrzuca zapytania.
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36' },
        timeout: 10000
    });

    const result = response.data?.chart?.result?.[0];
    if (!result) {
        throw new Error(response.data?.chart?.error?.description || 'Yahoo zwróciło pustą odpowiedź');
    }

    const timestamps = result.timestamp;
    const quote = result.indicators?.quote?.[0];
    if (!timestamps || !quote) {
        throw new Error('Yahoo nie zwróciło świec dla tego symbolu');
    }

    const candles = [];
    for (let i = 0; i < timestamps.length; i++) {
        const open = quote.open[i];
        const high = quote.high[i];
        const low = quote.low[i];
        const close = quote.close[i];
        // Yahoo wstawia null tam, gdzie rynek był zamknięty - takie świece pomijamy
        if ([open, high, low, close].some((v) => typeof v !== 'number' || Number.isNaN(v))) continue;
        candles.push({ ts: timestamps[i] * 1000, open, high, low, close });
    }
    return candles;
}

// Zaokrągla do 6 miejsc po przecinku (kursy walut potrzebują więcej niż 2)
const roundPrice = (v) => Math.round(v * 1e6) / 1e6;

// Łączy drobne świece w większe (np. 1h -> doba, miesiąc -> rok) i zostawia ostatnie "limit".
// Zasady: open = pierwsze open, close = ostatnie close, high = największe, low = najmniejsze.
function buildCandles(raw, groupBy, limit) {
    const groups = new Map();
    const sorted = [...raw].sort((a, b) => a.ts - b.ts);

    for (const c of sorted) {
        const key = TIME_LABEL[groupBy](warsawParts(c.ts));
        const group = groups.get(key);
        if (!group) {
            groups.set(key, { Time: key, timestamp: c.ts, open: c.open, high: c.high, low: c.low, close: c.close });
        } else {
            group.high = Math.max(group.high, c.high);
            group.low = Math.min(group.low, c.low);
            group.close = c.close;
        }
    }

    return [...groups.values()].slice(-limit).map((g) => {
        const low = roundPrice(g.low);
        const high = roundPrice(g.high);
        return {
            Time: g.Time,
            timestamp: g.timestamp,
            open: roundPrice(g.open),
            close: roundPrice(g.close),
            high,
            low,
            range: [low, high] // to pole jest potrzebne do <Bar dataKey="range" />
        };
    });
}

// Zmiana ceny z ostatnich 24h, liczona zawsze z danych godzinowych (niezależnie od wybranej ramki).
// Cena teraz = close ostatniej świecy. Cena sprzed doby = open świecy sprzed 24h od początku ostatniej świecy.
// Dokładność do godziny. Dla rynków zamkniętych (weekend) porównuje ostatnie dostępne notowania.
function calcChange24h(raw) {
    if (!raw || raw.length === 0) return null;

    const sorted = [...raw].sort((a, b) => a.ts - b.ts);
    const last = sorted[sorted.length - 1];
    const targetTs = last.ts - 24 * 60 * 60 * 1000;

    // ostatnia świeca, która zaczęła się najpóźniej o 24h przed ostatnią
    let ref = null;
    for (const c of sorted) {
        if (c.ts <= targetTs) ref = c;
        else break;
    }
    if (!ref || !ref.open) return null; // za mało historii albo cena 0

    const percent = Math.round(((last.close - ref.open) / ref.open) * 10000) / 100; // 2 miejsca po przecinku
    const direction = percent > 0 ? 'up' : percent < 0 ? 'down' : 'flat';

    return {
        percent,                                              // np. 5.23 albo -1.8
        direction,                                            // 'up' | 'down' | 'flat'
        emoji: direction === 'up' ? '↗' : direction === 'down' ? '↘' : '➡',
        price: roundPrice(last.close),                        // cena teraz
        previousPrice: roundPrice(ref.open)                   // cena sprzed ok. 24h
    };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function refreshMarketSymbol(id) {
    const { yahoo } = MARKET_SYMBOLS[id];

    for (const [sourceName, params] of Object.entries(YAHOO_REQUESTS)) {
        try {
            const raw = await fetchYahooCandles(yahoo, params);
            const updatedAt = new Date().toISOString();

            // Zmiana 24h pochodzi zawsze z danych godzinowych. Gdy się nie uda jej policzyć, zostaje poprzednia.
            if (sourceName === 'hourly') {
                const change = calcChange24h(raw);
                if (change) marketChange.set(id, change);
            }

            for (const [frame, cfg] of Object.entries(MARKET_FRAMES)) {
                if (cfg.source !== sourceName) continue;
                marketStore.set(`${id}:${frame}`, {
                    candles: buildCandles(raw, cfg.groupBy, cfg.limit),
                    updatedAt
                });
            }
            marketErrors.delete(`${id}:${sourceName}`);
        } catch (error) {
            // Przy błędzie zostają poprzednie dane (marketStore się nie zmienia)
            marketErrors.set(`${id}:${sourceName}`, { message: error.message, at: new Date().toISOString() });
            console.error(`Błąd pobierania ${id} (${sourceName}) z Yahoo:`, error.message);
        }
        await sleep(MARKET_REQUEST_GAP_MS);
    }
}

async function refreshAllMarkets() {
    if (marketRefreshRunning) return; // poprzednie odświeżanie jeszcze trwa
    marketRefreshRunning = true;
    try {
        for (const id of Object.keys(MARKET_SYMBOLS)) {
            await refreshMarketSymbol(id);
        }
    } finally {
        marketRefreshRunning = false;
    }
}

// Pierwsze pobranie zaraz po starcie, potem co minutę
refreshAllMarkets();
setInterval(refreshAllMarkets, MARKET_REFRESH_MS);

// --- endpointy -------------------------------------------------------------------

// GET /api/market/symbols -> lista dostępnych aktywów i informacja, czy dane są już gotowe
app.get('/api/market/symbols', (req, res) => {
    const frames = Object.keys(MARKET_FRAMES);
    res.json(
        Object.entries(MARKET_SYMBOLS).map(([id, s]) => ({
            id,
            name: s.name,
            quote: s.quote,
            yahoo: s.yahoo,
            ready: frames.every((f) => marketStore.has(`${id}:${f}`)),
            change24h: marketChange.get(id) || null
        }))
    );
});

// GET /api/market/:symbol -> wszystkie 4 ramki naraz, np. /api/market/btc
app.get('/api/market/:symbol', (req, res) => {
    const id = req.params.symbol.toLowerCase();
    const symbol = MARKET_SYMBOLS[id];
    if (!symbol) {
        return res.status(404).json({ error: 'Nieznany symbol', available: Object.keys(MARKET_SYMBOLS) });
    }

    const frames = {};
    const updatedAt = {};
    for (const frame of Object.keys(MARKET_FRAMES)) {
        const entry = marketStore.get(`${id}:${frame}`);
        frames[frame] = entry ? entry.candles : [];
        updatedAt[frame] = entry ? entry.updatedAt : null;
    }

    if (Object.values(updatedAt).every((v) => v === null)) {
        return res.status(503).json({ error: 'Dane jeszcze się ładują, spróbuj za chwilę' });
    }

    res.json({ symbol: id, name: symbol.name, quote: symbol.quote, change24h: marketChange.get(id) || null, updatedAt, frames });
});

// GET /api/market/:symbol/:frame -> jedna ramka, np. /api/market/btc/1h
// frame: 1h | 1d | 1mo | 1y   ("1m" też działa i oznacza miesiąc)
app.get('/api/market/:symbol/:frame', (req, res) => {
    const id = req.params.symbol.toLowerCase();
    const symbol = MARKET_SYMBOLS[id];
    if (!symbol) {
        return res.status(404).json({ error: 'Nieznany symbol', available: Object.keys(MARKET_SYMBOLS) });
    }

    const requested = req.params.frame.toLowerCase();
    const frame = MARKET_FRAME_ALIASES[requested] || requested;
    if (!MARKET_FRAMES[frame]) {
        return res.status(400).json({ error: 'Nieznana ramka czasowa', available: Object.keys(MARKET_FRAMES) });
    }

    const entry = marketStore.get(`${id}:${frame}`);
    if (!entry) {
        return res.status(503).json({ error: 'Dane jeszcze się ładują, spróbuj za chwilę' });
    }

    res.json({ symbol: id, name: symbol.name, quote: symbol.quote, frame, change24h: marketChange.get(id) || null, updatedAt: entry.updatedAt, candles: entry.candles });
});

// Healthcheck - przydatne do sprawdzenia czy serwer żyje
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Backend IMGW działa na http://localhost:${PORT}`);
    console.log(`Przykład: http://localhost:${PORT}/api/synop`);
});
