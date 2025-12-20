import React from 'react';
import Navbar from '../components/Navbar';

// Props:
// children: React'in özel bir props'udur.
// App.jsx içinde <MainLayout> ... </MainLayout> arasına ne koyarsak
// "children" olarak buraya gelir ve Navbar'ın altında görüntülenir.
const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      {/* 1. Her sayfada görünecek sabit Üst Menü */}
      <Navbar />

      {/* 2. Değişen içerik alanı (Sayfalar buraya yüklenecek) */}
      {/* Arka plan rengini App.css'den alıyor ama garanti olsun diye ekledim */}
      <main style={{ minHeight: 'calc(100vh - 64px)', paddingBottom: '50px' }}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;