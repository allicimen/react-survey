import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo'; 

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    // ANA KAPLAYICI
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#f3f4f6', 
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', sans-serif"
    }}>
      
      {/* 1. ÜST NAVBAR */}
      <nav style={{
        padding: '24px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo Bölümü */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', fontSize: '20px', color: '#111827' }}>
          <Logo />
          AI Survey
        </div>

        {/* Sağ Butonlar */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link to="/login" style={{ 
            textDecoration: 'none', color: '#4b5563', fontWeight: '600', padding: '10px 20px' 
          }}>
            Giriş Yap
          </Link>
          
          {/* 👇 GÜNCELLENEN KISIM: Link adresi /register yapıldı */}
          <Link to="/register" style={{ 
            textDecoration: 'none', 
            backgroundColor: 'white', 
            color: '#2563eb', 
            border: '1px solid #e5e7eb',
            fontWeight: '600', 
            padding: '10px 24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            Kayıt Ol
          </Link>
        </div>
      </nav>

      {/* 2. ORTA ALAN (HERO SECTION) */}
      <div style={{
        flex: 1, 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',     
        textAlign: 'center',      
        padding: '0 20px'
      }}>
        
        {/* Başlık */}
        <h1 style={{ 
          fontSize: '56px', 
          fontWeight: '800', 
          color: '#111827', 
          margin: '0 0 24px 0',
          lineHeight: '1.1',
          maxWidth: '800px'
        }}>
          Anketlerinizi <span style={{ color: '#2563eb' }}>Yapay Zeka</span> ile<br />
          Saniyeler İçinde Tasarlayın
        </h1>

        {/* Alt Açıklama */}
        <p style={{ 
          fontSize: '20px', 
          color: '#6b7280', 
          maxWidth: '600px',
          margin: '0 0 48px 0',
          lineHeight: '1.6'
        }}>
          Sıkıcı formlarla uğraşmayı bırakın. Konuyu söyleyin, yapay zeka sizin için en doğru soruları hazırlasın ve insanmış gibi sohbet ederek verileri toplasın.
        </p>

        {/* DEV BUTON */}
        <button 
          onClick={() => navigate('/login')} // İstersen burayı da /register yapabilirsin
          style={{
            padding: '20px 48px',
            fontSize: '18px',
            fontWeight: '600',
            color: 'white',
            backgroundColor: '#2563eb', 
            border: 'none',
            borderRadius: '50px', 
            cursor: 'pointer',
            boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)', 
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <span>✨</span> Yapay Zeka Destekli Anket Tasarla
        </button>

        {/* Alt Özellikler */}
        <div style={{ marginTop: '40px', display: 'flex', gap: '30px', color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#2563eb' }}>✓</span> Ücretsiz Başlangıç
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#2563eb' }}>✓</span> Kredi Kartı Gerekmez
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#2563eb' }}>✓</span> 7/24 AI Desteği
          </span>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;