import React from 'react';

/**
 * QuestionTypeSelector Bileşeni
 * Soru tipini seçmek için kullanılan buton grubudur.
 * İkon içermez, sadece metin tabanlıdır.
 */
const QuestionTypeSelector = ({ selectedType, onTypeChange }) => {
  // Mobil kontrolü
  const isMobile = window.innerWidth < 768;

  // Seçenekler (İkonlar kaldırıldı)
  const types = [
    { id: 'text', label: 'Kısa Yanıt' },
    { id: 'paragraph', label: 'Uzun Yanıt' },
    { id: 'multipleChoice', label: 'Tekli Seçim' },
    { id: 'checkbox', label: 'Çoklu Seçim' }
  ];

  // Konteyner Stili: Mobilde 2 sütunlu grid, masaüstünde yan yana esnek dizilim
  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '8px',
    width: '100%',
    marginTop: isMobile ? '10px' : '0'
  };

  return (
    <div className="question-type-selector" style={containerStyle}>
      {types.map((type) => (
        <button
          key={type.id}
          type="button"
          onClick={() => onTypeChange(type.id)}
          style={{
            padding: isMobile ? '12px 4px' : '10px 12px',
            borderRadius: '8px',
            border: selectedType === type.id ? '2px solid #2563eb' : '1px solid #dadce0',
            backgroundColor: selectedType === type.id ? '#eff6ff' : '#f8f9fa',
            color: selectedType === type.id ? '#2563eb' : '#3c4043',
            cursor: 'pointer',
            fontSize: isMobile ? '12px' : '13px',
            fontWeight: '600',
            textAlign: 'center',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '44px', // Dokunma alanı için uygun yükseklik
            boxSizing: 'border-box'
          }}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
};

export default QuestionTypeSelector;