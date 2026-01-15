import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import './index.css';
import { ThemeProvider } from './context/ThemeContext'; // <-- BU EKSİKTİ

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider> {/* <-- Uygulamayı sarmalamazsak Navbar çalışmaz */}
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);