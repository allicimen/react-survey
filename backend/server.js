/* eslint-env node */
/* global process */
import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { createRequire } from 'module';

dotenv.config();
const require = createRequire(import.meta.url);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Firebase Admin
try {
  const serviceAccount = require('./serviceAccount.json');
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
} catch {
  admin.initializeApp({ projectId: "project-62179159490816488" });
}

const db = admin.firestore();

// Middleware: Firebase Token Doğrulama
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Yetkisiz erişim: Token eksik' });
  }
  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch {
    return res.status(401).json({ error: 'Yetkisiz erişim: Geçersiz token' });
  }
};

// Sade Endpoints
app.get('/api/surveys', verifyToken, async (req, res) => {
  // Sadece kullanıcının kendi anketlerini getir (veya şimdilik güvenlik için sadece giriş yapma zorunluluğu)
  // Eski anketlerde userId olmayabileceği için şimdilik sadece auth zorunluluğu eklendi.
  const snapshot = await db.collection('surveys').get();
  res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
});

app.post('/api/surveys', verifyToken, async (req, res) => {
  const { id, ...data } = req.body;
  // Yeni anketlerde userId'yi güvenli bir şekilde backend'de ekleyelim
  const surveyData = { ...data, userId: req.user.uid };
  
  if (id) {
    await db.collection('surveys').doc(id).set(surveyData, { merge: true });
    res.json({ id, ...surveyData });
  } else {
    const docRef = await db.collection('surveys').add(surveyData);
    res.json({ id: docRef.id, ...surveyData });
  }
});


app.get('/api/surveys/:id/fill', async (req, res) => {
  const doc = await db.collection('surveys').doc(req.params.id).get();
  if (!doc.exists) {
    return res.status(404).json({ error: 'Anket bulunamadı' });
  }
  res.json({ id: doc.id, ...doc.data() });
});

app.get('/api/surveys/:id/results', verifyToken, async (req, res) => {
  const survey = await db.collection('surveys').doc(req.params.id).get();
  const resp = await db.collection('responses').where('surveyId', '==', req.params.id).get();
  res.json({ ...survey.data(), responses: resp.docs.map(d => d.data()) });
});

app.post('/api/responses', async (req, res) => {
  await db.collection('responses').add(req.body);
  res.json({ success: true });
});

app.delete('/api/surveys/:id', verifyToken, async (req, res) => {
  await db.collection('surveys').doc(req.params.id).delete();
  res.json({ success: true });
});

// AI Endpoints
app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Sen bir anket uzmanısın. Verilen konuya uygun 5 adet çoktan seçmeli veya kısa cevaplı soru hazırla. Yanıtı sadece JSON formatında ver: { \"title\": \"...\", \"description\": \"...\", \"questions\": [{ \"id\": 1, \"type\": \"multipleChoice|text\", \"text\": \"...\", \"options\": [] }] }" },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/agent', async (req, res) => {
  const { systemPrompt, history, message } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt + "\n\nCRITICAL RULES FOR CONVERSATION:\n1. Karşındakiyle doğal, empatik, samimi ve son derece profesyonel bir insan gibi sohbet et. Robotik listeler veya mekanik ifadeler yapma.\n2. ASLA birden fazla soruyu aynı anda sorma! Eğer talimatında veya görev tanımında birden fazla soru (örneğin 3-4 soru) listelenmiş olsa bile, bu soruların hepsini aynı anda asla sorma! Her seferinde sadece sıradaki TEK BİR soruyu sor ve kullanıcının cevabını bekle.\n3. Kullanıcı cevap verdiğinde, önce onun cevabına doğal, insani ve ilgili bir tepki ver (Örn: 'Anlıyorum, bu gerçekten önemli bir nokta', 'Harika bir yaklaşım', 'Bu çok mantıklı' vb.), ardından sıradaki soruya geç.\n4. İlk mesajında sadece sıcak bir selamlama yap, kendini tanıt (örneğin İK uzmanı isen o rolde tanıt) ve sadece İLK soruyu sorarak başla.\n5. Tüm sorular bittikten ve konuşma tamamen sonlandıktan sonra (veda ederken), en son mesajının sonuna sadece [[FINISH]] ekle. Anket bitmeden veya ilk mesajında ASLA [[FINISH]] yazma." },
        ...history,
        { role: "user", content: message }
      ]
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/extract-data', async (req, res) => {
  const { history } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Aşağıdaki konuşma geçmişinden kullanıcının verdiği yanıtları analiz et ve JSON formatında özetle." },
        { role: "user", content: JSON.stringify(history) }
      ],
      response_format: { type: "json_object" }
    });
    res.json({ extractedData: JSON.parse(completion.choices[0].message.content) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/analyze-results', async (req, res) => {
  const { surveyTitle, responses } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Sen bir veri analistisin. Verilen anket sonuçlarını analiz et, ana bulguları çıkar, tavsiyeler ver, genel duygu durumunu yüzdelik olarak hesapla ve açık uçlu yanıtlarda en çok geçen kelimeleri word cloud için çıkar. Yanıtı SADECE JSON formatında ver: { \"findings\": [\"...\"], \"recommendations\": [\"...\"], \"sentiment\": { \"positive\": 70, \"neutral\": 20, \"negative\": 10 }, \"wordCloud\": [{ \"text\": \"kelime1\", \"value\": 15 }, { \"text\": \"kelime2\", \"value\": 10 }] }" },
        { role: "user", content: `Anket: ${surveyTitle}\nYanıtlar: ${JSON.stringify(responses)}` }
      ],
      response_format: { type: "json_object" }
    });
    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`🚀 Sunucu ${port} portunda hazır`));