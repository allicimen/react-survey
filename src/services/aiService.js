import { auth } from "../firebase";

const API_URL = "http://localhost:5000/api";

// Yardımcı fonksiyon: Token al
const getAuthHeaders = async () => {
  const token = await auth.currentUser?.getIdToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
};

export const generateQuestionsAI = async (userPrompt) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers,
    body: JSON.stringify({ prompt: userPrompt }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "AI üretimi başarısız.");
  }
  return await response.json();
};

export const sendMessageToAgent = async (systemPrompt, history, message) => {
  // Ajan mesajları genelde anonim dolum yapanlar içindir, token zorunlu değil
  const response = await fetch(`${API_URL}/agent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ systemPrompt, history, message }),
  });
  if (!response.ok) throw new Error("Ajan şu an yanıt veremiyor.");
  const data = await response.json();
  return data.reply;
};

export const extractSurveyData = async (history) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/extract-data`, {
    method: "POST",
    headers,
    body: JSON.stringify({ history }),
  });
  if (!response.ok) throw new Error("Veri ayıklama başarısız.");
  return await response.json();
};

export const analyzeSurveyResults = async (surveyTitle, responses) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/analyze-results`, {
    method: "POST",
    headers,
    body: JSON.stringify({ surveyTitle, responses }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Analiz başarısız.");
  }
  return await response.json();
};
