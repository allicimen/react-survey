// src/hooks/useFillSurvey.js
import { useState, useEffect, useRef } from 'react';
import { getSurvey, addResponseToSurvey } from '../services/dbService';
import { sendMessageToAgent } from '../services/aiService';
import { useParams } from 'react-router-dom';

const useFillSurvey = () => {
  const { id } = useParams();
  
  // State'ler
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({}); // Klasik mod cevapları
  const [messages, setMessages] = useState([]); // Ajan modu mesajları
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const hasGreeted = useRef(false);
  const messagesEndRef = useRef(null);

  // 1. Anketi Yükle (Async/Await Yapısı)
  useEffect(() => {
    const fetchSurvey = async () => {
      // Firebase'den verinin gelmesini bekle
      const data = await getSurvey(id);
      
      if (data) {
        setSurvey(data);
        
        // SADECE 'agent' modundaysa ve daha önce selam vermediyse bot konuşmaya başlasın
        if (data.mode === 'agent' && !hasGreeted.current) {
          startAgentConversation(data.systemPrompt);
          hasGreeted.current = true;
        }
      }
    };

    fetchSurvey();
  }, [id]);

  // Otomatik Scroll (Sadece Ajan modunda işe yarar)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // --- KLASİK MOD FONKSİYONLARI ---
  
  // Form elemanı değiştiğinde çalışır
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Checkbox için özel mantık (Dizi olarak tutar)
  const handleCheckboxChange = (questionId, option) => {
    setAnswers(prev => {
      const currentSelections = prev[questionId] || [];
      if (currentSelections.includes(option)) {
        return { ...prev, [questionId]: currentSelections.filter(item => item !== option) };
      } else {
        return { ...prev, [questionId]: [...currentSelections, option] };
      }
    });
  };

  // Klasik anket bittiğinde (Async)
  const submitClassicSurvey = async () => {
    if (!survey) return;
    
    // Cevapların Firebase'e kaydedilmesini bekle
    await addResponseToSurvey(survey.id, answers);
    setIsFinished(true);
  };

  // --- AJAN MODU FONKSİYONLARI ---
  const addBotMessage = (text) => setMessages(prev => [...prev, { sender: 'bot', text }]);
  const addUserMessage = (text) => setMessages(prev => [...prev, { sender: 'user', text }]);

  const startAgentConversation = async (systemPrompt) => {
    setIsTyping(true);
    try {
        const response = await sendMessageToAgent(systemPrompt, [], "Merhaba, anketi başlat.");
        setIsTyping(false);
        addBotMessage(response.replace("[ANKET_BITTI]", "")); 
    } catch (e) {
        setIsTyping(false);
        addBotMessage("Merhaba! Size nasıl yardımcı olabilirim?");
    }
  };

  const handleAgentSend = async () => {
    if (!inputText.trim()) return;
    const userText = inputText;
    
    addUserMessage(userText);
    setInputText("");

    if (isFinished) return;

    setIsTyping(true);
    const aiResponse = await sendMessageToAgent(survey.systemPrompt, messages, userText);
    setIsTyping(false);

    if (aiResponse.includes("[ANKET_BITTI]")) {
        const cleanResponse = aiResponse.replace("[ANKET_BITTI]", "");
        addBotMessage(cleanResponse);
        
        // Sohbet geçmişini kaydet ve işlemin bitmesini bekle
        await addResponseToSurvey(survey.id, { 
            chatHistory: [...messages, {sender:'user', text: userText}, {sender:'bot', text: cleanResponse}],
            summary: "AI ile tamamlanan anket"
        });
        setIsFinished(true);
    } else {
        addBotMessage(aiResponse);
    }
  };

  return {
    survey,
    isFinished,
    // Klasik Mod Props
    answers,
    handleAnswerChange,
    handleCheckboxChange,
    submitClassicSurvey,
    // Ajan Mod Props
    messages,
    inputText, setInputText,
    isTyping,
    handleAgentSend,
    messagesEndRef
  };
};

export default useFillSurvey;