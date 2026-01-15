import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Bileşenler
import QuestionField from '../components/QuestionField';
import AddQuestionButton from '../components/AddQuestionButton';
import SurveyHeader from '../components/SurveyHeader';
import SurveyImage from '../components/SurveyImage';
import SurveyVideo from '../components/SurveyVideo';

// Mantık Hook'u
import useCreateSurvey from '../hooks/useCreateSurvey';

// İkonlar
const ClassicModeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="64" height="64" style={{color: '#2563eb'}}>
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
    <path d="M9 17h6" />
    <path d="M9 13h6" />
    <path d="M9 9h6" />
  </svg>
);

const AgentModeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="64" height="64" style={{color: '#7c3aed'}}>
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
  </svg>
);

const ModernBackButton = ({ onClick, text, isMobile }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px', padding: isMobile ? '8px 12px' : '10px 18px',
        backgroundColor: isHovered ? '#f1f5f9' : 'white',
        border: '1px solid #e2e8f0', borderRadius: '30px', cursor: 'pointer',
        transition: 'all 0.2s', color: isHovered ? '#1e293b' : '#64748b',
        fontWeight: '600', fontSize: isMobile ? '13px' : '14px',
        boxShadow: isHovered ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
      }}
    >
      <span style={{ fontSize: '18px', lineHeight: '1' }}>←</span>
      {!isMobile && <span>{text}</span>}
    </button>
  );
};

