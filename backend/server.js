require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI client kontrolü
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY .env dosyasında bulunamadı!");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 1. KLASİK ANKET ÜRETME ENDPOINT'İ
 * Kullanıcının verdiği konuya göre 5 soru üretir.
 */
app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;
  console.log("Klasik Anket Üretme İsteği:", prompt);

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "Prompt boş olamaz" });
  }

  try {
    const systemPrompt = `
      Sen profesyonel bir anket hazırlama uzmanısın. 
      Kullanıcının konusuna göre 5 adet mantıklı ve profesyonel soru üret.
      FORMAT KURALLARI:
      - SADECE saf bir JSON dizisi dön.
      - JSON dışında hiçbir açıklama veya metin ekleme.
      - Soru tipleri: "text" veya "multipleChoice".
      - "multipleChoice" tipinde "options" dizisi en az 3 seçenek içermelidir.
      - "text" tipinde "options" dizisi boş [] olmalıdır.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    let text = completion.choices[0].message.content.trim();
    text = text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error) {
    console.error("GENERATE HATASI:", error.message);
    res.status(500).json({ error: "AI üretimi başarısız" });
  }
});

/**
 * 2. AJAN MODU SOHBET ENDPOINT'İ
 * Kullanıcıyla anket kapsamında sohbet eder.
 */
app.post("/api/agent", async (req, res) => {
  const { message, history, systemPrompt } = req.body;
  console.log("Ajan Mesaj İsteği:", message);

  try {
    const baseInstruction = `
      Sen akıllı bir anket toplama ajanısın. Görevin, kullanıcıyla doğal bir şekilde sohbet ederek bilgi toplamaktır.
      
      TALİMATLAR:
      - Kullanıcıya karşı nazik ve profesyonel ol.
      - Her seferinde sadece TEK bir soru sor.
      - Kullanıcının verdiği cevaplara göre kısa yorumlar yapıp bir sonraki soruya geç.
      - Eğer kullanıcının verdiği talimatlar (${systemPrompt}) bittiyse veya tüm gerekli bilgileri topladıysan, mesajının sonuna mutlaka "[[FINISH]]" ifadesini ekle.
      - "[[FINISH]]" ifadesinden önce kullanıcıya teşekkür etmeyi unutma.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: baseInstruction + "\nKullanıcı Özel Talimatı: " + (systemPrompt || "Genel bir anket yap.") },
        ...(history || []),
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("AJAN HATASI:", error.message);
    res.status(500).json({ error: "Ajan yanıt veremedi." });
  }
});

/**
 * 3. VERİ AYIKLAMA (EXTRACTION) ENDPOINT'İ
 * Sohbet geçmişini analiz edip yapılandırılmış JSON'a dönüştürür.
 */
app.post("/api/extract-data", async (req, res) => {
  const { history } = req.body;

  try {
    const extractionPrompt = `
      Aşağıda bir anket ajanı ile kullanıcı arasındaki sohbet geçmişi yer almaktadır.
      Bu geçmişi analiz et ve kullanıcının verdiği tüm cevapları anlamlı bir JSON objesi olarak çıkar.
      Sadece JSON dön.
      Örnek Format: {"isim": "Ahmet", "memnuniyet": "Yüksek", "oneri": "Daha hızlı servis"}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: extractionPrompt },
        { role: "user", content: JSON.stringify(history) }
      ],
      temperature: 0.3, // Daha kesin sonuçlar için düşük sıcaklık
    });

    let text = completion.choices[0].message.content.trim();
    text = text.replace(/```json|```/g, "").trim();
    
    const data = JSON.parse(text);
    res.json({ extractedData: data });
  } catch (error) {
    console.error("EXTRACTION HATASI:", error.message);
    res.status(500).json({ error: "Veri ayıklama başarısız." });
  }
});

// Sunucuyu Başlat
app.listen(port, () => {
  console.log(`🚀 AI Survey Backend http://localhost:${port} adresinde çalışıyor`);
});