// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useHome from '../hooks/useHome'; 

// --- MODERN SVG İKONLAR ---
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const Home = () => {
  const navigate = useNavigate();
  const {
    searchTerm, setSearchTerm,
    filteredSurveys,
    totalSurveys,
    totalResponses,
    handleDelete,
    handleShare,
    formatDate,
    isLoading
  } = useHome();

  // MOBİL KONTROLÜ
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', gap: '15px' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTop: '4px solid #2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <div style={{ color: '#64748b', fontWeight: '500', fontSize: '16px' }}>Veriler Yükleniyor...</div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // --- DİNAMİK STİLLER ---
  // Masaüstündeki o boşluğu yöneten ana konteyner stili
  const containerStyle = {
    maxWidth: isMobile ? '100%' : '1200px', // Masaüstünde alanı biraz daha genişlettik
    margin: '0 auto',
    padding: isMobile ? '20px 15px' : '40px 24px',
    paddingBottom: '50px'
  };

  const gridStyle = {
    display: 'grid',
    // Boşluk kalmaması için minmax değerini esnettik
    gridTemplateColumns: isMobile 
        ? '1fr' 
        : 'repeat(auto-fill, minmax(min(100%, 350px), 1fr))', 
    gap: '24px',
    justifyContent: 'start' // Kartları sola yaslar, böylece boşluk solda değil sağda (veya eşit) kalır
  };

  return (
    <div style={containerStyle}>
      
      {/* 1. İSTATİSTİKLER */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: isMobile ? '24px' : '28px', color: '#1e293b', marginBottom: '20px', fontWeight:'800' }}>Panelim</h1>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={statsCardStyle}>
            <div style={{ fontSize: '14px', color: '#64748b', fontWeight:'500' }}>Toplam Anket</div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a' }}>{totalSurveys}</div>
          </div>
          <div style={statsCardStyle}>
            <div style={{ fontSize: '14px', color: '#64748b', fontWeight:'500' }}>Toplam Yanıt</div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a' }}>{totalResponses}</div>
          </div>
          <Link to="/create" style={{ ...statsCardStyle, backgroundColor: '#2563eb', color: 'white', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', textDecoration:'none', border:'none' }}>
            <div style={{ fontSize: '28px' }}>+</div>
            <div style={{ fontWeight: '600', fontSize:'16px' }}>Yeni Anket Oluştur</div>
          </Link>
        </div>
      </div>

      {/* 2. ARAMA ÇUBUĞU */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '24px', gap: '15px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#334155', margin: 0 }}>Anketlerim</h2>
        <div style={{ position: 'relative', width: isMobile ? '100%' : 'auto' }}>
          <span style={{ position: 'absolute', left: '14px', top: '11px', color: '#94a3b8', fontSize:'16px' }}>🔍</span>
          <input 
            type="text" placeholder="Başlığa göre ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', width: isMobile ? '100%' : '260px', fontSize: '14px', backgroundColor: '#f8fafc', color: '#334155' }}
          />
        </div>
      </div>

      {/* 3. ANKET LİSTESİ */}
      <div style={gridStyle}>
        {filteredSurveys.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px', backgroundColor: '#fff', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>📭</div>
            <h3 style={{ color: '#334155', marginBottom: '8px', fontSize:'18px' }}>Henüz bir anket yok</h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>Hemen yeni bir tane oluşturarak başlayabilirsin.</p>
            <Link to="/create" style={{ textDecoration: 'none', padding:'12px 24px', backgroundColor:'#2563eb', color:'white', borderRadius:'10px', fontWeight:'600' }}>Oluştur</Link>
          </div>
        ) : (
          filteredSurveys.map((survey) => {
            const isAgent = survey.mode === 'agent';
            const accentColor = isAgent ? '#8b5cf6' : '#2563eb'; 
            const softBg = isAgent ? '#f5f3ff' : '#eff6ff';      
            const labelText = isAgent ? "AI AJANI" : "KLASİK ANKET";

            return (
              <div 
                key={survey.id} 
                style={{ ...surveyCardStyle, borderLeft: `6px solid ${accentColor}` }}
              >
                <Link to={`/results/${survey.id}`} style={{textDecoration:'none', color:'inherit', display:'block', flex:1}}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                       <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: softBg, color: accentColor, fontSize: '12px', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{labelText}</div>
                       <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', backgroundColor:'#f8fafc', padding:'6px 10px', borderRadius:'20px' }}>{formatDate(survey.createdAt)}</span>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0', lineHeight: '1.4' }}>{survey.title}</h3>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: isMobile ? '240px' : '280px' }}>{survey.description || "Açıklama girilmemiş..."}</p>
                  </div>
                </Link>

                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '700', color: '#475569' }}>
                    <span style={{fontSize:'18px'}}>👥</span> {survey.responses ? survey.responses.length : 0} <span style={{fontWeight:'400', color:'#94a3b8'}}>Yanıt</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => navigate(`/edit/${survey.id}`)} title="Düzenle" style={{ ...actionBtnStyle, backgroundColor:'#fff7ed', color:'#ea580c' }}> <EditIcon /> </button>
                    <button onClick={(e) => handleShare(survey.id, e)} title="Linki Kopyala" style={actionBtnStyle}> <CopyIcon /> </button>
                    <button onClick={(e) => handleDelete(survey.id, e)} title="Sil" style={{ ...actionBtnStyle, color: '#ef4444', backgroundColor: '#fef2f2' }}> <TrashIcon /> </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// Sabit Stiller
const statsCardStyle = { flex: 1, minWidth: '220px', backgroundColor: '#fff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'center' };
const surveyCardStyle = { backgroundColor: '#fff', borderRadius: '20px', padding: '24px', borderTop: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px', position: 'relative', overflow: 'hidden' };
const actionBtnStyle = { width: '40px', height: '40px', borderRadius: '10px', border: 'none', backgroundColor: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s', fontSize: '16px' };

export default Home;