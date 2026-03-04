import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Add this inline style fix
document.documentElement.style.cssText = 'margin:0;padding:0;background:#0d1117;'
document.body.style.cssText = 'margin:0;padding:0;background:#0d1117;'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)