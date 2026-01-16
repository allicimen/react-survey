// src/hooks/useFillSurvey.js
import { useState, useEffect, useRef } from 'react';
import { getSurvey, addResponseToSurvey } from '../services/dbService';
import { sendMessageToAgent, extractSurveyData } from '../services/aiService';
import { useParams } from 'react-router-dom';

const useFillSurvey = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [messages, setMessages] = useState([]); // UI için mesajlar
  const [history, setHistory] = useState([]);  // OpenAI formatı için geçmiş
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const hasGreeted = useRef(false);

  useEffect(() => {
    const fetchSurvey = async () => {
      const data = await getSurvey(id);
      if (data) {
        setSurvey(data);
        if (data.mode === 'agent' && !hasGreeted.current) {
          startAgentConversation(data.systemPrompt);
          hasGreeted.current = true;
        }
      }
    };
    fetchSurvey();
  }, [id]);

  const startAgentConversation = async (systemPrompt) => {
    setIsTyping(true);
    try {
      const reply = await sendMessageToAgent(systemPrompt, [], "Merhaba, anketi başlat.");
      processBotReply(reply);
    } catch (e) {
      addBotMessage("Merhaba! Sizinle anket için sohbet etmeye hazırım.");
    } finally {
      setIsTyping(false);
    }
  };

  const processBotReply = (reply) => {
    const cleanReply = reply.replace("[[FINISH]]", "").trim();
    addBotMessage(cleanReply);
    setHistory(prev => [...prev, { role: 'assistant', content: cleanReply }]);
    
    if (reply.includes("[[FINISH]]")) {
      finalizeAgentSurvey([...history, { role: 'assistant', content: cleanReply }]);
    }
  };

  const finalizeAgentSurvey = async (finalHistory) => {
    setIsTyping(true);
    try {
      // Backend'den verileri JSON olarak ayıkla
      const { extractedData } = await extractSurveyData(finalHistory);
      await addResponseToSurvey(survey.id, {
        type: 'agent_chat',
        data: extractedData,
        fullHistory: finalHistory,
        submittedAt: new Date().toISOString()
      });
      setIsFinished(true);
    } catch (error) {
      console.error("Kayıt Hatası:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAgentSend = async () => {
    if (!inputText.trim() || isTyping || isFinished) return;
    
    const userText = inputText;
    setInputText("");
    addUserMessage(userText);
    
    const newHistory = [...history, { role: 'user', content: userText }];
    setHistory(newHistory);
    
    setIsTyping(true);
    try {
      const reply = await sendMessageToAgent(survey.systemPrompt, newHistory, userText);
      processBotReply(reply);
    } catch (e) {
      addBotMessage("Bir bağlantı sorunu oluştu, lütfen tekrar deneyin.");
    } finally {
      setIsTyping(false);
    }
  };

  const addBotMessage = (text) => setMessages(prev => [...prev, { sender: 'bot', text }]);
  const addUserMessage = (text) => setMessages(prev => [...prev, { sender: 'user', text }]);

  // Klasik mod fonksiyonları (Mevcut yapıyı koruyoruz)
  const handleAnswerChange = (qId, val) => setAnswers(p => ({ ...p, [qId]: val }));
  const handleCheckboxChange = (qId, opt) => {
    setAnswers(p => {
      const cur = p[qId] || [];
      return { ...p, [qId]: cur.includes(opt) ? cur.filter(i => i !== opt) : [...cur, opt] };
    });
  };
  const submitClassicSurvey = async () => {
    await addResponseToSurvey(survey.id, answers);
    setIsFinished(true);
  };

  return {
    survey, isFinished, answers, handleAnswerChange, handleCheckboxChange,
    submitClassicSurvey, messages, inputText, setInputText, isTyping, handleAgentSend
  };
};

export default useFillSurvey;