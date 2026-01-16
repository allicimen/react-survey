import React from 'react';
import QuestionTypeSelector from './QuestionTypeSelector';

const QuestionField = ({ question, onUpdate, onDelete }) => {
  const isMobile = window.innerWidth < 768;

  // --- YARDIMCI FONKSİYONLAR ---
  const handleTextChange = (e) => {
    onUpdate(question.id, { ...question, text: e.target.value });
  };

  const handleTypeChange = (newType) => {
    onUpdate(question.id, { ...question, type: newType });
  };

  const addOption = () => {
    const newOptions = [...(question.options || []), `Seçenek ${question.options.length + 1}`];
    onUpdate(question.id, { ...question, options: newOptions });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...(question.options || [])];
    newOptions[index] = value;
    onUpdate(question.id, { ...question, options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = question.options.filter((_, i) => i !== index);
    onUpdate(question.id, { ...question, options: newOptions });
  };

  // --- STİLLER ---
  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: isMobile ? '20px' : '32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0',
    marginBottom: '24px',
    width: '100%',
    boxSizing: 'border-box'
  };

  const questionInputStyle = {
    flex: 1,
    padding: '12px 0',
    fontSize: isMobile ? '16px' : '18px',
    fontWeight: '600',
    color: '#1e293b',
    border: 'none',
    borderBottom: '2px solid #e2e8f0',
    outline: 'none',
    width: '100%',
    marginBottom: isMobile ? '15px' : '0'
  };

  return (
    <div style={cardStyle}>
      
      {/* 1. KRİTER: MOBİLDE SEÇİCİ EN ÜSTTE */}
      {isMobile && (
        <div style={{ marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
          <label style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>
            Soru Tipi Seçin
          </label>
          <QuestionTypeSelector 
            selectedType={question.type} 
            onTypeChange={handleTypeChange} 
          />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, width: '100%' }}>
          <input
            type="text"
            placeholder="Soru metnini buraya yazın..."
            value={question.text || ""}
            onChange={handleTextChange}
            style={questionInputStyle}
            onFocus={(e) => e.target.style.borderBottomColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderBottomColor = '#e2e8f0'}
          />

          {/* CEVAP ALANI (Şıklar ve Önizlemeler) */}
          <div style={{ marginTop: '25px' }}>
            {(question.type === 'text' || question.type === 'paragraph') && (
              <div style={{ padding: '12px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', color: '#94a3b8', fontSize: '14px' }}>
                {question.type === 'text' ? 'Kullanıcı kısa bir yanıt verecek...' : 'Kullanıcı uzun bir paragraf yanıtı verecek...'}
              </div>
            )}

            {(question.type === 'multipleChoice' || question.type === 'checkbox') && (
              <div>
                {question.options && question.options.map((opt, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', gap: '10px' }}>
                    <div style={{ width: '18px', height: '18px', border: '2px solid #cbd5e1', borderRadius: question.type === 'multipleChoice' ? '50%' : '4px' }}></div>
                    <input 
                      type="text" 
                      value={opt} 
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      style={{ border: 'none', borderBottom: '1px solid #f1f5f9', fontSize: '14px', flex: 1, padding: '4px 0', outline: 'none' }}
                    />
                    <button onClick={() => removeOption(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
                  </div>
                ))}
                <button 
                  onClick={addOption}
                  style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', padding: '10px 0' }}
                >
                  + Seçenek ekle
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2. KRİTER: MASAÜSTÜNDE SEÇİCİ SAĞDA */}
        {!isMobile && (
          <div style={{ minWidth: '220px' }}>
            <QuestionTypeSelector 
              selectedType={question.type} 
              onTypeChange={handleTypeChange} 
            />
          </div>
        )}
      </div>

      {/* ALT KISIM (Silme ve Diğer Ayarlar) */}
      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
        <button 
          onClick={() => onDelete(question.id)} 
          style={{ color: '#ef4444', background: '#fef2f2', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
        >
          Soruyu Sil
        </button>
      </div>
    </div>
  );
};

export default QuestionField;