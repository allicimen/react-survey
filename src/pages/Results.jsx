import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSurvey } from '../services/dbService';

// --- MODERN STİL BİLEŞENLERİ (CSS-in-JS) ---
const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: "'Inter', sans-serif",
    color: '#1e293b'
  },
  header: {
    marginBottom: '40px',
    textAlign: 'center'
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '8px'
  },
  subtitle: {
    color: '#64748b',
    fontSize: '16px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0',
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#2563eb',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '24px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #f1f5f9'
  },
  questionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '24px',
    borderLeft: '4px solid #2563eb',
    paddingLeft: '12px',
    color: '#334155'
  },
  progressBarContainer: {
    width: '100%',
    height: '12px',
    backgroundColor: '#f1f5f9',
    borderRadius: '6px',
    overflow: 'hidden',
    marginTop: '8px'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '6px',
    transition: 'width 1s ease-in-out',
    backgroundImage: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)'
  },
  textResponse: {
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    marginBottom: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '15px',
    lineHeight: '1.5',
    color: '#475569'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: 'white',
    borderRadius: '20px',
    border: '2px dashed #cbd5e1'
  }
};

const Results = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);

  useEffect(() => {
    // Sayfa açıldığında en tepeye git
    window.scrollTo(0, 0);

    // 👇 KRİTİK DEĞİŞİKLİK: Veriyi bekleyerek (Async) çekiyoruz
    const fetchSurvey = async () => {
      try {
        const data = await getSurvey(id);
        setSurvey(data);
      } catch (error) {
        console.error("Sonuçlar yüklenirken hata:", error);
      }
    };

    fetchSurvey();
  }, [id]);

  if (!survey) return <div style={{textAlign:'center', marginTop:'50px'}}>Veriler yükleniyor...</div>;

  const totalResponses = survey.responses ? survey.responses.length : 0;

  // -- İSTATİSTİK HESAPLAMA MOTORU --
  const getStats = (question) => {
    if (!survey.responses) return {};
    const counts = {};
    survey.responses.forEach(response => {
      const answer = response[question.id];
      if (answer) {
        if (Array.isArray(answer)) {
          answer.forEach(subAns => { counts[subAns] = (counts[subAns] || 0) + 1; });
        } else {
          counts[answer] = (counts[answer] || 0) + 1;
        }
      }
    });
    return counts;
  };

  return (
    <div style={styles.container}>
      
      {/* 1. ÜST BAŞLIK VE NAVİGASYON */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
         <Link to="/dashboard" style={{display:'flex', alignItems:'center', gap:'8px', textDecoration:'none', color:'#64748b', fontWeight:'500'}}>
            <span>←</span> Panele Dön
         </Link>
         <div style={{padding:'6px 12px', backgroundColor:'#eff6ff', color:'#2563eb', borderRadius:'20px', fontSize:'12px', fontWeight:'700'}}>
            {survey.mode === 'agent' ? 'AI ANALİZİ' : 'ANKET SONUÇLARI'}
         </div>
      </div>

      <div style={styles.header}>
        <h1 style={styles.title}>{survey.title}</h1>
        <p style={styles.subtitle}>{survey.description || "Bu anket için toplanan verilerin detaylı analizi."}</p>
      </div>

      {/* 2. ÖZET İSTATİSTİKLER (KARTLAR) */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{totalResponses}</div>
          <div style={styles.statLabel}>Toplam Katılımcı</div>
        </div>
        <div style={styles.statCard}>
          {/* Soru sayısı için kontrol eklendi: questions varsa uzunluğunu al yoksa 0 */}
          <div style={styles.statNumber}>{survey.questions ? survey.questions.length : 0}</div>
          <div style={styles.statLabel}>Soru Sayısı</div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statNumber, color: '#10b981'}}>Aktif</div>
          <div style={styles.statLabel}>Anket Durumu</div>
        </div>
      </div>

      {/* 3. SONUÇ LİSTESİ */}
      {totalResponses === 0 ? (
        <div style={styles.emptyState}>
          <div style={{fontSize:'48px', marginBottom:'16px'}}>📉</div>
          <h3 style={{color:'#334155', margin:'0 0 8px 0'}}>Henüz veri toplanmadı</h3>
          <p style={{color:'#94a3b8'}}>Anket bağlantısını paylaşarak ilk yanıtları almaya başlayın.</p>
        </div>
      ) : (
        // Eğer sorular yoksa (örn: Ajan modunda henüz soru oluşmadıysa) hata vermesin
        (survey.questions || []).map((q, index) => {
          const stats = getStats(q);

          // Sadece görselleştirmeye uygun tipler (Görsel, Video, Header hariç)
          if (['header', 'image', 'video'].includes(q.type)) return null;

          return (
            <div key={q.id} style={styles.questionCard}>
              <div style={styles.questionTitle}>
                <span style={{color:'#94a3b8', marginRight:'8px'}}>#{index + 1}</span>
                {q.text}
              </div>
              
              {/* --- DURUM A: METİN TİPİ SORULAR (LİSTE GÖRÜNÜMÜ) --- */}
              {(q.type === 'text' || q.type === 'paragraph') ? (
                <div style={{maxHeight:'300px', overflowY:'auto', paddingRight:'10px'}}>
                  {Object.keys(stats).length === 0 ? (
                    <div style={{color:'#94a3b8', fontStyle:'italic'}}>Bu soruya henüz yanıt verilmedi.</div>
                  ) : (
                    Object.keys(stats).map((ans, i) => (
                      <div key={i} style={styles.textResponse}>
                        {ans}
                      </div>
                    ))
                  )}
                </div>
              ) : (
                /* --- DURUM B: SEÇMELİ SORULAR (İLERLEME ÇUBUĞU) --- */
                <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                  {Object.entries(stats).map(([optionName, count], i) => {
                    const percentage = Math.round((count / totalResponses) * 100);
                    
                    return (
                      <div key={i}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize:'14px', marginBottom:'6px', color:'#475569', fontWeight:'500'}}>
                          <span>{optionName}</span>
                          <span style={{color:'#1e293b', fontWeight:'700'}}>{count} kişi (%{percentage})</span>
                        </div>
                        
                        <div style={styles.progressBarContainer}>
                          <div style={{
                            ...styles.progressBarFill, 
                            width: `${percentage}%`,
                            backgroundColor: i % 2 === 0 ? '#3b82f6' : '#6366f1' // Çift/tek renk değişimi
                          }}></div>
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(stats).length === 0 && <div style={{color:'#94a3b8'}}>Henüz seçim yapılmadı.</div>}
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