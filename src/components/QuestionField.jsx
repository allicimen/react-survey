import React from 'react';
import QuestionTypeSelector from './QuestionTypeSelector';

// Props:
// question: Sorunun tüm verisi (id, text, type, options vb.)
// onUpdate: Soru güncellendiğinde (başlık veya tip değişince) çalışır
// onDelete: Silme butonuna basılınca çalışır
const QuestionField = ({ question, onUpdate, onDelete }) => {

  // Soru metni değişince çalışır
  const handleTextChange = (e) => {
    onUpdate(question.id, { ...question, text: e.target.value });
  };

  // Soru tipi değişince çalışır
  const handleTypeChange = (newType) => {
    onUpdate(question.id, { ...question, type: newType });
  };

  // Çoktan seçmeli ise yeni şık ekleme (Basit versiyon)
  const addOption = () => {
    const newOptions = [...(question.options || []), "Yeni Seçenek"];
    onUpdate(question.id, { ...question, options: newOptions });
  };

  // Şık metnini güncelleme
  const handleOptionChange = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    onUpdate(question.id, { ...question, options: newOptions });
  };

  return (
    <div className="form-card">
      {/* Üst Kısım: Soru Metni ve Tipi */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '20px' }}>
        {/* Soru Metni Girişi */}
        <input
          type="text"
          className="input-text"
          placeholder="Soru Başlığı"
          value={question.text}
          onChange={handleTextChange}
          style={{ flex: 1, backgroundColor: '#f8f9fa', padding: '15px' }} // Biraz öne çıksın
        />
        
        {/* Tip Seçici (Önceki adımda yaptığımız bileşen) */}
        <QuestionTypeSelector 
          selectedType={question.type} 
          onTypeChange={handleTypeChange} 
        />
      </div>

      {/* Orta Kısım: Cevap Alanı (Tipe göre değişir) */}
      <div className="question-body">
        
        {/* Eğer Metin ise sadece görüntü (disabled input) koyuyoruz */}
        {(question.type === 'text' || question.type === 'paragraph') && (
          <input disabled type="text" placeholder="Kısa yanıt metni" className="input-text" style={{ borderBottom: '1px dotted #ccc' }} />
        )}

        {/* Eğer Çoktan Seçmeli ise Şıklar Listelenir */}
        {(question.type === 'multipleChoice' || question.type === 'checkbox') && (
          <div>
            {question.options && question.options.map((opt, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
                {/* Radyo butonu ikonu (süs) */}
                <div style={{ width: '18px', height: '18px', border: '2px solid #ccc', borderRadius: '50%' }}></div>
                
                {/* Şık Metni */}
                <input 
                  type="text" 
                  value={opt} 
                  className="input-text"
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  style={{ fontSize: '14px' }}
                />
              </div>
            ))}
            
            {/* Şık Ekle Butonu */}
            <button 
              onClick={addOption}
              style={{ color: '#1a73e8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', marginTop: '5px' }}
            >
              + Seçenek ekle
            </button>
          </div>
        )}
      </div>

      {/* Alt Kısım: Butonlar (Sil, Zorunlu) */}
      <div className="question-footer">
        {/* Silme Butonu (Çöp Kutusu) */}
        <button className="icon-btn" onClick={() => onDelete(question.id)} title="Sil">
          🗑️
        </button>

        <div style={{ borderLeft: '1px solid #ccc', height: '20px', margin: '0 10px' }}></div>

        {/* Zorunlu Alan Anahtarı (Görsel Süs) */}
        <div className="toggle-switch">
          <span>Gerekli</span>
          <input type="checkbox" /> {/* İleride işlevselleşecek */}
        </div>
      </div>
    </div>
  );
};

export default QuestionField;