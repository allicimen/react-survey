// src/services/aiService.js
const API_URL = "http://localhost:5000/api";

export const generateQuestionsAI = async (userPrompt) => {
  const response = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: userPrompt }),
  });
  if (!response.ok) throw new Error("AI isteği başarısız");
  return await response.json();
};

export const sendMessageToAgent = async (systemPrompt, history, message) => {
  const response = await fetch(`${API_URL}/agent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ systemPrompt, history, message }),
  });
  if (!response.ok) throw new Error("Agent isteği başarısız");
  const data = await response.json();
  return data.reply; // Sadece reply metnini döner
};

export const extractSurveyData = async (history) => {
  const response = await fetch(`${API_URL}/extract-data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ history }),
  });
  if (!response.ok) throw new Error("Veri ayıklama başarısız");
  return await response.json();
};