require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI client
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY .env dosyasında yok");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 1. ANKET ÜRETME ENDPOINT'İ (Klasik Liste İçin)
app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;
  console.log("Anket Üretme İsteği Geldi:", prompt);

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
      - Soru tipleri: "text" (açık uçlu) veya "multipleChoice" (çoktan seçmeli) olabilir.
      - "multipleChoice" tipinde "options" dizisi en az 3 seçenek içermelidir.
      - "text" tipinde "options" dizisi boş [] olmalıdır.

      ÖRNEK FORMAT:
      [
        { "text": "Hizmetimizden memnun musunuz?", "type": "multipleChoice", "options": ["Evet", "Hayır", "Belki"] },
        { "text": "Öneriniz nedir?", "type": "text", "options": [] }
      ]
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
    console.log("GPT Anket Sorularını Üretti");
    res.json(parsed);

  } catch (error) {
    console.error("GENERATE HATASI:", error.message);
    res.status(500).json({ error: "AI üretimi başarısız" });
  }
});

// 2. AJAN MODU ENDPOINT'İ (Chatbot Sohbeti İçin)
app.post("/api/agent", async (req, res) => {
  const { message, history, systemPrompt } = req.body;
  console.log("Ajan Sohbet İsteği Geldi:", message);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: systemPrompt || "Sen bir anket ajanısın. Kullanıcıyla sohbet ederek bilgi topla. Kibar ol ve her seferinde tek bir kısa soru sor." 
        },
        ...(history || []), // Önceki mesaj geçmişi
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    console.log("Ajan Yanıt Verdi:", reply);
    res.json({ reply });

  } catch (error) {
    console.error("AJAN HATASI:", error.message);
    res.status(500).json({ error: "Ajan şu an yanıt veremiyor." });
  }
});

// Server start
app.listen(port, () => {
  console.log(`🚀 GPT backend ${port} portunda hazır`);
});