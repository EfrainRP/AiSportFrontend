import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'

import MyRoute from './Routes.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <MyRoute />
    </StrictMode>
)
