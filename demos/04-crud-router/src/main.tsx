import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { applyApiUrlFromQuery } from './config/apiUrl'

applyApiUrlFromQuery()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
