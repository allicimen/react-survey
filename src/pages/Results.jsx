import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSurvey } from '../services/dbService';

const Results = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);

  useEffect(() => {
    setSurvey(getSurvey(id));
  }, [id]);

  if (!survey) return <div className="container">Yükleniyor...</div>;

  const totalResponses = survey.responses ? survey.responses.length : 0;

  // -- İSTATİSTİK HESAPLAMA MOTORU --
  // Her soru için cevapları sayar. Örn: "Evet": 5, "Hayır": 3
  const getStats = (question) => {
    if (!survey.responses) return {};

    const counts = {};
    
    survey.responses.forEach(response => {
      const answer = response[question.id]; // Bu soruya verilen cevap
      
      if (answer) {
        // Eğer cevap bir dizi ise (Checkbox), içindekileri tek tek say
        if (Array.isArray(answer)) {
          answer.forEach(subAns => {
            counts[subAns] = (counts[subAns] || 0) + 1;
          });
        } else {
          // Tekil cevap (Radio veya Text)
          counts[answer] = (counts[answer] || 0) + 1;
        }
      }
    });
    return counts;
  };

  return (
    <div className="container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
         <h2>📊 Anket Sonuçları</h2>
         <Link to="/" style={{color:'#673ab7'}}>Anasayfaya Dön</Link>
      </div>

      <div className="form-card header-card">
        <h1>{survey.title}</h1>
        <p style={{fontSize:'16px', color:'#555'}}>
          Toplam Katılım: <strong>{totalResponses} Kişi</strong>
        </p>
      </div>

      {totalResponses === 0 ? (
        <div className="form-card" style={{padding:'40px', textAlign:'center'}}>
          <p>Henüz kimse bu anketi doldurmadı.</p>
          <Link to={`/survey/${survey.id}`} className="btn-primary">Anketi Doldur</Link>
        </div>
      ) : (
        survey.questions.map((q) => {
          const stats = getStats(q);
          const totalAnswersForThisQ = Object.values(stats).reduce((a, b) => a + b, 0);

          return (
            <div key={q.id} className="form-card">
              <h3 style={{marginBottom:'15px'}}>{q.text}</h3>
              
              {/* Metin tipi sorular için son 5 cevabı listele */}
              {(q.type === 'text' || q.type === 'paragraph') ? (
                <div style={{backgroundColor:'#f8f9fa', padding:'10px', borderRadius:'4px'}}>
                  <p style={{fontSize:'12px', color:'#666', marginBottom:'5px'}}>Son Yanıtlar:</p>
                  <ul style={{paddingLeft:'20px'}}>
                    {Object.keys(stats).slice(0, 5).map((ans, i) => (
                      <li key={i} style={{marginBottom:'5px'}}>{ans}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                /* Seçmeli sorular için Çubuk Grafik (Bar Chart) */
                <div>
                  {Object.entries(stats).map(([optionName, count], i) => {
                    // Yüzde hesabı
                    const percentage = Math.round((count / totalResponses) * 100);
                    
                    return (
                      <div key={i} style={{marginBottom:'15px'}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize:'14px', marginBottom:'5px'}}>
                          <span>{optionName}</span>
                          <span style={{fontWeight:'bold'}}>{count} kişi ({percentage}%)</span>
                        </div>
                        {/* Gri Arka Plan Çubuğu */}
                        <div style={{width:'100%', height:'10px', backgroundColor:'#eee', borderRadius:'5px', overflow:'hidden'}}>
                          {/* Renkli Doluluk Çubuğu */}
                          <div style={{
                            width: `${percentage}%`, 
                            height:'100%', 
                            backgroundColor: '#4285f4',
                            transition: 'width 1s ease-in-out'
                          }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Results;