import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// import './index.css'; // Eğer varsa index.css'i de buraya ekleyebilirsin

// HTML'deki <div id="root"> elemanını bul ve içine Uygulamayı (App) yerleştir
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);