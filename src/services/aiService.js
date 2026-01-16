// src/services/aiService.js

const API_URL = "http://localhost:5000/api";

/**
 * Anket sorularını backend üzerinden üretir
 */
export const generateQuestionsAI = async (userPrompt) => {
  const response = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: userPrompt }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "AI isteği başarısız");
  }

  return await response.json();
};

/**
 * (İleride) Ajan modu için backend endpoint
 * Şimdilik pasif ama mimari hazır
 */
export const sendMessageToAgent = async (payload) => {
  const response = await fetch(`${API_URL}/agent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Agent isteği başarısız");
  }

  return await response.json();
};
