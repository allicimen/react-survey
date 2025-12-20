import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSurvey, addResponseToSurvey } from '../services/dbService';

const FillSurvey = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  
  // Kullanıcının cevaplarını tutan nesne { soruId: "Verilen Cevap" }
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const data = getSurvey(id);
    setSurvey(data);
  }, [id]);

  if (!survey) return <div className="container">Yükleniyor...</div>;

  // Cevap değişince çalışır
  const handleChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Çoklu seçim (Checkbox) için özel mantık
  const handleCheckboxChange = (questionId, option) => {
    const currentAnswers = answers[questionId] || [];
    let newAnswers;
    
    if (currentAnswers.includes(option)) {
      newAnswers = currentAnswers.filter(item => item !== option); // Çıkar
    } else {
      newAnswers = [...currentAnswers, option]; // Ekle
    }
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: newAnswers
    }));
  };

  const handleSubmit = () => {
    // 1. Zorunlu alan kontrolü (İsteğe bağlı eklenebilir)
    
    // 2. Cevapları Kaydet
    addResponseToSurvey(survey.id, answers);
    
    alert("Cevaplarınız başarıyla kaydedildi! Teşekkürler.");
    navigate('/'); // Anasayfaya dön
  };

  return (
    <div className="container">
      <div className="form-card header-card">
        <h1>{survey.title}</h1>
        <p>{survey.description}</p>
      </div>

      {survey.questions.map((q) => (
        <div key={q.id} className="form-card">
          <h3 style={{ marginBottom: '15px' }}>{q.text}</h3>
          
          {/* Kısa Cevap */}
          {(q.type === 'text' || q.type === 'paragraph') && (
            <input 
              type="text" 
              className="input-text" 
              placeholder="Yanıtınız" 
              onChange={(e) => handleChange(q.id, e.target.value)}
            />
          )}

          {/* Çoktan Seçmeli (Radio) */}
          {q.type === 'multipleChoice' && q.options.map((opt, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <label style={{display:'flex', alignItems:'center', cursor:'pointer'}}>
                <input 
                  type="radio" 
                  name={q.id} 
                  value={opt}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  style={{ marginRight: '10px' }} 
                />
                {opt}
              </label>
            </div>
          ))}

          {/* Onay Kutuları (Checkbox) */}
          {q.type === 'checkbox' && q.options.map((opt, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <label style={{display:'flex', alignItems:'center', cursor:'pointer'}}>
                <input 
                  type="checkbox" 
                  name={q.id} 
                  onChange={() => handleCheckboxChange(q.id, opt)}
                  style={{ marginRight: '10px' }} 
                />
                {opt}
              </label>
            </div>
          ))}
        </div>
      ))}

      <div style={{ marginBottom: '50px' }}>
        <button className="btn-primary" onClick={handleSubmit}>
          GÖNDER
        </button>
      </div>
    </div>
  );
};

export default FillSurvey;