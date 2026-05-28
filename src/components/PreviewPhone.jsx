import React from 'react';
import { Signal, Battery } from 'lucide-react';

const PreviewPhone = ({ title, description, questions, mode }) => {
  return (
    <div className="phone-container">
      <div className="phone-frame">
        <div className="phone-screen">
          <div className="phone-header">
            <div className="notch"></div>
            <div className="status-bar">
              <span>9:41</span>
              <div className="status-icons" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <Signal size={12} />
                <Battery size={12} />
              </div>
            </div>
          </div>

          <div className="preview-content">
            <div className="preview-survey-header">
              <h3>{title || 'Anket Başlığı'}</h3>
              <p>{description || 'Anket açıklaması burada görünecek...'}</p>
            </div>

            <div className="preview-questions">
              {mode === 'agent' ? (
                <div className="agent-preview-chat">
                  <div className="chat-bubble bot">Merhaba! Size birkaç soru sormak istiyorum.</div>
                  <div className="chat-bubble user">Tabii, dinliyorum.</div>
                  <div className="chat-bubble bot active">AI Ajanı belirlediğiniz talimatlara göre burada kullanıcıyla konuşacak...</div>
                </div>
              ) : (
                questions.length > 0 ? (
                  questions.map((q, index) => (
                    <div key={index} className="preview-q-card">
                      <div className="preview-q-text">{q.text || 'Soru metni...'}</div>
                      {q.type === 'multipleChoice' && (
                        <div className="preview-options">
                          {q.options?.map((opt, i) => (
                            <div key={i} className="preview-option">{opt}</div>
                          ))}
                        </div>
                      )}
                      {q.type === 'text' && <div className="preview-input-placeholder">Cevabınız...</div>}
                    </div>
                  ))
                ) : (
                  <div className="empty-preview">Sorular ekledikçe burada görünecek.</div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .phone-container {
          position: sticky;
          top: 100px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          perspective: 1000px;
        }

        .phone-frame {
          width: 280px;
          height: 580px;
          background: #111;
          border-radius: 40px;
          padding: 10px;
          box-shadow: 0 50px 100px -20px rgba(0,0,0,0.25), 0 30px 60px -30px rgba(0,0,0,0.3);
          border: 4px solid #333;
        }

        .phone-screen {
          width: 100%;
          height: 100%;
          background: white;
          border-radius: 32px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .phone-header { height: 40px; background: white; padding: 0 1.5rem; }
        .notch { 
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 120px; height: 20px; background: #111; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;
        }

        .status-bar { 
          display: flex; justify-content: space-between; align-items: flex-end; height: 100%; 
          font-size: 10px; font-weight: 700; color: #111; padding-bottom: 4px;
        }

        .preview-content { flex: 1; overflow-y: auto; padding: 1.5rem 1rem; }
        
        .preview-survey-header h3 { font-size: 1.1rem; margin: 0 0 0.5rem 0; color: #111; word-break: break-word; }
        .preview-survey-header p { font-size: 0.75rem; color: #666; margin-bottom: 1.5rem; word-break: break-word; }

        .preview-q-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.75rem; margin-bottom: 0.75rem; overflow: hidden; }
        .preview-q-text { font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem; word-break: break-word; white-space: pre-wrap; }
        .preview-option { padding: 0.4rem; background: white; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.7rem; margin-bottom: 0.3rem; word-break: break-word; }
        .preview-input-placeholder { padding: 0.4rem; border-bottom: 1px solid #e2e8f0; font-size: 0.7rem; color: #999; }

        .agent-preview-chat { display: flex; flex-direction: column; gap: 0.75rem; }
        .chat-bubble { padding: 0.6rem 0.8rem; border-radius: 12px; font-size: 0.75rem; max-width: 85%; line-height: 1.4; }
        .chat-bubble.bot { background: #f1f5f9; align-self: flex-start; color: #334155; border-bottom-left-radius: 2px; }
        .chat-bubble.bot.active { background: #e0e7ff; color: #4338ca; border: 1px dotted #6366f1; }
        .chat-bubble.user { background: #6366f1; align-self: flex-end; color: white; border-bottom-right-radius: 2px; }

        .empty-preview { text-align: center; color: #94a3b8; font-size: 0.75rem; margin-top: 4rem; font-style: italic; }
      `}</style>
    </div>
  );
};

export default PreviewPhone;
