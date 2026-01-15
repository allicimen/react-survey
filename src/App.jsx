// src/App.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
// import MainLayout from './layout/MainLayout'; // <-- Bunu silebilirsin, gerek kalmadı.

const App = () => {
  return (
    // Fragment yerine div kullanabiliriz, CSS için sınıf verebiliriz
    <div className="app-layout">
      {/* Sabit Üst Menü */}
      <Navbar /> 
      
      {/* Sayfaların değiştiği alan (Dinamik içerik) */}
      <main style={{ minHeight: 'calc(100vh - 70px)' }}> 
        <Outlet />
      </main>
    </div>
  );
};

export default App;