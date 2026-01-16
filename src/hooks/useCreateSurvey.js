// src/hooks/useCreateSurvey.js
import { useState, useEffect } from 'react';
import { generateID } from '../utils/idGenerator';
import { saveSurvey, getSurvey, updateSurvey } from '../services/dbService'; 
import { useNavigate, useParams } from 'react-router-dom';
import { auth } from '../firebase';
// YENİ: aiService'den fonksiyonu import ediyoruz
import { generateQuestionsAI } from '../services/aiService';

export const useCreateSurvey = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [step, setStep] = useState(1); 
  const [title, setTitle] = useState("Adsız Anket");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('classic'); 
  const [systemPrompt, setSystemPrompt] = useState("");
  const [questions, setQuestions] = useState([
    { id: generateID(), text: "", type: "text", options: ["Seçenek 1"] }
  ]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingResponsesCount, setExistingResponsesCount] = useState(0);

  useEffect(() => {
    if (id) {
      const loadSurvey = async () => {
        const surveyToEdit = await getSurvey(id);
        if (surveyToEdit) {
          if (auth.currentUser && surveyToEdit.userId && surveyToEdit.userId !== auth.currentUser.uid) {
            alert("Bu anketi düzenleme yetkiniz yok.");
            navigate('/dashboard');
            return;
          }
          setIsEditMode(true);
          setTitle(surveyToEdit.title);
          setDescription(surveyToEdit.description);
          setMode(surveyToEdit.mode || 'classic');
          setQuestions(surveyToEdit.questions || []);
          setSystemPrompt(surveyToEdit.systemPrompt || "");
          setExistingResponsesCount(surveyToEdit.responses ? surveyToEdit.responses.length : 0);
          setStep(2);
        }
      };
      loadSurvey();
    }
  }, [id, navigate]);

  const selectMode = (selectedMode) => {
    setMode(selectedMode);
    setStep(2);
  };

  const goBack = () => {
    if (isEditMode) navigate('/dashboard');
    else setStep(1);
  };

  const addQuestion = () => {
    setQuestions(prev => [...prev, { id: generateID(), text: "", type: "text", options: ["Seçenek 1"] }]);
  };

  const addSpecialElement = (type) => {
    setQuestions(prev => [...prev, {
      id: generateID(),
      text: type === 'header' ? "Yeni Bölüm" : "",
      type: type,
      options: []
    }]);
  };

  const updateQuestion = (id, data) => {
    setQuestions(prev => prev.map(q => q.id === id ? data : q));
  };

  const deleteQuestion = (id) => {
    if (questions.length <= 1) return;
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  // --- GÜNCELLENEN handleAIGenerate ---
  const handleAIGenerate = async (userPrompt) => {
      if (!userPrompt || userPrompt.trim() === "") {
        alert("Lütfen yapay zekaya ne üretmesi gerektiğini söyleyin.");
        return;
      }
      setIsLoading(true);
      try {
        // Doğrudan fetch yerine oluşturduğumuz servisi çağırıyoruz
        const aiQuestions = await generateQuestionsAI(userPrompt);
        
        if (aiQuestions && aiQuestions.length > 0) {
            const formattedQuestions = aiQuestions.map(q => ({ 
                ...q, 
                id: generateID(),
                // Eğer AI options dönmezse varsayılan değer atıyoruz
                options: q.options && q.options.length > 0 ? q.options : ["Seçenek 1"] 
            }));
            // Mevcut soruların üzerine ekle
            setQuestions(prev => [...prev, ...formattedQuestions]);
        }
      } catch (error) {
        console.error("AI Hatası:", error);
        alert(error.message || "Üretim sırasında bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
  };

  const handleSave = async () => {
    if (!title || title.trim() === "") {
      alert("Anket başlığı boş olamaz!");
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      alert("Oturum süreniz dolmuş, lütfen tekrar giriş yapın.");
      navigate('/login');
      return;
    }

    const surveyData = {
      id: isEditMode ? id : generateID(),
      userId: user.uid,
      title,
      description,
      createdAt: isEditMode ? null : new Date().toISOString(), // dbService update'de koruyacaktır
      mode: mode, 
      questions: mode === 'classic' ? questions : [],
      systemPrompt: mode === 'agent' ? systemPrompt : null
    };

    try {
        if (isEditMode) {
            await updateSurvey(surveyData);
        } else {
            await saveSurvey(surveyData);
        }
        navigate('/dashboard');
    } catch (error) {
        console.error("Kayıt hatası:", error);
        alert("Anket kaydedilirken bir sorun oluştu.");
    }
  };

  return {
    step, selectMode, goBack, isEditMode,
    title, setTitle, description, setDescription,
    isLoading, questions, mode, 
    systemPrompt, setSystemPrompt,
    addQuestion, addSpecialElement, updateQuestion, deleteQuestion,
    handleSave, handleAIGenerate
  };
};

export default useCreateSurvey;