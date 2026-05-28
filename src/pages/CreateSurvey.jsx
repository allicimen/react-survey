import React from 'react';
import useCreateSurvey from '../hooks/useCreateSurvey';
import QuestionField from '../components/QuestionField';
import QuestionTypeSelector from '../components/QuestionTypeSelector';
import PreviewPhone from '../components/PreviewPhone';
import { PERSONA_TEMPLATES } from '../data/personaTemplates';
import { ArrowLeft, ClipboardList, Bot, Sparkles, Loader2, Save, RefreshCw, Lightbulb, Check, User, ShoppingBag, BarChart3, Settings } from 'lucide-react';

const getPersonaIcon = (key) => {
  switch (key) {
    case 'hr': return <User size={16} />;
    case 'customer': return <ShoppingBag size={16} />;
    case 'researcher': return <BarChart3 size={16} />;
    case 'custom': return <Settings size={16} />;
    default: return <User size={16} />;
  }
};

const CreateSurvey = () => {
  const {
    step, selectMode, goBack, isEditMode,
    title, setTitle, description, setDescription,
    isLoading, questions, mode,
    systemPrompt, setSystemPrompt,
    activePersona, changePersona,
    addQuestion, updateQuestion, deleteQuestion,
    handleSave, handleAIGenerate
  } = useCreateSurvey();

  // --- ADIM 1: MOD SEÇİMİ (Sadece yeni ankette göster) ---
  if (step === 1) {
    return (
      <div className="mode-select-page">
        <div className="mode-select-inner">
          <h1>Yeni Anket Oluştur</h1>
          <p>Anketini nasıl oluşturmak istersin?</p>

          <div className="mode-cards">
            <div className="mode-card card" onClick={() => selectMode('classic')}>
              <div className="mode-icon"><ClipboardList size={40} strokeWidth={1.5} /></div>
              <h3>Klasik Anket</h3>
              <p>Soruları kendin ekle ve düzenle. Tam kontrol sende.</p>
              <button className="btn btn-primary">Klasik Başlat</button>
            </div>

            <div className="mode-card agent-mode card" onClick={() => selectMode('agent')}>
              <div className="mode-icon"><Bot size={40} strokeWidth={1.5} /></div>
              <h3>AI Ajan Anketi</h3>
              <p>Yapay zeka kullanıcıyla sohbet ederek veri toplar. Çok daha doğal!</p>
              <button className="btn btn-primary">AI ile Başlat</button>
            </div>
          </div>
        </div>

        <style jsx="true">{`
          .mode-select-page { display: flex; align-items: center; justify-content: center; min-height: 80vh; }
          .mode-select-inner { max-width: 750px; width: 100%; text-align: center; }
          .mode-select-inner h1 { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; }
          .mode-select-inner > p { color: var(--text-muted); margin-bottom: 3rem; }
          .mode-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        `}</style>
      </div>
    );
  }

  // --- ADIM 2: ANKET EDİTÖRÜ ---
  return (
    <div className="create-survey">
      <div className="editor-layout">
        <div className="editor-main">

          {/* Üst Bar */}
          <div className="create-header">
        <button onClick={goBack} className="btn-back">
          <ArrowLeft size={16} /> {isEditMode ? 'Panele Dön' : 'Geri'}
        </button>
        <div className="create-title-area">
          <input
            type="text"
            placeholder="Anket Başlığı"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="title-input"
          />
          <input
            type="text"
            placeholder="Açıklama (isteğe bağlı)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="desc-input"
          />
        </div>
        <button onClick={handleSave} className="btn btn-primary">
          <Save size={16} /> {isEditMode ? 'Güncelle' : 'Kaydet'}
        </button>
      </div>

      {/* AJAN MODU — Sistem Prompt */}
      {mode === 'agent' && (
        <div className="card agent-prompt-box">
          <div className="agent-badge"><Sparkles size={14} /> AI Ajan Modu</div>
          <h3>AI Ajanının Görevi ve Personası</h3>
          <p>Ajanın hangi rolde sohbet edeceğini seçin veya doğrudan kendi talimatlarınızı yazın.</p>
          
          <div className="persona-selector">
            {Object.entries(PERSONA_TEMPLATES).map(([key, template]) => (
              <button
                key={key}
                type="button"
                className={`persona-chip ${activePersona === key ? 'active' : ''}`}
                onClick={() => changePersona(key)}
              >
                <span className="persona-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>{getPersonaIcon(key)}</span>
                <span className="persona-name">{template.name}</span>
              </button>
            ))}
          </div>

          <div className="prompt-textarea-wrapper">
            <textarea
              value={systemPrompt}
              onChange={(e) => {
                setSystemPrompt(e.target.value);
                if (activePersona !== 'custom') {
                  changePersona('custom');
                }
              }}
              placeholder="AI Ajanınızın rolünü ve uymasını istediğiniz kuralları buraya yazın..."
              rows={8}
              className="system-prompt-textarea"
            />
          </div>
          <p className="hint" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
            <Lightbulb size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span>İpucu: Ajan konuşmayı tamamladığında konuşmayı sonlandırmak için arka planda otomatik olarak <code>[[FINISH]]</code> tetiklenir.</span>
          </p>
        </div>
      )}

      {/* KLASİK MOD — AI Üretim ve Sorular */}
      {mode === 'classic' && (
        <>
          {/* AI Üretim Alanı */}
          <div className="card ai-generate-box">
            <div className="ai-badge"><Sparkles size={14} /> AI ile Hızlı Başla</div>
            <div className="ai-generate-row">
              <input
                id="ai-prompt"
                type="text"
                placeholder="Konu yaz, AI soruları oluştursun... (örn: 'çalışan memnuniyeti')"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAIGenerate(e.target.value);
                }}
                className="ai-input"
              />
              <button
                onClick={() => {
                  const input = document.getElementById('ai-prompt');
                  handleAIGenerate(input.value);
                }}
                disabled={isLoading}
                className="btn btn-primary"
              >
                {isLoading
                  ? <><Loader2 size={16} className="spin" /> Üretiliyor...</>
                  : <><Sparkles size={16} /> Üret</>
                }
              </button>
            </div>
          </div>

          {/* Sorular Listesi */}
          <div className="questions-list">
            {questions.map((q) => (
              <QuestionField
                key={q.id}
                question={q}
                onUpdate={(id, updated) => updateQuestion(id, updated)}
                onDelete={(id) => deleteQuestion(id)}
              />
            ))}
          </div>
        </>
      )}

      {/* Alt Sabit Bar */}
      <div className="editor-footer">
        {mode === 'classic' && (
          <div className="add-question-section">
            <p>Yeni Soru Ekle:</p>
            <QuestionTypeSelector
              onTypeChange={(type) => addQuestion(type)}
              selectedType={null}
            />
          </div>
        )}
        <button onClick={handleSave} className="btn btn-primary save-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isLoading ? (
            <><Loader2 size={16} className="spin" /> Kaydediliyor...</>
          ) : isEditMode ? (
            <><Check size={16} /> Güncelle</>
          ) : (
            <><Save size={16} /> Kaydet</>
          )}
        </button>
      </div>

        </div>

        <div className="editor-preview-panel">
          <PreviewPhone
            title={title}
            description={description}
            questions={questions}
            mode={mode}
          />
        </div>
      </div>

      <style jsx="true">{`
        .create-survey { max-width: 1200px; margin: 0 auto; padding-bottom: 3rem; padding-top: 1rem; }

        .editor-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 2.5rem;
          align-items: start;
        }

        .editor-main {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-width: 0;
        }

        .editor-preview-panel {
          position: sticky;
          top: 2rem;
          display: flex;
          justify-content: center;
        }

        @media (max-width: 1024px) {
          .editor-layout {
            grid-template-columns: 1fr;
          }
          .editor-preview-panel {
            display: none;
          }
        }

        .create-header {
          display: flex; align-items: flex-start; gap: 1rem;
          margin-bottom: 2rem; padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
        }
        .create-title-area { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
        .title-input {
          font-size: 1.5rem; font-weight: 800; border: none; outline: none;
          background: transparent; color: var(--text-main); border-bottom: 2px solid var(--border);
          padding-bottom: 0.25rem; transition: var(--transition);
        }
        .title-input:focus { border-bottom-color: var(--primary); }
        .desc-input {
          font-size: 0.9rem; border: none; outline: none;
          background: transparent; color: var(--text-muted);
        }

        .agent-prompt-box { margin-bottom: 2rem; border-left: 4px solid #8b5cf6; }
        .agent-badge { display: inline-block; background: #f5f3ff; color: #7c3aed; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 800; margin-bottom: 1rem; }
        .agent-prompt-box h3 { margin: 0 0 0.5rem; }
        .agent-prompt-box p { color: var(--text-muted); margin-bottom: 1rem; font-size: 0.9rem; }
        
        .persona-selector {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .persona-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.2rem;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--bg-main);
          color: var(--text-main);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition);
        }
        .persona-chip:hover {
          border-color: #8b5cf6;
          background: #f5f3ff;
          color: #7c3aed;
        }
        .persona-chip.active {
          border-color: #8b5cf6;
          background: #8b5cf6;
          color: white;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
        }
        [data-theme='dark'] .persona-chip:hover {
          background: rgba(139, 92, 246, 0.1);
          color: #a78bfa;
        }
        [data-theme='dark'] .persona-chip.active {
          background: #7c3aed;
          color: white;
        }
        .persona-icon {
          font-size: 1.1rem;
        }

        .system-prompt-textarea { width: 100%; border: 1px solid var(--border); border-radius: 12px; padding: 1rem; font-size: 0.95rem; outline: none; resize: vertical; background: var(--bg-main); color: var(--text-main); font-family: inherit; transition: var(--transition); }
        .system-prompt-textarea:focus { border-color: #8b5cf6; box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1); }
        .hint { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.75rem; margin-bottom: 0; }
        .hint code { background: var(--bg-main); padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #7c3aed; }

        .ai-generate-box { margin-bottom: 2rem; }
        .ai-badge { display: inline-block; background: var(--primary-light); color: var(--primary); padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 800; margin-bottom: 0.75rem; }
        .ai-generate-row { display: flex; gap: 0.75rem; }
        .ai-input { flex: 1; padding: 0.75rem 1rem; border: 1px solid var(--border); border-radius: var(--radius-md); font-size: 0.95rem; outline: none; background: var(--bg-main); color: var(--text-main); transition: var(--transition); }
        .ai-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }

        .questions-list { display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 1.5rem; }

        .editor-footer {
          margin-top: 2.5rem;
          background: var(--bg-card); 
          padding: 1.5rem 2rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          box-shadow: var(--shadow-sm);
        }
        .add-question-section p { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin: 0 0 0.5rem; }
        .save-btn { min-width: 150px; justify-content: center; padding: 0.75rem 1.5rem; }

        @media (max-width: 768px) {
          .editor-footer {
            flex-direction: column;
            gap: 1.25rem;
            padding: 1.25rem;
            align-items: stretch;
          }
          .add-question-section {
            width: 100%;
          }
          .save-btn {
            width: 100%;
          }
          .create-header { flex-direction: column; }
          .ai-generate-row { flex-direction: column; }
        }
      `}</style>
    </div>
  );
};

export default CreateSurvey;