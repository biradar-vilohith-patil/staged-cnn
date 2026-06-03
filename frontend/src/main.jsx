// React application bootstrap: mounts root component with router and toast provider
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0f2040',
            color: '#e8f0fe',
            border: '1px solid rgba(0,212,255,0.2)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#00f5c4', secondary: '#0f2040' },
          },
          error: {
            iconTheme: { primary: '#ff4d6d', secondary: '#0f2040' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
