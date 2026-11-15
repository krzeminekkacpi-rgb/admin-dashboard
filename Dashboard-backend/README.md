# IMGW Backend (proxy)

Prosty backend Express, który pobiera dane pogodowe z publicznego API IMGW
i wystawia je dalej dla Twojej aplikacji React — dzięki temu front nigdy nie
odpytuje IMGW bezpośrednio, więc nie dostajesz błędu CORS.

## 1. Instalacja

```bash
cd imgw-backend
npm install
```

## 2. Uruchomienie

```bash
npm start
```

albo w trybie z automatycznym restartem po zmianach w kodzie:

```bash
npm run dev
```

Serwer wystartuje na `http://localhost:3001`.

## 3. Dostępne endpointy

| Endpoint | Co zwraca |
|---|---|
| `GET /api/synop` | dane ze wszystkich stacji synoptycznych |
| `GET /api/synop/station/:name` | dane jednej stacji po nazwie, np. `/api/synop/station/warszawa` (bez polskich znaków) |
| `GET /api/synop/id/:id` | dane jednej stacji po id, np. `/api/synop/id/12500` |
| `GET /health` | sprawdzenie, czy serwer żyje |

Dane są cache'owane na 5 minut w pamięci serwera (IMGW i tak aktualizuje je
co ok. 10-15 minut), żeby nie zalewać ich API requestami.

## 4. Podłączenie z React (Board.jsx)

Zamień adres w `axios.get(...)` na adres swojego backendu:

```jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Board.css'

export function Board({ hidden, setHidden }) {
    const [pogoda, setPogoda] = useState([]);

    useEffect(() => {
        const fetchPogoda = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/synop');
                setPogoda(response.data);
            } catch (error) {
                console.log("fetch error", error);
            }
        };
        fetchPogoda();
    }, []);

    useEffect(() => {
        console.log(pogoda);
    }, [pogoda]);

    // ...reszta komponentu
}
```

Teraz request idzie: **React (localhost:5173) → Twój backend (localhost:3001)
→ IMGW**. Backend i IMGW rozmawiają serwer-serwer, więc CORS przestaje być
problemem — przeglądarka widzi tylko request do `localhost:3001`, na który
backend sam ustawia nagłówki CORS (przez middleware `cors()`).

## 5. Wdrożenie na produkcję

Jeśli kiedyś wystawisz apkę na realnej domenie (nie localhost), ten backend
musi gdzieś działać "na żywo" — np. na Render, Railway, Fly.io albo VPS.
Wtedy w froncie zamieniasz `http://localhost:3001` na adres swojego
wdrożonego backendu (np. `https://twoj-backend.onrender.com/api/synop`).

## Uwaga

Nie testowałem requestu do `danepubliczne.imgw.pl` z tego środowiska
(sandbox, w którym pisałem kod, ma zablokowany dostęp do tej domeny) —
ale endpoint jest oficjalnie dokumentowany przez IMGW, więc powinien
działać od razu po `npm install && npm start`. Jeśli coś nie zagra,
sprawdź dokładny komunikat błędu w terminalu, w którym działa backend
(`node server.js`) — to da konkretną odpowiedź co dalej.
