
const API_KEY = "AIzaSyCKx6EJ9dfvRXIIj6jtMDEaCpQFPireA5c"; 

// Yardımcı Fonksiyon: Google'dan kullanılabilir modelleri çeker
async function findActiveModel() {
  try {
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    const response = await fetch(listUrl);
    const data = await response.json();
    
    if (data.models) {
      // İçinde "generateContent" özelliği olan ve isminde "gemini" geçen ilk modeli bul
      const validModel = data.models.find(m => 
        m.supportedGenerationMethods.includes("generateContent") && 
        m.name.includes("gemini")
      );
      if (validModel) {
        console.log("Bulunan Çalışan Model:", validModel.name);
        return validModel.name; // Örn: "models/gemini-1.0-pro" döner
      }
    }
  } catch (e) {
    console.error("Model listesi alınamadı:", e);
  }
  // Eğer bulamazsa en garanti yedeği döndür
  return "models/gemini-pro";
}

export const generateQuestionsAI = async (topic) => {
  
  // Önce çalışan modeli buluyoruz (Auto-Detect)
  const modelName = await findActiveModel();
  
  // URL'yi dinamik modele göre oluşturuyoruz
  const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${API_KEY}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `
              Sen bir anket asistanısın. Şu konu hakkında 5 anket sorusu üret: "${topic}".
              
              KURALLAR:
              1. Sadece saf JSON formatında cevap ver.
              2. Markdown formatı (backtick) KULLANMA.
              3. Cevap şu formatta bir array olsun:
              [
                { "text": "Soru 1", "type": "multipleChoice", "options": ["A", "B"] },
                { "text": "Soru 2", "type": "text", "options": [] }
              ]
            `
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Google Hatası: ${errorData.error?.message || response.status}`);
    }

    const data = await response.json();
    
    // Cevap kontrolü
    if(!data.candidates || data.candidates.length === 0) {
        throw new Error("Yapay zeka boş cevap döndü.");
    }

    let text = data.candidates[0].content.parts[0].text;

    // Temizlik
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(text);

  } catch (error) {
    console.error("Yapay Zeka Bağlantı Sorunu:", error);
    alert(`Hata: ${error.message}`);
    
    // Uygulama çökmesin diye boş liste dönüyoruz
    return [];
  }
};