// src/services/aiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";


const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Yapay Zeka Kurulumu
let genAI = null;

if (API_KEY && !API_KEY.includes("BURAYA")) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

// Denenecek Modeller Listesi (Sırayla hepsini zorlayacağız)
const MODEL_NAMES = [
  "gemini-1.5-flash",
  "gemini-pro",
  "gemini-1.0-pro",
  "gemini-1.5-pro"
];

// Yardımcı Fonksiyon: Hangi model çalışıyorsa onunla cevap alır
async function tryGenerateContent(promptText) {
  if (!genAI) throw new Error("API Anahtarı girilmemiş.");

  let lastError = null;

  for (const modelName of MODEL_NAMES) {
    try {
      console.log(`Deneniyor: ${modelName}...`); // Konsolda görmek için
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent(promptText);
      const response = await result.response;
      return response.text(); // Başarılıysa cevabı döndür ve döngüden çık

    } catch (error) {
      console.warn(`${modelName} çalışmadı (404 veya yetki yok).`);
      lastError = error;
      // 404 hatasıysa diğer modele geç, değilse (internet yoksa vs) durma devam et
      if (!error.message.includes("404") && !error.message.includes("not found")) {
         // Ciddi bir hataysa da şansımızı diğerlerinde deneyelim
      }
    }
  }
  throw lastError || new Error("Hiçbir model çalışmadı.");
}

// 1. Soru Üretme Fonksiyonu
export const generateQuestionsAI = async (userPrompt) => {
  const prompt = `Sen bir anketörsün. "${userPrompt}" hakkında 5 soru üret. 
  ÖNEMLİ: Cevabı SADECE aşağıdaki gibi saf bir JSON dizisi olarak ver. 
  Başına veya sonuna 'json' veya ''' gibi işaretler koyma.
  Format: [{"text": "Soru?", "type": "text", "options": []}]`;

  try {
    // Burada özel fonksiyonumuzu çağırıyoruz
    let text = await tryGenerateContent(prompt);
    
    // Temizlik
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);

  } catch (error) {
    console.error("AI Hatası:", error);
    alert("Yapay Zeka Hatası: " + error.message);
    return [];
  }
};

// 2. Ajan Modu Konuşma Motoru
export const sendMessageToAgent = async (systemPrompt, history, userMessage) => {
  if (!genAI) return "API Anahtarı yok.";

  // Ajan modu için en güvenilir olanı (gemini-pro) veya çalışan herhangi birini bulmamız lazım.
  // Basitlik olsun diye burada direkt gemini-pro deniyoruz, çalışmazsa fallback yaparız.
  // Ancak yukarıdaki mantığı buraya da uygulayalım:
  
  const chatHistory = history.map(msg => ({
    role: msg.sender === 'bot' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  // Burası biraz daha karmaşık olduğu için tek tek deneme yapacağız
  for (const modelName of MODEL_NAMES) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const chat = model.startChat({
            history: [
            { role: "user", parts: [{ text: `GÖREVİN: ${systemPrompt}. Anladıysan 'OK' de.` }] },
            { role: "model", parts: [{ text: "OK" }] },
            ...chatHistory
            ],
        });
        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
      } catch (e) {
        if (modelName === MODEL_NAMES[MODEL_NAMES.length - 1]) return "Bağlantı hatası.";
        continue;
      }
  }
};