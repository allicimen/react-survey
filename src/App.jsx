import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout'; // Çerçeve yapımız
import routes from './routes'; // Rota listemiz
import './App.css'; // Genel stiller

function App() {
  return (
    // 1. Uygulamayı Router ile sarmalıyoruz ki sayfalar arası geçiş çalışsın
    <BrowserRouter>
      
      {/* 2. Her sayfada sabit duracak Navbar için MainLayout kullanıyoruz */}
      <MainLayout>
        
        {/* 3. URL değiştiğinde hangi sayfanın açılacağını burada belirliyoruz */}
        <Routes>
          {routes.map((route, index) => (
            <Route 
              key={index} 
              path={route.path} 
              element={route.element} 
            />
          ))}
        </Routes>
        
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;