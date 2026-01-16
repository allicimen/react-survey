// src/pages/FillSurvey.jsx
import React from 'react';
import useFillSurvey from '../hooks/useFillSurvey';
import ChatInterface from '../components/ChatInterface'; // Yeni oluşturduğumuz bileşen

const FillSurvey = () => {
  const {
    survey,
    isFinished,
    // Klasik Props
    answers, 
    handleAnswerChange, 
    handleCheckboxChange, 
    submitClassicSurvey,
    // Ajan Props
    messages, 
    inputText, 
    setInputText, 
    isTyping, 
    handleAgentSend
  } = useFillSurvey();

  // Yüklenme Durumu
  if (!survey) {
    return (
      <div style={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        fontFamily: "'Inter', sans-serif",
        color: '#64748b'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ marginBottom: '10px' }}>⏳</div>
          <p>Anket hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // ORTAK BİTİŞ EKRANI (Her iki mod için de geçerli)
  // ==========================================================
  if (isFinished) {
    return (
      <div style={{ 
        maxWidth: '500px', 
        margin: '100px auto', 
        padding: '40px', 
        textAlign: 'center', 
        backgroundColor: '#ffffff', 
        borderRadius: '24px', 
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✨</div>
        <h2 style={{ color: '#1e293b', fontSize: '28px', marginBottom: '12px', fontWeight: '800' }}>
          Harika!
        </h2>
        <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
          Katılımınız için teşekkür ederiz. Yanıtlarınız güvenle kaydedildi ve analiz edilmek üzere iletildi.
        </p>
        <button 
          onClick={() => window.location.href = '/dashboard'} 
          style={{ 
            width: '100%',
            padding: '16px', 
            background: '#7c3aed', 
            color: 'white', 
            border: 'none', 
            borderRadius: '14px', 
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '16px',
            transition: 'transform 0.2s'
          }}
        >
          Panosuna Dön
        </button>
      </div>
    );
  }

  // ==========================================================
  // MOD SEÇİMİ VE RENDER MANTIĞI
  // ==========================================================

  // DURUM A: AI AJAN MODU
  if (survey.mode === 'agent') {
    return (
      <ChatInterface 
        messages={messages}
        inputText={inputText}
        setInputText={setInputText}
        isTyping={isTyping}
        handleAgentSend={handleAgentSend}
        surveyTitle={survey.title}
      />
    );
  }

  // DURUM B: KLASİK LİSTE MODU
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '40px 20px', 
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      
      {/* Başlık Kartı */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '32px', 
        borderRadius: '20px', 
        borderTop: '10px solid #2563eb', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', 
        marginBottom: '30px' 
      }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 12px 0', color: '#1e293b' }}>
            {survey.title}
          </h1>
          {survey.description && (
            <p style={{ fontSize: '16px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
              {survey.description}
            </p>
          )}
      </div>

      {/* Sorular Listesi */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {survey.questions && survey.questions.map((q, index) => {
            
            // Özel Elementler
            if (q.type === 'header') return <h2 key={q.id} style={{ margin: '20px 0 10px 5px', color: '#334155', fontSize: '22px' }}>{q.text}</h2>;
            if (q.type === 'image') return <img key={q.id} src={q.text} alt="Anket Görseli" style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '10px' }} />;
            if (q.type === 'video') return null;

            return (
                <div key={q.id} style={{ 
                  backgroundColor: 'white', 
                  padding: '28px', 
                  borderRadius: '16px', 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                    <div style={{ fontSize: '17px', fontWeight: '700', marginBottom: '20px', color: '#1e293b', display: 'flex', gap: '8px' }}>
                        <span style={{ color: '#2563eb' }}>{index + 1}.</span>
                        {q.text}
                    </div>

                    {/* Metin Yanıtı */}
                    {(q.type === 'text' || q.type === 'paragraph') && (
                        <input 
                            type="text" 
                            placeholder="Buraya yazın..." 
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            style={{ 
                              width: '100%', 
                              padding: '14px', 
                              border: '1px solid #cbd5e1', 
                              borderRadius: '10px', 
                              outline: 'none', 
                              boxSizing: 'border-box',
                              fontSize: '15px'
                            }}
                        />
                    )}

                    {/* Çoktan Seçmeli */}
                    {q.type === 'multipleChoice' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {q.options.map((opt, i) => (
                          <label key={i} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            padding: '12px 16px', 
                            borderRadius: '10px',
                            border: '1px solid #f1f5f9',
                            backgroundColor: '#f8fafc',
                            cursor: 'pointer' 
                          }}>
                              <input 
                                  type="radio" 
                                  name={`q_${q.id}`} 
                                  value={opt} 
                                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                  style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
                              />
                              <span style={{ color: '#475569', fontSize: '15px' }}>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Onay Kutuları */}
                    {q.type === 'checkbox' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {q.options.map((opt, i) => (
                          <label key={i} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            padding: '12px 16px', 
                            borderRadius: '10px',
                            border: '1px solid #f1f5f9',
                            backgroundColor: '#f8fafc',
                            cursor: 'pointer' 
                          }}>
                              <input 
                                  type="checkbox" 
                                  value={opt} 
                                  onChange={() => handleCheckboxChange(q.id, opt)}
                                  style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
                              />
                              <span style={{ color: '#475569', fontSize: '15px' }}>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}
                </div>
            );
        })}
      </div>

      <button 
          onClick={submitClassicSurvey}
          style={{ 
            width: '100%',
            backgroundColor: '#2563eb', 
            color: 'white', 
            border: 'none', 
            padding: '18px', 
            fontSize: '16px', 
            fontWeight: '700', 
            borderRadius: '12px', 
            cursor: 'pointer', 
            marginTop: '30px',
            boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
          }}
      >
          Yanıtları Gönder
      </button>
    </div>
  );
};

export default FillSurvey;