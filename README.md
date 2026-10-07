<div align="center">

# 🧠 AI Destekli Anket Platformu

**Anketlerini ister klasik yöntemle, ister yapay zekâ ajanıyla sohbet ederek oluştur.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs&logoColor=white)](#-backend)

[🐛 Hata Bildir](https://github.com/allicimen/react-survey/issues)

</div>

---

## 📖 Proje Hakkında

Bu proje, kullanıcıların anket oluşturup paylaşabildiği ve diğer kullanıcıların bu anketleri doldurabildiği tam yığın (full-stack) bir web uygulamasıdır. Projeyi benzerlerinden ayıran nokta, anket oluşturma sürecine **yapay zekâyı** dahil etmesidir: Kullanıcı soruları tek tek elle yazabileceği gibi, yapay zekâdan soru ürettirebilir ya da bir **AI ajanıyla sohbet ederek** anketini adım adım şekillendirebilir.

Frontend React 19 + Vite ile geliştirilmiştir. Kimlik doğrulama Firebase Auth ile yapılırken, tüm veri işlemleri ve yapay zekâ istekleri projeye özel bir **Node.js backend** üzerinden yürütülür.

## ✨ Özellikler

| | Özellik | Açıklama |
|---|---|---|
| ✍️ | **Klasik Anket Oluşturma** | Soruları ve seçenekleri elle ekleyerek anket hazırlama |
| 🤖 | **AI ile Soru Üretimi** | Konuyu yaz, yapay zekâ sana uygun soruları önersin |
| 💬 | **AI Ajan Modu** | Sohbet arayüzü üzerinden ajanla konuşarak anket kurgulama |
| 📝 | **Anket Doldurma** | Oluşturulan anketlere katılım ve yanıt gönderme |
| 🔐 | **Kimlik Doğrulama** | Firebase Authentication ile kullanıcı girişi |
| 📊 | **Sonuç Grafikleri** | Yanıtların Recharts ile görselleştirilmesi |
| 📥 | **Excel'e Aktarma** | Anket sonuçlarını `.xlsx` olarak indirme |
| 📱 | **QR Kod ile Paylaşım** | Anket bağlantısını QR kod olarak paylaşma |
| 🖼️ | **Görsel Yükleme** | Anketlere görsel ekleme desteği |
| 🎞️ | **Akıcı Arayüz** | Framer Motion animasyonları ve toast bildirimleri |

## 🛠️ Teknolojiler

**Frontend**
- [React 19](https://react.dev) + [Vite 7](https://vite.dev) — arayüz ve geliştirme ortamı
- [React Router v7](https://reactrouter.com) — sayfa yönlendirme
- Context API + özel hook'lar (`useCreateSurvey`, `useFillSurvey`) — durum yönetimi
- [Framer Motion](https://www.framer.com/motion/) — animasyonlar
- [Recharts](https://recharts.org) — grafikler
- [Lucide React](https://lucide.dev) — ikonlar
- [React Hot Toast](https://react-hot-toast.com) — bildirimler
- [qrcode.react](https://github.com/zpao/qrcode.react) — QR kod üretimi
- [SheetJS (xlsx)](https://sheetjs.com) — Excel dışa aktarma
- [Axios](https://axios-http.com) — HTTP istekleri

**Backend & Servisler**
- Node.js backend (`/backend`) — veritabanı işlemleri ve AI istekleri
- Firebase — **yalnızca** kimlik doğrulama (Auth)

## 🏗️ Mimari

```
┌──────────────────────┐        ┌─────────────────────────┐
│   React Frontend     │        │    Node.js Backend      │
│                      │        │   (localhost:5000/api)  │
│  pages/  ──► hooks/  │        │                         │
│              │       │  HTTP  │  • Anket kayıt / okuma  │
│              ▼       │ ─────► │  • AI soru üretimi      │
│         services/    │        │  • AI ajan sohbeti      │
│   ├─ dbService.js    │        │  • Görsel yükleme       │
│   └─ aiService.js    │        │                         │
└─────────┬────────────┘        └─────────────────────────┘
          │
          ▼
   Firebase Auth (yalnızca giriş/kayıt)
```

Projenin temel mimari prensipleri:

- **İş mantığı hook'larda, arayüz sayfalarda.** Her sayfanın mantığı kendine ait bir `use...` hook'unda tutulur; `.jsx` dosyaları yalnızca arayüzden sorumludur.
- **Veri işlemleri backend üzerinden.** Frontend doğrudan Firestore'a yazmaz; tüm okuma/yazma `dbService.js` aracılığıyla backend'e gider.
- **AI istekleri backend üzerinden.** API anahtarları istemcide tutulmaz; `aiService.js` istekleri backend'e iletir.
- **Firebase yalnızca Auth için.** Storage, Firestore gibi diğer Firebase servisleri kullanılmaz.

## 📁 Proje Yapısı

```
react-survey/
├── backend/              # Node.js API sunucusu
├── src/
│   ├── components/       # Yeniden kullanılabilir bileşenler (örn. ChatInterface)
│   ├── hooks/            # useCreateSurvey, useFillSurvey vb.
│   ├── pages/            # Sayfa bileşenleri (örn. CreateSurvey.jsx)
│   ├── services/
│   │   ├── dbService.js  # Backend veri işlemleri
│   │   └── aiService.js  # Backend AI işlemleri
│   ├── firebase.js       # Firebase Auth yapılandırması
│   └── main.jsx          # Uygulama giriş noktası
├── AI_RULES.md           # AI asistanlarla geliştirme kuralları
├── index.html
├── package.json
└── vite.config.js
```

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ (Vite 7 için 20.19+ önerilir)
- npm
- Bir Firebase projesi (Authentication etkin)
- Kullanılan yapay zekâ sağlayıcısı için API anahtarı

### 1. Depoyu klonla

```bash
git clone https://github.com/allicimen/react-survey.git
cd react-survey
```

### 2. Backend'i çalıştır

```bash
cd backend
npm install
# .env dosyasını oluştur (aşağıya bak)
npm start
```

Backend varsayılan olarak `http://localhost:5000` adresinde çalışır.

### 3. Frontend'i çalıştır

Yeni bir terminalde proje kök dizininde:

```bash
npm install
npm run dev
```

Uygulama `http://localhost:5173` adresinde açılır.

### 🔑 Ortam Değişkenleri

**Frontend** — kök dizinde `.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

**Backend** — `backend/.env`:

```env
PORT=5000
AI_API_KEY=...        # Kullanılan AI sağlayıcısının anahtarı
DATABASE_URL=...      # Kullanılan veritabanı bağlantısı
```

> ⚠️ `.env` dosyalarını asla depoya göndermeyin.

## 📜 Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusunu başlatır |
| `npm run build` | Üretim derlemesi oluşturur |
| `npm run preview` | Derlenmiş uygulamayı önizler |
| `npm run lint` | ESLint ile kod denetimi yapar |

## 🤖 AI Destekli Geliştirme

Bu proje geliştirilirken yapay zekâ kod asistanlarından yararlanılmıştır. Süreçte karşılaşılan tekrarlayan hataları önlemek için [`AI_RULES.md`](./AI_RULES.md) dosyası oluşturulmuştur. Projeye bir AI asistanla katkı sağlayacaksanız, asistanın önce bu dosyayı okumasını sağlayın.

## 🗺️ Yol Haritası

- [ ] Backend'i bulut ortamına taşıyıp canlı demo yayınlamak
- [ ] API adresini ortam değişkenine (`VITE_API_URL`) almak
- [ ] TypeScript'e geçiş
- [ ] Birim ve entegrasyon testleri
- [ ] Çoklu dil desteği

## 👤 Geliştirici

**Ali Çimen** — [@allicimen](https://github.com/allicimen)

---

<div align="center">
Beğendiysen bir ⭐ bırakmayı unutma!
</div>
