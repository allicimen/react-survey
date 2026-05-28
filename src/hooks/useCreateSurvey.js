import { useState, useEffect } from 'react';
import { generateID } from '../utils/idGenerator';
import { saveSurvey, getSurvey } from '../services/dbService'; 
import { useNavigate, useParams } from 'react-router-dom';
import { auth } from '../firebase';
import { generateQuestionsAI } from '../services/aiService';
import { PERSONA_TEMPLATES } from '../data/personaTemplates';

export const useCreateSurvey = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [step, setStep] = useState(1); 
  const [title, setTitle] = useState("Adsız Anket");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('classic'); 
  const [systemPrompt, setSystemPrompt] = useState(PERSONA_TEMPLATES.hr.prompt);
  const [activePersona, setActivePersona] = useState('hr');
  const [questions, setQuestions] = useState([
    { id: generateID(), text: "", type: "text", options: ["Seçenek 1"] }
  ]);
  const [isEditMode, setIsEditMode] = useState(false);

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
          
          const loadedPrompt = surveyToEdit.systemPrompt || '';
          setSystemPrompt(loadedPrompt);
          const matched = Object.keys(PERSONA_TEMPLATES).find(key => PERSONA_TEMPLATES[key].prompt === loadedPrompt);
          setActivePersona(matched || 'custom');
          
          setStep(2);
        }
      };
      loadSurvey();
    }
  }, [id, navigate]);

  const changePersona = (personaKey) => {
    setActivePersona(personaKey);
    if (personaKey !== 'custom') {
      setSystemPrompt(PERSONA_TEMPLATES[personaKey].prompt);
    }
  };

  const selectMode = (selectedMode) => {
    setMode(selectedMode);
    setStep(2);
  };

  const goBack = () => {
    if (isEditMode) navigate('/dashboard');
    else setStep(1);
  };

  const addQuestion = (type = 'text') => {
    const defaultOptions = (type === 'multipleChoice' || type === 'checkbox') ? ["Seçenek 1"] : [];
    setQuestions(prev => [...prev, { id: generateID(), text: "", type, options: defaultOptions }]);
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

  /**
   * AI GENERATE GÜNCELLEMESİ:
   * AI'dan gelen verilerdeki anahtar isimlerini (key names) kontrol eder ve temizler.
   */
  const handleAIGenerate = async (userPrompt) => {
      if (!userPrompt || userPrompt.trim() === "") {
        alert("Lütfen yapay zekaya ne üretmesi gerektiğini söyleyin.");
        return;
      }
      setIsLoading(true);
      try {
        const aiResponse = await generateQuestionsAI(userPrompt);
        
        // Backend'in object veya array dönme ihtimaline karşı kontrol
        let aiQuestionsArray = [];
        if (Array.isArray(aiResponse)) {
            aiQuestionsArray = aiResponse;
        } else if (aiResponse && Array.isArray(aiResponse.questions)) {
            aiQuestionsArray = aiResponse.questions;
            // Eğer başlık/açıklama da geldiyse güncelleyebiliriz
            if (aiResponse.title) setTitle(aiResponse.title);
            if (aiResponse.description) setDescription(aiResponse.description);
        }
        
        if (aiQuestionsArray.length > 0) {
            const formattedQuestions = aiQuestionsArray.map(q => ({ 
                id: generateID(),
                // Savunmacı kontrol: AI 'question' gönderse bile 'text'e çeviriyoruz
                text: q.text || q.question || "Soru metni alınamadı", 
                type: q.type || "text",
                // Eğer seçenekler yoksa ve çoktan seçmeliyse varsayılan ekle
                options: (q.options && q.options.length > 0) 
                         ? q.options 
                         : (q.type === 'multipleChoice' ? ["Seçenek 1", "Seçenek 2"] : [])
            }));
            
            // Mevcut boş/yeni soruların üzerine ekle
            setQuestions(prev => {
              // Eğer ilk soru boşsa onu temizle, değilse koru
              const filteredPrev = prev.length === 1 && prev[0].text === "" ? [] : prev;
              return [...filteredPrev, ...formattedQuestions];
            });
        } else {
            alert("Yapay zeka soru üretemedi, lütfen tekrar deneyin.");
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
      createdAt: isEditMode ? null : new Date().toISOString(),
      mode: mode, 
      questions: mode === 'classic' ? questions : [],
      systemPrompt: mode === 'agent' ? systemPrompt : null
    };

    try {
        await saveSurvey(surveyData);

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
    activePersona, changePersona,
    addQuestion, addSpecialElement, updateQuestion, deleteQuestion,
    handleSave, handleAIGenerate
  };
};

export default useCreateSurvey;