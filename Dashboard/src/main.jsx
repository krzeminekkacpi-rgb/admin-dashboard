import { HashRouter } from 'react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './components/utils/i18next.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
    <App />
    </HashRouter>
  </StrictMode>,
)
