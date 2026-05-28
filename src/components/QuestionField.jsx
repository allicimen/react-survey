import React from 'react';
import QuestionTypeSelector from './QuestionTypeSelector';
import { X, Plus, Trash2 } from 'lucide-react';

const QuestionField = ({ question, onUpdate, onDelete }) => {

  // --- YARDIMCI FONKSİYONLAR ---
  const handleTextChange = (e) => {
    onUpdate(question.id, { ...question, text: e.target.value });
  };

  const handleTypeChange = (newType) => {
    // Tip değiştiğinde seçenekleri de sıfırlayalım/başlatalım
    const defaultOptions = (newType === 'multipleChoice' || newType === 'checkbox') ? ["Seçenek 1"] : [];
    onUpdate(question.id, { ...question, type: newType, options: defaultOptions });
  };

  const addOption = () => {
    const currentOptions = question.options || [];
    const newOptions = [...currentOptions, `Seçenek ${currentOptions.length + 1}`];
    onUpdate(question.id, { ...question, options: newOptions });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...(question.options || [])];
    newOptions[index] = value;
    onUpdate(question.id, { ...question, options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = (question.options || []).filter((_, i) => i !== index);
    onUpdate(question.id, { ...question, options: newOptions });
  };

  return (
    <div className="question-card">
      {/* Mobilde Seçici En Üstte */}
      <div className="mobile-selector">
        <label className="selector-label">Soru Tipi Seçin</label>
        <QuestionTypeSelector 
          selectedType={question.type} 
          onTypeChange={handleTypeChange} 
        />
      </div>

      <div className="question-body">
        <div className="question-content">
          <textarea
            placeholder="Soru metnini buraya yazın..."
            value={question.text || ""}
            onChange={handleTextChange}
            className="question-input"
            rows={2}
          />

          {/* CEVAP ALANI (Şıklar ve Önizlemeler) */}
          <div className="answer-section">
            {(question.type === 'text' || question.type === 'paragraph') && (
              <div className="placeholder-answer">
                {question.type === 'text' ? 'Kullanıcı kısa bir yanıt verecek...' : 'Kullanıcı uzun bir paragraf yanıtı verecek...'}
              </div>
            )}

            {(question.type === 'multipleChoice' || question.type === 'checkbox') && (
              <div className="options-list">
                {(question.options || []).map((opt, index) => (
                  <div key={index} className="option-row">
                    <div className={`option-indicator ${question.type === 'multipleChoice' ? 'radio' : 'checkbox'}`}></div>
                    <input 
                      type="text" 
                      value={opt} 
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="option-input"
                    />
                    <button onClick={() => removeOption(index)} className="btn-remove-option" title="Seçeneği Sil">
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button onClick={addOption} className="btn-add-option" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Plus size={14} /> Seçenek ekle
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Masaüstünde Seçici Sağda */}
        <div className="desktop-selector">
          <QuestionTypeSelector 
            selectedType={question.type} 
            onTypeChange={handleTypeChange} 
          />
        </div>
      </div>

      {/* ALT KISIM (Silme ve Diğer Ayarlar) */}
      <div className="question-footer">
        <button onClick={() => onDelete(question.id)} className="btn-delete-question" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Trash2 size={14} /> Soruyu Sil
        </button>
      </div>

      <style jsx="true">{`
        .question-card {
          margin-bottom: 24px;
          width: 100%;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 2rem;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
        }
        .question-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--primary);
        }
        .mobile-selector {
          display: none;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 15px;
        }
        .selector-label {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 10px;
          display: block;
        }
        .question-body {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }
        .question-content {
          flex: 1;
          width: 100%;
        }
        .question-input {
          width: 100%;
          padding: 12px 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-main);
          border: none;
          border-bottom: 2px solid var(--border);
          outline: none;
          background: transparent;
          transition: var(--transition);
          resize: vertical;
          min-height: 48px;
          font-family: inherit;
        }
        .question-input:focus {
          border-bottom-color: var(--primary);
        }
        .answer-section {
          margin-top: 15px;
        }
        .placeholder-answer {
          padding: 12px;
          background-color: var(--bg-main);
          border: 1px dashed var(--border);
          border-radius: 8px;
          color: var(--text-muted);
          font-size: 0.875rem;
        }
        .options-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .option-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .option-indicator {
          width: 18px;
          height: 18px;
          border: 2px solid var(--border);
          flex-shrink: 0;
        }
        .option-indicator.radio {
          border-radius: 50%;
        }
        .option-indicator.checkbox {
          border-radius: 4px;
        }
        .option-input {
          border: none;
          border-bottom: 1px solid var(--border);
          font-size: 0.875rem;
          flex: 1;
          padding: 4px 0;
          outline: none;
          background: transparent;
          color: var(--text-main);
          transition: var(--transition);
        }
        .option-input:focus {
          border-bottom-color: var(--primary);
        }
        .btn-remove-option {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          transition: var(--transition);
          padding: 4px;
        }
        .btn-remove-option:hover {
          color: #ef4444;
        }
        .btn-add-option {
          color: var(--primary);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.825rem;
          font-weight: 600;
          padding: 10px 0;
          text-align: left;
          align-self: flex-start;
          transition: var(--transition);
        }
        .btn-add-option:hover {
          color: var(--primary-hover);
          text-decoration: underline;
        }
        .desktop-selector {
          min-width: 220px;
        }
        .question-footer {
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: flex-end;
        }
        .btn-delete-question {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.825rem;
          font-weight: bold;
          transition: var(--transition);
        }
        .btn-delete-question:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        @media (max-width: 768px) {
          .question-card {
            padding: 1.25rem;
          }
          .mobile-selector {
            display: block;
          }
          .desktop-selector {
            display: none;
          }
          .question-body {
            flex-direction: column;
            gap: 16px;
          }
          .question-input {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default QuestionField;