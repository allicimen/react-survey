import React from 'react';

/**
 * QuestionTypeSelector Bileşeni
 * Soru tipini seçmek için kullanılan buton grubudur.
 * İkon içermez, sadece metin tabanlıdır.
 */
const QuestionTypeSelector = ({ selectedType, onTypeChange }) => {
  const types = [
    { id: 'text', label: 'Kısa Yanıt' },
    { id: 'paragraph', label: 'Uzun Yanıt' },
    { id: 'multipleChoice', label: 'Tekli Seçim' },
    { id: 'checkbox', label: 'Çoklu Seçim' }
  ];

  return (
    <div className="question-type-selector">
      {types.map((type) => (
        <button
          key={type.id}
          type="button"
          onClick={() => onTypeChange(type.id)}
          className={`type-btn ${selectedType === type.id ? 'active' : ''}`}
        >
          {type.label}
        </button>
      ))}

      <style jsx="true">{`
        .question-type-selector {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 8px;
          width: 100%;
        }

        .type-btn {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background-color: var(--bg-main);
          color: var(--text-main);
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 600;
          text-align: center;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          box-sizing: border-box;
        }

        .type-btn:hover {
          border-color: var(--primary);
          background-color: var(--primary-light);
          color: var(--primary);
        }

        .type-btn.active {
          border: 2px solid var(--primary);
          background-color: var(--primary-light);
          color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-light);
        }

        @media (max-width: 768px) {
          .question-type-selector {
            grid-template-columns: 1fr 1fr;
            margin-top: 10px;
          }
          .type-btn {
            padding: 12px 4px;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default QuestionTypeSelector;