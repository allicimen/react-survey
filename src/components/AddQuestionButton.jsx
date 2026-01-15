import React, { useState } from 'react';

// Props:
// onClick: Tıklanınca yeni soru ekleyecek
const AddQuestionButton = ({ onClick }) => {
  // Hover durumunu takip etmek için state (modern görünüm için)
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div title="Soru Ekle">
      <button 
        onClick={onClick} 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',     // Biraz büyüttük
            height: '44px',
            border: '1px solid #e2e8f0',
            borderRadius: '50%', 
            backgroundColor: isHovered ? '#f8fafc' : '#fff', // Üzerine gelince hafif gri
            boxShadow: isHovered ? '0 4px 6px -1px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.1)', // Üzerine gelince gölge artar
            cursor: 'pointer', // <-- İSTEDİĞİN ÖZELLİK: EL İŞARETİ
            transition: 'all 0.2s ease', // Yumuşak geçiş
            outline: 'none'
        }}
      >
        {/* Artı (+) işareti */}
        <span style={{ 
          fontSize: '26px', 
          color: isHovered ? '#2563eb' : '#64748b', // Üzerine gelince mavi olsun
          fontWeight: '400',
          lineHeight: '1',
          marginBottom: '2px' // Görsel olarak tam ortalamak için
        }}>
          +
        </span>
      </button>
    </div>
  );
};

export default AddQuestionButton;