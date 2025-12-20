import React from 'react';
// import { Link } from 'react-router-dom'; // Router kurulunca aktif edeceğiz

const Navbar = () => {
  return (
    <nav style={{
      backgroundColor: '#fff',
      padding: '10px 20px',
      borderBottom: '1px solid #dadce0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      
      {/* Sol Taraf: Logo ve İsim */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Google Forms ikonu yerine basit bir ikon */}
        <div style={{ width: '24px', height: '24px', backgroundColor: '#673ab7', borderRadius: '4px' }}></div>
        <span style={{ fontSize: '18px', color: '#202124' }}>Adsız Form</span>
      </div>

      {/* Orta Taraf: Linkler (Şimdilik işlevsiz buton gibi) */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <button style={{ background: 'none', border: 'none', fontWeight: 'bold', color: '#673ab7', borderBottom: '3px solid #673ab7', paddingBottom: '14px' }}>Sorular</button>
        <button style={{ background: 'none', border: 'none', color: '#5f6368' }}>Yanıtlar</button>
      </div>

      {/* Sağ Taraf: Önizleme ve Gönder */}
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <button className="icon-btn" title="Önizleme">👁️</button>
        <button className="btn-primary">Gönder</button>
      </div>

    </nav>
  );
};

export default Navbar;