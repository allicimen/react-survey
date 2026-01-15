import React from 'react';

const SurveyImage = ({ element, onUpdate, onDelete }) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <strong style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🖼️ Görsel Alanı
        </strong>
        <button 
          onClick={() => onDelete(element.id)}
          style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#94a3b8' }}
        >
          Sil ✕
        </button>
      </div>

      {/* URL Girişi */}
      <input 
        type="text" 
        placeholder="Görsel bağlantısını (https://...) buraya yapıştırın" 
        value={element.text}
        onChange={(e) => onUpdate(element.id, { ...element, text: e.target.value })}
        style={{
          width: '100%', padding: '10px', borderRadius: '8px',
          border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box'
        }}
      />

      {/* Önizleme Alanı */}
      {element.text && (
        <div style={{ marginTop: '16px', textAlign: 'center', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
          <img 
            src={element.text} 
            alt="Önizleme" 
            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            onError={(e) => { e.target.style.display = 'none'; alert("Resim yüklenemedi, linki kontrol et!"); }}
          />
        </div>
      )}
    </div>
  );
};

export default SurveyImage;