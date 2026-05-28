import React from 'react';
import { Plus } from 'lucide-react';

const AddQuestionButton = ({ onClick }) => {
  return (
    <div title="Soru Ekle">
      <button onClick={onClick} className="add-question-btn">
        <span className="plus-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={24} />
        </span>
      </button>

      <style jsx="true">{`
        .add-question-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border: 1px solid var(--border);
          border-radius: 50%;
          background-color: var(--bg-card);
          box-shadow: var(--shadow-sm);
          cursor: pointer;
          transition: var(--transition);
          outline: none;
        }

        .add-question-btn:hover {
          transform: translateY(-2px) scale(1.05);
          border-color: var(--primary);
          background-color: var(--primary-light);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
        }

        .add-question-btn:active {
          transform: translateY(0) scale(0.95);
        }

        .plus-icon {
          font-size: 24px;
          color: var(--text-muted);
          font-weight: 500;
          transition: var(--transition);
          display: inline-block;
          line-height: 1;
        }

        .add-question-btn:hover .plus-icon {
          color: var(--primary);
          transform: rotate(90deg);
        }
      `}</style>
    </div>
  );
};

export default AddQuestionButton;