import React from 'react';
import useFillSurvey from '../hooks/useFillSurvey';
import ChatInterface from '../components/ChatInterface';
import { Check, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

const FillSurvey = () => {
  const {
    survey,
    isFinished,
    answers,
    handleAnswerChange,
    messages,
    inputText,
    setInputText,
    isTyping,
    handleAgentSend,
    currentStep,
    totalSteps,
    handleNext,
    handlePrev
  } = useFillSurvey();

  if (!survey) {
    return (
      <div className="fill-loading">
        <Loader2 size={40} className="spin" style={{ color: 'var(--primary)' }} />
        <p>Anket Hazırlanıyor...</p>
      </div>
    );
  }

  // BİTİŞ EKRANI
  if (isFinished) {
    return (
      <div className="success-screen">
         <div className="success-card card">
          <div className="success-check"><Check size={40} strokeWidth={3} /></div>
          <h2>Teşekkür Ederiz!</h2>
          <p>Yanıtlarınız başarıyla kaydedildi. Katılımınız bizim için çok değerli.</p>
          <div className="success-divider"></div>
          <button onClick={() => window.location.href = '/'} className="btn btn-primary">
            Ana Sayfaya Dön
          </button>
        </div>

        <style jsx="true">{`
          .success-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg-main); padding: 2rem; }
          .success-card { max-width: 450px; width: 100%; text-align: center; padding: 3rem 2rem; }
          .success-check { width: 80px; height: 80px; background: #10b981; color: white; font-size: 2.5rem; display: flex; align-items: center; justify-content: center; border-radius: 50%; margin: 0 auto 2rem; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2); }
          .success-card h2 { font-size: 1.75rem; font-weight: 800; margin-bottom: 1rem; }
          .success-card p { color: var(--text-muted); line-height: 1.6; margin-bottom: 2rem; }
          .success-divider { height: 1px; background: var(--border); margin-bottom: 2rem; }
          .btn-primary { width: 100%; justify-content: center; }
        `}</style>
      </div>
    );
  }

  // AI AJAN MODU
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

  const currentQuestion = survey.questions[currentStep];
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <div className="focus-mode-container">
      <div className="animated-bg"></div>
      
      <div className="progress-container">
        <motion.div 
          className="progress-bar" 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        ></motion.div>
        <span className="progress-text">{Math.round(progress)}% Tamamlandı</span>
      </div>

      <main className="focus-main">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQuestion.id}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="focus-question-card card"
          >
            <div className="question-header">
              <span className="q-index">SORU {currentStep + 1}</span>
              <h2 className="q-text">{currentQuestion.text}</h2>
            </div>

            <div className="q-body">
              {currentQuestion.type === 'text' && (
                <textarea 
                  placeholder="Yanıtınızı buraya yazın..."
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                />
              )}

              {currentQuestion.type === 'multipleChoice' && (
                <div className="options-list">
                  {currentQuestion.options.map((opt, i) => (
                    <label key={i} className={`option-item ${answers[currentQuestion.id] === opt ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name={currentQuestion.id} 
                        value={opt} 
                        checked={answers[currentQuestion.id] === opt}
                        onChange={() => handleAnswerChange(currentQuestion.id, opt)}
                      />
                      <span className="opt-radio"></span>
                      <span className="opt-text">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="focus-footer">
              <button 
                className="btn btn-outline btn-prev" 
                onClick={handlePrev} 
                disabled={currentStep === 0}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft size={16} /> Geri
              </button>
              <button 
                className="btn btn-primary btn-next" 
                onClick={handleNext}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
              >
                {currentStep === totalSteps - 1 ? (
                  <><Check size={16} /> Anketi Bitir</>
                ) : (
                  <>Sıradaki <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <style jsx="true">{`
        .focus-mode-container {
          min-height: 100vh;
          background: var(--bg-main);
          position: relative;
        }
        
        /* PREMIUM PROGRESS BAR */
        .progress-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: var(--border);
          z-index: 100;
        }
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          box-shadow: 0 0 10px var(--primary);
        }
        .progress-text {
          position: absolute;
          top: 16px;
          right: 20px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-muted);
          background: var(--bg-card);
          padding: 4px 12px;
          border-radius: 20px;
          box-shadow: var(--shadow-sm);
        }

        .focus-main { max-width: 700px; margin: 4rem auto 0; padding: 2rem; }
        .focus-question-card { padding: 2.5rem; }
        .question-header { margin-bottom: 2rem; }
        .q-index { font-size: 0.75rem; font-weight: 800; color: var(--primary); letter-spacing: 0.05em; display: block; margin-bottom: 0.5rem; }
        .q-text { font-size: 1.5rem; font-weight: 800; margin: 0; color: var(--text-main); }
        .q-body { margin-bottom: 2.5rem; }
        
        .q-body textarea { width: 100%; border: 1px solid var(--border); border-radius: 12px; padding: 1rem; min-height: 140px; outline: none; font-size: 1rem; transition: var(--transition); background: var(--bg-main); color: var(--text-main); }
        .q-body textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }

        .options-list { display: flex; flex-direction: column; gap: 1rem; }
        .option-item { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; border: 1px solid var(--border); border-radius: 12px; cursor: pointer; transition: var(--transition); background: var(--bg-main); }
        .option-item:hover { border-color: var(--primary); background: var(--primary-light); }
        .option-item.selected { border-color: var(--primary); background: var(--primary-light); box-shadow: 0 0 0 1px var(--primary); }
        .option-item input[type="radio"] { display: none; }
        
        .opt-radio { width: 20px; height: 20px; border: 2px solid var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: var(--transition); flex-shrink: 0; }
        .option-item.selected .opt-radio { border-color: var(--primary); }
        .option-item.selected .opt-radio::after { content: ''; width: 10px; height: 10px; background: var(--primary); border-radius: 50%; display: block; }
        .opt-text { font-size: 1rem; font-weight: 600; color: var(--text-main); }

        .focus-footer { display: flex; justify-content: space-between; align-items: center; gap: 1rem; border-top: 1px solid var(--border); padding-top: 1.5rem; }
        .focus-footer .btn-prev { min-width: 100px; }
        .focus-footer .btn-next { min-width: 140px; }

        .fill-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; gap: 1rem; color: var(--text-muted); }
        .spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default FillSurvey;