const CreateSurvey = () => {
  const navigate = useNavigate();

  // MOBİL KONTROLÜ (Sihirli Kısım)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // YENİ STATE: Prompt Input için
  const [aiPromptInput, setAiPromptInput] = useState("");

  const {
    step, selectMode, goBack, isEditMode,
    title, setTitle, description, setDescription,
    isLoading, questions, mode,
    systemPrompt, setSystemPrompt,
    addQuestion, addSpecialElement, updateQuestion, deleteQuestion,
    handleSave, handleAIGenerate
  } = useCreateSurvey();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // --- ADIM 1: SEÇİM EKRANI ---
  if (step === 1) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '900px', display: 'flex', justifyContent: 'flex-start', marginBottom: '40px' }}>
             <ModernBackButton onClick={() => navigate('/dashboard')} text="Panele Dön" isMobile={isMobile} />
        </div>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: '800', color: '#1e293b', marginBottom: '16px' }}>Nasıl bir anket hazırlamak istersin?</h1>
            <p style={{ fontSize: isMobile ? '16px' : '18px', color: '#64748b' }}>Aşağıdaki yöntemlerden birini seçerek başla.</p>
        </div>
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '900px', width: '100%' }}>
            <div onClick={() => selectMode('classic')} style={{...selectionCardStyle, minWidth: isMobile ? '100%' : '300px'}}>
                <div style={{ marginBottom: '24px', padding:'20px', background:'#eff6ff', borderRadius:'50%', display:'inline-flex' }}> <ClassicModeIcon /> </div>
                <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', color: '#1e293b' }}>Klasik Liste</h3>
                <p style={{ color: '#64748b', lineHeight: '1.6' }}>Soruları, şıkları ve sıralamayı siz belirlersiniz.</p>
                <div style={{ marginTop: '20px', color: '#2563eb', fontWeight: '600' }}>Seç & Devam Et →</div>
            </div>
            <div onClick={() => selectMode('agent')} style={{...selectionCardStyle, minWidth: isMobile ? '100%' : '300px'}}>
                <div style={{ marginBottom: '24px', padding:'20px', background:'#f5f3ff', borderRadius:'50%', display:'inline-flex' }}> <AgentModeIcon /> </div>
                <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', color: '#1e293b' }}>AI Ajanı</h3>
                <p style={{ color: '#64748b', lineHeight: '1.6' }}>Yapay zeka kullanıcıyla sohbet ederek bilgiyi toplar.</p>
                <div style={{ marginTop: '20px', color: '#7c3aed', fontWeight: '600' }}>Seç & Devam Et →</div>
            </div>
        </div>
      </div>
    );
  }

  // --- ADIM 2: EDİTÖR ---
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: isMobile ? '120px' : '100px', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ÜST BAR */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(255,255,255,0.9)', borderBottom: '1px solid #e2e8f0', padding: '16px 0', backdropFilter:'blur(5px)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '0 15px' : '0 20px' }}>
          <div style={{display:'flex', gap:'15px', alignItems:'center', flex: 1}}>
             <ModernBackButton onClick={goBack} text="Geri" isMobile={isMobile} />
             <div style={{borderLeft:'1px solid #e2e8f0', paddingLeft: isMobile ? '10px' : '20px', overflow: 'hidden'}}>
                {!isMobile && (
                    <div style={{fontSize:'12px', fontWeight:'bold', color: mode === 'agent' ? '#7c3aed' : '#2563eb', textTransform:'uppercase'}}>
                        {mode === 'classic' ? 'KLASİK LİSTE EDİTÖRÜ' : 'AI AJAN EDİTÖRÜ'}
                    </div>
                )}
                <div style={{fontWeight:'700', color:'#1e293b', fontSize:'15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {title || "Başlıksız..."}
                </div>
             </div>
          </div>
          <button onClick={handleSave} style={{padding: isMobile ? '10px 16px' : '12px 28px', background: mode === 'agent' ? '#7c3aed' : '#2563eb', color:'white', border:'none', borderRadius:'10px', cursor:'pointer', fontWeight:'600', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: isMobile ? '13px' : '14px', marginLeft: '10px', whiteSpace: 'nowrap'}}>
            {isEditMode ? "Güncelle" : (isMobile ? "Yayınla" : "Yayına Al")}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: isMobile ? '15px auto' : '30px auto', padding: isMobile ? '0 10px' : '0 24px' }}>
        
        {/* Ortak Başlık Alanı */}
        <div style={{ backgroundColor: 'white', padding: isMobile ? '20px' : '40px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Anket Başlığı" style={{ width: '100%', fontSize: isMobile ? '24px' : '32px', fontWeight: '800', border: 'none', outline: 'none', marginBottom:'10px', color:'#1e293b' }} />
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Anket açıklaması (isteğe bağlı)" style={{ width: '100%', fontSize: '16px', border: 'none', outline: 'none', color:'#64748b' }} />
        </div>

        {mode === 'classic' && (
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '40px', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, width: '100%' }}>
                    
                    {/* YENİ AI PROMPT ALANI - MOBİL UYUMLU */}
                    <div style={{marginBottom:'24px', padding:'20px', background:'white', borderRadius:'12px', border:'1px solid #e2e8f0', boxShadow:'0 2px 4px rgba(0,0,0,0.02)'}}>
                        <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px', color:'#2563eb', fontWeight:'600'}}>
                            <span>✨ Yapay Zeka ile Üret</span>
                        </div>
                        <div style={{display:'flex', flexDirection: isMobile ? 'column' : 'row', gap:'10px'}}>
                            <input 
                                type="text" 
                                placeholder="Örn: Müşteri memnuniyeti için 5 soru hazırla..." 
                                value={aiPromptInput}
                                onChange={(e) => setAiPromptInput(e.target.value)}
                                style={{ flex: 1, padding:'12px', borderRadius:'8px', border:'1px solid #cbd5e1', outline:'none', width: '100%' }}
                                onKeyPress={(e) => e.key === 'Enter' && handleAIGenerate(aiPromptInput)}
                            />
                            <button 
                                onClick={() => handleAIGenerate(aiPromptInput)} 
                                disabled={isLoading} 
                                style={{background:'#eff6ff', color:'#2563eb', border:'1px solid #bfdbfe', padding:'12px 20px', borderRadius:'8px', cursor:'pointer', fontWeight:'600', width: isMobile ? '100%' : 'auto'}}
                            >
                                {isLoading ? "Üretiliyor..." : "Üret"}
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {questions.map((q) => {
                            if (q.type === 'header') return <SurveyHeader key={q.id} element={q} onUpdate={updateQuestion} onDelete={deleteQuestion} />;
                            if (q.type === 'image') return <SurveyImage key={q.id} element={q} onUpdate={updateQuestion} onDelete={deleteQuestion} />;
                            if (q.type === 'video') return <SurveyVideo key={q.id} element={q} onUpdate={updateQuestion} onDelete={deleteQuestion} />;
                            return <QuestionField key={q.id} question={q} onUpdate={updateQuestion} onDelete={deleteQuestion} />;
                        })}
                    </div>
                </div>

                {/* SİHİRLİ DOKUNUŞ: Mobilde Alt Menü, Masaüstünde Sağ Menü */}
                {isMobile ? (
                    <div style={{
                        position: 'fixed', bottom: 0, left: 0, right: 0, 
                        backgroundColor: 'white', borderTop: '1px solid #e2e8f0', 
                        padding: '10px 20px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', 
                        zIndex: 1000, boxShadow: '0 -4px 10px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ transform: 'scale(0.9)' }} title="Soru Ekle"><AddQuestionButton onClick={addQuestion} /></div>
                        <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }}></div>
                        <button onClick={() => addSpecialElement('image')} title="Resim Ekle" style={sideButtonStyle}>🖼️</button>
                        <button onClick={() => addSpecialElement('video')} title="Video Ekle" style={sideButtonStyle}>🎥</button>
                        <button onClick={() => addSpecialElement('header')} title="Metin Ekle" style={sideButtonStyle}>Tt</button>
                    </div>
                ) : (
                    <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div title="Soru Ekle"><AddQuestionButton onClick={addQuestion} /></div>
                        <button onClick={() => addSpecialElement('image')} title="Resim Ekle" style={sideButtonStyle}>🖼️</button>
                        <button onClick={() => addSpecialElement('video')} title="Video Ekle" style={sideButtonStyle}>🎥</button>
                        <button onClick={() => addSpecialElement('header')} title="Metin Ekle" style={sideButtonStyle}>Tt</button>
                    </div>
                )}
            </div>
        )}

        {mode === 'agent' && (
            <div style={{ backgroundColor: 'white', padding: isMobile ? '20px' : '40px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign:'center' }}>
                <div style={{fontSize: isMobile ? '40px' : '60px', marginBottom:'20px'}}>💬</div>
                <h2 style={{color:'#1e293b', marginBottom:'10px'}}>Yapay Zekayı Görevlendir</h2>
                <p style={{color:'#64748b', marginBottom:'30px', maxWidth:'600px', margin:'0 auto'}}>Kullanıcıyla nasıl konuşması gerektiğini yaz.</p>
                <textarea 
                    value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="Örnek: Sen bir ürün yöneticisisin. Kullanıcıya ürünümüz hakkındaki deneyimlerini sor..."
                    style={{ width:'100%', height:'200px', padding:'20px', borderRadius:'12px', border:'2px solid #e2e8f0', fontSize:'16px', outline:'none' }}
                />
            </div>
        )}
      </div>
    </div>
  );
};

const selectionCardStyle = {
    flex: '1', minWidth: '300px', backgroundColor: 'white', padding: '40px', borderRadius: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '2px solid #e2e8f0', cursor: 'pointer', 
    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
};
const sideButtonStyle = {
    width:'44px', height:'44px', borderRadius:'50%', border:'1px solid #e2e8f0', background:'white', cursor:'pointer', fontSize:'18px', display:'flex', alignItems:'center', justifyContent:'center', color:'#64748b'
};

export default CreateSurvey;