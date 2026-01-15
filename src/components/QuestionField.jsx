import React from 'react';
import QuestionTypeSelector from './QuestionTypeSelector';

// --- STİL OBJESİ ---
const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    border: '1px solid #e2e8f0',
    transition: 'transform 0.2s',
    position: 'relative' // Silme butonu için
  },
  header: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start',
    marginBottom: '24px'
  },
  questionInput: {
    flex: 1,
    padding: '12px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    border: 'none',
    borderBottom: '2px solid #e2e8f0', // Varsayılan gri çizgi
    outline: 'none',
    backgroundColor: 'transparent',
    transition: 'border-color 0.3s',
    fontFamily: 'inherit'
  },
  answerPreview: {
    padding: '12px 16px',
    backgroundColor: '#f8fafc',
    border: '1px dashed #cbd5e1',
    borderRadius: '8px',
    color: '#94a3b8',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box'
  },
  footer: {
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '12px'
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '8px',
    borderRadius: '50%',
    transition: 'background 0.2s',
    color: '#64748b'
  }
};

const QuestionField = ({ question, onUpdate, onDelete }) => {

  // Soru metni değişimi
  const handleTextChange = (e) => {
    onUpdate(question.id, { ...question, text: e.target.value });
  };

  // Soru tipi değişimi
  const handleTypeChange = (newType) => {
    onUpdate(question.id, { ...question, type: newType });
  };

  // Seçenek ekleme
  const addOption = () => {
    const newOptions = [...(question.options || []), `Seçenek ${question.options.length + 1}`];
    onUpdate(question.id, { ...question, options: newOptions });
  };

  // Seçenek güncelleme
  const handleOptionChange = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    onUpdate(question.id, { ...question, options: newOptions });
  };

  return (
    <div style={styles.card}>
      
      {/* ÜST KISIM: Soru ve Tip Seçici */}
      <div style={styles.header}>
        <input
          type="text"
          placeholder="Soru metnini buraya yazın..."
          value={question.text}
          onChange={handleTextChange}
          style={styles.questionInput}
          // Focus olunca alt çizgi mavi olsun (Inline Event)
          onFocus={(e) => e.target.style.borderBottomColor = '#2563eb'}
          onBlur={(e) => e.target.style.borderBottomColor = '#e2e8f0'}
        />
        
        {/* Tip Seçici Bileşeni */}
        <div style={{ width: '200px' }}>
          <QuestionTypeSelector 
            selectedType={question.type} 
            onTypeChange={handleTypeChange} 
          />
        </div>
      </div>

      {/* ORTA KISIM: Cevap Önizleme */}
      <div className="question-body">
        
        {/* Metin Tipleri */}
        {(question.type === 'text' || question.type === 'paragraph') && (
          <div style={styles.answerPreview}>
             {question.type === 'text' ? 'Kısa yanıt metni (Kullanıcı buraya yazacak)' : 'Uzun paragraf yanıtı...'}
          </div>
        )}

        {/* Çoktan Seçmeli */}
        {(question.type === 'multipleChoice' || question.type === 'checkbox') && (
          <div>
            {question.options && question.options.map((opt, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', gap: '12px' }}>
                {/* İkon */}
                <div style={{ 
                  width: '18px', height: '18px', 
                  border: `2px solid #cbd5e1`, 
                  borderRadius: question.type === 'multipleChoice' ? '50%' : '4px' 
                }}></div>
                
                {/* Şık Input */}
                <input 
                  type="text" 
                  value={opt} 
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  style={{
                    border: 'none', borderBottom: '1px solid transparent',
                    fontSize: '14px', padding: '4px 0', flex: 1, outline:'none',
                    color: '#334155'
                  }}
                  onFocus={(e) => e.target.style.borderBottomColor = '#cbd5e1'}
                  onBlur={(e) => e.target.style.borderBottomColor = 'transparent'}
                />
              </div>
            ))}
            
            {/* Şık Ekle Butonu */}
            <button 
              onClick={addOption}
              style={{ 
                color: '#2563eb', background: 'none', border: 'none', 
                cursor: 'pointer', fontSize: '13px', fontWeight:'600', 
                padding: '6px 0', display:'flex', alignItems:'center', gap:'6px' 
              }}
            >
              <span>➕</span> Seçenek ekle
            </button>
          </div>
        )}
      </div>

      {/* ALT KISIM: Aksiyonlar */}
      <div style={styles.footer}>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginRight: 'auto' }}>
           {question.type === 'multipleChoice' ? 'Tek seçim' : question.type === 'checkbox' ? 'Çoklu seçim' : 'Metin girişi'}
        </div>

        {/* Sil Butonu */}
        <button 
          style={styles.deleteBtn} 
          onClick={() => onDelete(question.id)} 
          title="Soruyu Sil"
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fee2e2'; e.currentTarget.style.color = '#ef4444'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
        >
          🗑️
        </button>

        <div style={{ width:'1px', height:'20px', backgroundColor:'#e2e8f0' }}></div>

        {/* Gerekli Toggle (Görsel) */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#475569' }}>
          <span>Gerekli</span>
          <div style={{ width: '36px', height: '20px', backgroundColor: '#e2e8f0', borderRadius: '10px', position: 'relative' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px', boxShadow:'0 1px 2px rgba(0,0,0,0.2)' }}></div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default QuestionField;