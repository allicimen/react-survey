import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSurveyResults } from '../services/dbService';
import { analyzeSurveyResults } from '../services/aiService';
import AIInsights from '../components/AIInsights';
import ShareModal from '../components/ShareModal';
import SurveyCharts from '../components/SurveyCharts';
import {
  Link2,
  Sparkles,
  BarChart2,
  Bot,
  ClipboardList,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  User,
  Clock,
  ArrowLeft,
  Users,
  CalendarDays
} from 'lucide-react';

const Results = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [activeTab, setActiveTab] = useState('summary'); 
  const [aiData, setAiData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [expandedChats, setExpandedChats] = useState({});

  const toggleChat = (idx) => {
    setExpandedChats(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchSurvey = async () => {
      try {
        const data = await getSurveyResults(id);
        setSurvey(data);
      } catch (error) {
        console.error("Hata:", error);
      }
    };
    fetchSurvey();
  }, [id]);

  const handleAIAnalysis = async () => {
    if (!survey || !survey.responses || isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const results = await analyzeSurveyResults(survey.title, survey.responses);
      setAiData(results);
    } catch (error) {
      console.error("AI Analiz Hatası:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!survey) return <div className="loading">Sonuçlar yükleniyor...</div>;

  const totalResponses = survey.responses?.length || 0;

  return (
    <div className="results-page">
      <header className="results-header">
        <div className="header-left">
          <Link to="/dashboard" className="btn-back">
            <ArrowLeft size={16} /> Panele Dön
          </Link>
          <div className="header-info" style={{ marginTop: '1rem' }}>
            <h1>{survey.title}</h1>
            <p><Users size={15} style={{display:'inline', marginRight:'0.3rem', verticalAlign:'middle'}} />{totalResponses} Yanıt Toplandı</p>
          </div>
        </div>
        <div className="header-right">
          <button className="btn btn-secondary" onClick={() => setIsShareOpen(true)}>
            <Link2 size={16} /> Paylaş
          </button>
          <button className="btn-ai-magic" onClick={handleAIAnalysis} disabled={isAnalyzing || totalResponses === 0}>
            <Sparkles size={16} /> {isAnalyzing ? "Analiz Ediliyor..." : "AI ile Analiz Et"}
          </button>
        </div>
      </header>

      <div className="results-tabs">
        <button className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>Özet</button>
        <button className={`tab-btn ${activeTab === 'individual' ? 'active' : ''}`} onClick={() => setActiveTab('individual')}>Yanıtlar</button>
      </div>

      <div className="results-content">
        {activeTab === 'summary' ? (
          <div className="summary-view">
            {/* Üst Kısım: İstatistikler ve AI */}
            <div className="summary-top-grid">
              <div className="card basic-stats">
                <h3>Genel İstatistikler</h3>
                <div className="stat-row">
                  <span className="stat-label"><Users size={14} style={{display:'inline', marginRight:'0.3rem', verticalAlign:'middle'}} /> Toplam Katılım</span>
                  <span className="stat-val">{totalResponses}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label"><CalendarDays size={14} style={{display:'inline', marginRight:'0.3rem', verticalAlign:'middle'}} /> Oluşturma Tarihi</span>
                  <span className="stat-val">{new Date(survey.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">{survey.mode === 'agent' ? <><Bot size={14} style={{display:'inline', marginRight:'0.3rem', verticalAlign:'middle'}} /> Tür</> : <><ClipboardList size={14} style={{display:'inline', marginRight:'0.3rem', verticalAlign:'middle'}} /> Tür</>}</span>
                  <span className="stat-val">{survey.mode === 'agent' ? 'AI Ajan' : 'Klasik'}</span>
                </div>
              </div>

              <div className="card ai-insight-card">
                {aiData ? <AIInsights data={aiData} onRetry={handleAIAnalysis} /> : (
                  <div className="no-ai">
                    <h3>Yapay Zeka Analizi</h3>
                    <p>Tüm yanıtları yapay zekaya okutarak gizli trendleri ve tavsiyeleri bulabilirsiniz.</p>
                    <button className="btn-ai-magic" onClick={handleAIAnalysis} disabled={isAnalyzing || totalResponses === 0}>
                      <Sparkles size={16} /> {isAnalyzing ? "Analiz Ediliyor..." : "Sonuçları AI ile Analiz Et"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Alt Kısım: Grafikler */}
            <div className="charts-section">
              <h2 className="section-title"><BarChart2 size={22} style={{display:'inline', marginRight: '0.5rem', verticalAlign: 'middle'}} /> Soru Grafikleri</h2>
              <SurveyCharts survey={survey} responses={survey.responses} />
            </div>
          </div>
        ) : (
          <div className="individual-view">
            {survey.responses?.length === 0 ? (
              <div className="no-responses card">Henüz yanıt toplanmamış.</div>
            ) : (
              survey.responses?.map((resp, idx) => {
                const answersObj = resp.answers || {};
                const isAgentResponse = answersObj.type === 'agent_chat';
                
                // Tarih Tespiti
                const submittedDate = resp.submittedAt || answersObj.submittedAt;
                const formattedDate = submittedDate 
                  ? new Date(submittedDate).toLocaleString('tr-TR') 
                  : 'Tarih Belirtilmemiş';

                return (
                  <div key={idx} className="card response-card" style={{ marginBottom: '1.5rem' }}>
                    <div className="response-card-header">
                      <h4>Yanıt #{idx + 1}</h4>
                      {isAgentResponse ? (
                        <span className="badge-agent-tag"><Bot size={12} /> AI Ajan Sohbeti</span>
                      ) : (
                        <span className="badge-classic-tag"><ClipboardList size={12} /> Klasik Form</span>
                      )}
                    </div>
                    
                    <div className="response-data">
                      {isAgentResponse ? (
                        // AI Ajanı Yanıtları
                        <div className="agent-response-area">
                          <div className="extracted-fields">
                            <h5><BarChart2 size={14} style={{display:'inline', marginRight:'0.35rem', verticalAlign:'middle'}} /> Çıkarılan Veriler</h5>
                            {Object.entries(answersObj.data || {}).length === 0 ? (
                              <p className="no-data">Yapay zeka bu sohbetten yapılandırılmış veri çıkaramadı.</p>
                            ) : (
                              Object.entries(answersObj.data || {}).map(([key, val]) => (
                                <div key={key} className="resp-item">
                                  <strong>{key}:</strong> <span>{typeof val === 'object' ? JSON.stringify(val) : String(val)}</span>
                                </div>
                              ))
                            )}
                          </div>
                          
                          {answersObj.fullHistory && answersObj.fullHistory.length > 0 && (
                            <div className="chat-transcript-area">
                              <button 
                                className="btn-toggle-chat" 
                                onClick={() => toggleChat(idx)}
                              >
                                <MessageCircle size={15} />
                                {expandedChats[idx] ? (
                                  <><span>Sohbet Geçmişini Gizle</span><ChevronUp size={15} /></>
                                ) : (
                                  <><span>Sohbet Geçmişini Göster</span><ChevronDown size={15} /></>
                                )}
                              </button>
                              
                              {expandedChats[idx] && (
                                <div className="chat-transcript-timeline">
                                  {answersObj.fullHistory.map((msg, mIdx) => (
                                    <div key={mIdx} className={`transcript-bubble ${msg.role || msg.sender}`}>
                                      <span className="bubble-role">
                                        {msg.role === 'user'
                                          ? <><User size={13} /> Katılımcı</>
                                          : <><Bot size={13} /> AI Ajanı</>
                                        }
                                      </span>
                                      <p className="bubble-text">{msg.content || msg.text}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        // Klasik Form Yanıtları
                        <div className="classic-response-area">
                          {Object.entries(answersObj).length > 0 && !answersObj.type ? (
                            Object.entries(answersObj).map(([qId, val]) => {
                              if (qId === 'submittedAt' || qId === 'type') return null;
                              const question = survey.questions?.find(q => q.id === qId);
                              const questionText = question ? question.text : qId;
                              return (
                                <div key={qId} className="resp-item">
                                  <strong>{questionText}:</strong> <span>{Array.isArray(val) ? val.join(', ') : String(val)}</span>
                                </div>
                              );
                            })
                          ) : (
                            // Geriye dönük uyumluluk
                            Object.entries(resp).map(([key, val]) => {
                              if (key === 'surveyId' || key === 'submittedAt' || key === 'answers') return null;
                              const question = survey.questions?.find(q => q.id === key);
                              const questionText = question ? question.text : key;
                              return (
                                <div key={key} className="resp-item">
                                  <strong>{questionText}:</strong> <span>{Array.isArray(val) ? val.join(', ') : String(val)}</span>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="resp-date"><Clock size={13} style={{display:'inline', marginRight:'0.3rem', verticalAlign:'middle'}} /> {formattedDate}</div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <ShareModal 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        surveyId={id} 
        surveyTitle={survey.title} 
      />

      <style jsx="true">{`
        .results-page { max-width: 1000px; margin: 0 auto; padding: 2rem; }
        .results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .results-tabs { display: flex; gap: 1rem; border-bottom: 1px solid var(--border); margin-bottom: 2rem; }
        .tab-btn { padding: 1rem 2rem; background: none; border: none; cursor: pointer; font-weight: 600; color: var(--text-muted); transition: var(--transition); }
        .tab-btn.active { border-bottom: 3px solid var(--primary); color: var(--primary); }
        .tab-btn:hover:not(.active) { color: var(--text-main); }

        .response-card {
          border-left: 4px solid var(--primary);
          transition: var(--transition);
        }
        .response-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 0.75rem;
        }
        .response-card-header h4 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 800;
        }
        .badge-agent-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #f5f3ff;
          color: #7c3aed;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.3rem 0.75rem;
          border-radius: 12px;
          border: 1px solid rgba(124, 58, 237, 0.2);
        }
        .badge-classic-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #f0fdf4;
          color: #16a34a;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.3rem 0.75rem;
          border-radius: 12px;
          border: 1px solid rgba(22, 163, 74, 0.2);
        }
        
        .resp-item {
          margin-bottom: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .resp-item strong {
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 700;
        }
        .resp-item span {
          color: var(--text-main);
          font-size: 0.95rem;
          font-weight: 500;
        }
        .resp-date {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 1.25rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        /* AI Agent Responses */
        .extracted-fields h5 {
          margin: 0 0 1rem 0;
          color: var(--primary);
          font-size: 0.9rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .no-data {
          color: var(--text-muted);
          font-style: italic;
          font-size: 0.9rem;
        }
        
        .chat-transcript-area {
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px dashed var(--border);
        }
        .btn-toggle-chat {
          background: var(--bg-main);
          border: 1px solid var(--border);
          color: var(--text-main);
          padding: 0.5rem 1.25rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-toggle-chat:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--primary-light);
        }
        
        .chat-transcript-timeline {
          margin-top: 1.25rem;
          padding: 1.25rem;
          background: var(--bg-main);
          border-radius: 16px;
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 400px;
          overflow-y: auto;
        }
        .transcript-bubble {
          padding: 0.85rem 1.25rem;
          border-radius: 14px;
          max-width: 85%;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .transcript-bubble.assistant, .transcript-bubble.bot {
          align-self: flex-start;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-bottom-left-radius: 4px;
        }
        .transcript-bubble.user {
          align-self: flex-end;
          background: var(--primary);
          color: white;
          border-bottom-right-radius: 4px;
        }
        .bubble-role {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          opacity: 0.8;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .transcript-bubble.assistant .bubble-role, .transcript-bubble.bot .bubble-role {
          color: var(--primary);
        }
        .transcript-bubble.user .bubble-role {
          color: rgba(255,255,255,0.9);
        }
        .bubble-text {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.4;
          white-space: pre-wrap;
        }
        .no-responses {
          text-align: center;
          padding: 3rem;
          color: var(--text-muted);
          font-size: 1.1rem;
          font-weight: 600;
        }
        .summary-top-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 1.5rem; margin-bottom: 2rem; }
        .basic-stats h3 { font-size: 1.2rem; margin-bottom: 1.5rem; border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; }
        .stat-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-size: 1rem; }
        .stat-label { color: var(--text-muted); font-weight: 600; display: flex; align-items: center; gap: 0.3rem; }
        .stat-val { font-weight: 800; color: var(--primary); }
        .ai-insight-card { border-left: 4px solid #8b5cf6; background: linear-gradient(to right, rgba(250, 245, 255, 0.5), var(--bg-card)); }
        .no-ai h3 { color: #7c3aed; margin-bottom: 0.5rem; }
        .no-ai p { color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.5; }
        .charts-section { margin-top: 3rem; border-top: 1px dashed var(--border); padding-top: 2rem; }
        .section-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem; color: var(--text-main); display: flex; align-items: center; gap: 0.5rem; }
        @media (max-width: 768px) {
          .summary-top-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Results;