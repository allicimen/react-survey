import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSurveys, deleteSurvey } from '../services/dbService';

const Home = () => {
  const [surveys, setSurveys] = useState([]);

  // Sayfa açılınca kayıtlı anketleri getir
  useEffect(() => {
    setSurveys(getSurveys());
  }, []);

  // Anket silme işlemi
  const handleDelete = (id) => {
    if (window.confirm("Bu anketi silmek istediğine emin misin?")) {
      deleteSurvey(id);
      setSurveys(getSurveys()); // Listeyi yenile
    }
  };

  return (
    <div className="container">
      {/* Üst Başlık ve Yeni Oluştur Butonu */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Anketlerim</h2>
        <Link to="/create" className="btn-primary" style={{ textDecoration: 'none' }}>
          + Yeni Anket
        </Link>
      </div>

      {/* Anket Listesi */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {surveys.length === 0 ? (
          <p>Henüz hiç anket oluşturmadınız.</p>
        ) : (
          surveys.map((survey) => (
            <div key={survey.id} className="form-card" style={{ padding: '20px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
              
              <div>
                <h3 style={{ marginBottom: '5px' }}>{survey.title || "Adsız Anket"}</h3>
                <p style={{ color: '#666', fontSize: '12px' }}>{survey.questions.length} Soru</p>
                {/* Kaç kişinin cevapladığını gösterelim */}
                <p style={{ color: '#666', fontSize: '12px', marginTop:'5px' }}>
                  {survey.responses ? survey.responses.length : 0} Yanıt
                </p>
              </div>
              
              {/* BUTONLARIN OLDUĞU KISIM */}
              <div style={{ marginTop: '20px', display: 'flex', gap: '15px', alignItems: 'center', borderTop:'1px solid #eee', paddingTop:'15px' }}>
                
                {/* 1. Doldur Butonu */}
                <Link to={`/survey/${survey.id}`} style={{ color: '#673ab7', fontWeight: 'bold', textDecoration: 'none', fontSize:'13px' }}>
                  Doldur 📝
                </Link>

                {/* 2. Sonuçlar Butonu (YENİ EKLENEN) */}
                <Link to={`/results/${survey.id}`} style={{ color: '#1a73e8', fontWeight: 'bold', textDecoration: 'none', fontSize:'13px' }}>
                  Sonuçlar 📊
                </Link>

                {/* 3. Sil Butonu (En sağa itildi) */}
                <button 
                  onClick={() => handleDelete(survey.id)} 
                  style={{ color: '#d93025', border: 'none', background: 'none', cursor: 'pointer', marginLeft:'auto', fontSize:'13px' }}
                >
                  Sil 🗑️
                </button>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;