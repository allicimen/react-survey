// src/pages/FillSurvey.jsx
import React from 'react';
import useFillSurvey from '../hooks/useFillSurvey';

const FillSurvey = () => {
  const {
    survey,
    isFinished,
    // Klasik Props
    answers, handleAnswerChange, handleCheckboxChange, submitClassicSurvey,
    // Ajan Props
    messages, inputText, setInputText, isTyping, handleAgentSend, messagesEndRef
  } = useFillSurvey();

  if (!survey) return <div style={{textAlign:'center', marginTop:'50px'}}>Anket Yükleniyor...</div>;

  // --- ORTAK BİTİŞ EKRANI ---
  if (isFinished) {
    return (
      <div style={{ maxWidth: '600px', margin: '50px auto', padding: '40px', textAlign: 'center', backgroundColor: '#ecfdf5', borderRadius: '16px', border: '1px solid #a7f3d0' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ color: '#065f46', margin: '0 0 10px 0' }}>Teşekkürler!</h2>
        <p style={{ color: '#047857' }}>Yanıtlarınız başarıyla kaydedildi.</p>
        <button onClick={() => window.location.href = '/dashboard'} style={{ marginTop: '20px', padding: '10px 20px', background: '#059669', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Panele Dön</button>
      </div>
    );
  }

  // ==========================================================
  // SENARYO 1: KLASİK LİSTE GÖRÜNÜMÜ (FORM)
  // ==========================================================
  if (survey.mode === 'classic') {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: "'Inter', sans-serif" }}>
        
        {/* Başlık Kartı */}
        <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', borderTop: '8px solid #2563eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '32px', margin: '0 0 10px 0', color: '#1e293b' }}>{survey.title}</h1>
            <p style={{ fontSize: '16px', color: '#64748b', lineHeight: '1.5' }}>{survey.description}</p>
        </div>

        {/* Sorular Listesi */}
        {survey.questions && survey.questions.map((q, index) => {
            
            // Özel Elementler (Header, Image, Video)
            if (q.type === 'header') return <h2 key={q.id} style={{margin:'30px 0 15px 0', color:'#334155'}}>{q.text}</h2>;
            if (q.type === 'image') return <img key={q.id} src={q.text} alt="Survey Img" style={{maxWidth:'100%', borderRadius:'8px', marginBottom:'20px'}} />;
            if (q.type === 'video') return null; // Video şimdilik pas geçildi

            return (
                <div key={q.id} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1e293b' }}>
                        {index + 1}. {q.text}
                    </div>

                    {/* Metin Cevap */}
                    {(q.type === 'text' || q.type === 'paragraph') && (
                        <input 
                            type="text" 
                            placeholder="Yanıtınız..." 
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}
                        />
                    )}

                    {/* Çoktan Seçmeli (Radio) */}
                    {q.type === 'multipleChoice' && q.options.map((opt, i) => (
                        <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', cursor: 'pointer' }}>
                            <input 
                                type="radio" 
                                name={`q_${q.id}`} 
                                value={opt} 
                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            />
                            <span style={{color: '#475569'}}>{opt}</span>
                        </label>
                    ))}

                    {/* Onay Kutuları (Checkbox) */}
                    {q.type === 'checkbox' && q.options.map((opt, i) => (
                        <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', cursor: 'pointer' }}>
                            <input 
                                type="checkbox" 
                                value={opt} 
                                onChange={() => handleCheckboxChange(q.id, opt)}
                            />
                            <span style={{color: '#475569'}}>{opt}</span>
                        </label>
                    ))}
                </div>
            );
        })}

        <button 
            onClick={submitClassicSurvey}
            style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '16px 32px', fontSize: '16px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', marginTop: '20px' }}
        >
            Anketi Gönder
        </button>
      </div>
    );
  }

  // ==========================================================
  // SENARYO 2: AI AJAN GÖRÜNÜMÜ (SOHBET)
  // ==========================================================
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f3f4f6' }}>
      
      {/* ÜST BİLGİ */}
      <div style={{ padding: '16px', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>
         <h2 style={{ margin: 0, fontSize: '18px', color: '#111827' }}>{survey.title}</h2>
         <span style={{fontSize:'12px', color:'#7c3aed', fontWeight:'600'}}>AI Asistan Modu</span>
      </div>

      {/* SOHBET ALANI */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              maxWidth: '80%', padding: '14px 20px', 
              borderRadius: '18px',
              borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '18px',
              borderBottomRightRadius: msg.sender === 'user' ? '4px' : '18px',
              backgroundColor: msg.sender === 'bot' ? '#ffffff' : '#7c3aed', 
              color: msg.sender === 'bot' ? '#1f2937' : '#ffffff',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              lineHeight: '1.5'
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && <div style={{padding:'10px', color:'#6b7280', fontStyle:'italic'}}>Ajan yazıyor...</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT ALANI */}
      <div style={{ padding: '20px', backgroundColor: '#fff', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '10px' }}>
        <input
            type="text"
            placeholder="Mesajınızı yazın..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAgentSend()}
            disabled={isTyping} 
            autoFocus
            style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #e5e7eb', outline: 'none', backgroundColor: '#f9fafb' }}
        />
        <button 
            onClick={handleAgentSend} 
            disabled={isTyping}
            style={{ padding: '0 24px', backgroundColor: '#7c3aed', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}
        >
            Gönder
        </button>
      </div>
    </div>
  );
};

export default FillSurvey;