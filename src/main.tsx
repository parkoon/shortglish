// @ts-expect-error fontsource types
import '@fontsource-variable/noto-sans-kr'
import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
