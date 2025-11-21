import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { StreakProvider } from './contexts/StreakContext'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StreakProvider>
          <App />
        </StreakProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
