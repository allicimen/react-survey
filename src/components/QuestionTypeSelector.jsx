import React from 'react';

// Props:
// selectedType: Şu anki seçili tip (örn: "text")
// onTypeChange: Kullanıcı değiştirdiğinde çalışacak fonksiyon
const QuestionTypeSelector = ({ selectedType, onTypeChange }) => {
  return (
    <div className="question-type-selector">
      {/* Basit bir HTML select elemanı kullanıyoruz */}
      <select
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
        style={{
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #dadce0',
            backgroundColor: '#f8f9fa',
            cursor: 'pointer'
        }}
      >
        <option value="text">Kısa Cevap</option>
        <option value="paragraph">Paragraf</option>
        <option value="multipleChoice">Çoktan Seçmeli</option>
        <option value="checkbox">Onay Kutuları</option>
      </select>
    </div>
  );
};

export default QuestionTypeSelector;