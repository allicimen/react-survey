import React from 'react';

// Props Açıklaması:
// element: O anki başlık verisi (id, text, type)
// onUpdate: Yazı değişince üst bileşene (CreateSurvey) haber veren fonksiyon
// onDelete: Silme butonuna basınca çalışacak fonksiyon
const SurveyHeader = ({ element, onUpdate, onDelete }) => {
  return (
    <div style={{
      backgroundColor: 'transparent', // Başlık olduğu için beyaz kart yapmadık, şeffaf olsun
      padding: '24px 0',
      marginBottom: '12px',
      borderBottom: '2px dashed #cbd5e1', // Kesik çizgi ile ayırdık
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }}>
      {/* Tt İkonu */}
      <div style={{ 
        fontSize: '24px', fontWeight: 'bold', color: '#64748b', 
        userSelect: 'none' 
      }}>
        Tt
      </div>

      {/* Başlık Inputu */}
      <input
        type="text"
        value={element.text}
        onChange={(e) => onUpdate(element.id, { ...element, text: e.target.value })}
        placeholder="Bölüm Başlığı Yazın..."
        style={{
          flex: 1,
          fontSize: '28px', // Büyük font
          fontWeight: '800',
          color: '#1e293b',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontFamily: 'inherit'
        }}
      />

      {/* Silme Butonu */}
      <button 
        onClick={() => onDelete(element.id)}
        style={{
          background: 'white', border: '1px solid #e2e8f0', cursor: 'pointer',
          borderRadius: '50%', width: '36px', height: '36px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#ef4444', transition: '0.2s'
        }}
        title="Başlığı Sil"
      >
        🗑️
      </button>
    </div>
  );
};

export default SurveyHeader;