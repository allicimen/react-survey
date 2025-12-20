import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionField from '../components/QuestionField';
import AddQuestionButton from '../components/AddQuestionButton';
import { generateID } from '../utils/idGenerator';
import { saveSurvey } from '../services/dbService';
import { generateQuestionsAI } from '../services/aiService'; // YENİ: AI servisini çağırdık
import '../styles/createSurvey.css';

const CreateSurvey = () => {
  const navigate = useNavigate();
  
  // Anket Başlığı ve Açıklaması
  const [title, setTitle] = useState("Adsiz Anket");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false); // YENİ: Bekleme durumu için
  
  // Soruların tutulduğu liste
  const [questions, setQuestions] = useState([
    { id: generateID(), text: "", type: "text", options: ["Seçenek 1"] }
  ]);

  // YENİ: Yapay Zeka Butonuna Basılınca Çalışacak Fonksiyon
  const handleAIGenerate = async () => {
    if (!title || title === "Adsız Anket") {
      alert("Lütfen önce anket başlığına bir konu yazın (Örn: Müşteri Memnuniyeti)");
      return;
    }

    setIsLoading(true); // Yükleniyor modunu aç
    
    try {
      // 1. Servisten soruları iste (Servis 1.5 sn bekletip cevap dönecek)
      const aiQuestions = await generateQuestionsAI(title);

      // 2. Gelen sorulara ID ekle (React listeleri için ID şarttır)
      const formattedQuestions = aiQuestions.map(q => ({
        ...q,
        id: generateID()
      }));

      // 3. Mevcut soruların altına yeni soruları ekle
      setQuestions([...questions, ...formattedQuestions]);
      
    } catch (error) {
      alert("Bir hata oluştu.");
    } finally {
      setIsLoading(false); // Yükleniyor modunu kapat
    }
  };

  // Yeni soru ekleme fonksiyonu (Manuel)
  const handleAddQuestion = () => {
    const newQuestion = {
      id: generateID(),
      text: "",
      type: "text",
      options: ["Seçenek 1"]
    };
    setQuestions([...questions, newQuestion]);
  };

  // Soruyu güncelleme fonksiyonu
  const handleUpdateQuestion = (id, updatedQuestion) => {
    const newQuestions = questions.map(q => (q.id === id ? updatedQuestion : q));
    setQuestions(newQuestions);
  };

  // Soruyu silme fonksiyonu
  const handleDeleteQuestion = (id) => {
    const newQuestions = questions.filter(q => q.id !== id);
    setQuestions(newQuestions);
  };

  // Anketi Kaydetme
  const handleSave = () => {
    const surveyData = {
      id: generateID(),
      title,
      description,
      questions,
      createdAt: new Date().toISOString()
    };
    saveSurvey(surveyData);
    alert("Anket kaydedildi!");
    navigate('/');
  };

  return (
    <div className="create-survey-wrapper">
      <div className="survey-content">
        
        {/* En Üstteki Başlık Kartı */}
        <div className="form-card header-card">
          <input 
            type="text" 
            className="input-text" 
            style={{ fontSize: '32px', marginBottom: '10px' }} 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Anket Başlığı"
          />
          <input 
            type="text" 
            className="input-text" 
            style={{ fontSize: '14px' }} 
            placeholder="Form açıklaması" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />

          {/* YENİ: Yapay Zeka Butonu */}
          <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
            <button 
              onClick={handleAIGenerate} 
              disabled={isLoading} // Yüklenirken tıklanmasın
              style={{
                backgroundColor: isLoading ? '#ccc' : '#1a73e8', // Yüklenirken gri, yoksa mavi
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: isLoading ? 'wait' : 'pointer',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {/* Basit bir büyücü değneği ikonu ve yazı */}
              ✨ {isLoading ? "Yapay Zeka Düşünüyor..." : "Yapay Zeka ile Soru Öner"}
            </button>
            <p style={{fontSize:'11px', color:'#888', marginTop:'5px'}}>
              *Başlığa yazdığınız konuya göre otomatik soru üretir.
            </p>
          </div>
        </div>

        {/* Soruların Listelenmesi */}
        {questions.map((q) => (
          <QuestionField 
            key={q.id} 
            question={q} 
            onUpdate={handleUpdateQuestion} 
            onDelete={handleDeleteQuestion} 
          />
        ))}

        {/* Kaydet Butonu */}
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button className="btn-primary" onClick={handleSave}>ANKETİ KAYDET</button>
        </div>

      </div>

      {/* Sağda Yüzen Menü */}
      <div className="floating-sidebar">
        <AddQuestionButton onClick={handleAddQuestion} />
      </div>
    </div>
  );
};

export default CreateSurvey;