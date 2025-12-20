import React from 'react';

const SurveyPreview = () => {
  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Önizleme Modu</h1>
      <p>Burada anketin son hali görüntülenecek.</p>
      <div className="form-card">
        <h3>Örnek Soru Başlığı</h3>
        <input type="text" className="input-text" disabled placeholder="Cevap alanı..." />
      </div>
      <p style={{ color: 'gray', fontSize: '12px' }}>(Geliştirme aşamasında burası FillSurvey ile birleşecek)</p>
    </div>
  );
};

export default SurveyPreview;