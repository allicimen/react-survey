import React from 'react';

// Props:
// onClick: Tıklanınca (CreateSurvey sayfasında) yeni soru ekleyecek
const AddQuestionButton = ({ onClick }) => {
  return (
    <div title="Soru Ekle">
      <button 
        onClick={onClick} 
        className="icon-btn" // googleForms.css içinde tanımlamıştık
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            border: '1px solid #dadce0',
            borderRadius: '50%', // Yuvarlak buton
            backgroundColor: '#fff',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}
      >
        {/* Artı (+) işareti */}
        <span style={{ fontSize: '24px', color: '#5f6368', fontWeight: 'bold' }}>+</span>
      </button>
    </div>
  );
};

export default AddQuestionButton;