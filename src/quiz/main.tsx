import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import '@/index.css'
import App from './App'

// The page text is already in the HTML (see scripts/prerender.mjs), so React attaches to it.
hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <App />
  </StrictMode>,
)
