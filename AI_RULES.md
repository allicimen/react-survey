# AI Geliştirici Rehberi (AI_RULES.md)

Bu dosya, bu projeyi geliştiren yapay zeka asistanları için referans niteliğinde kritik kurallar içerir. Lütfen kod yazmadan önce burayı okuyun ve mevcut mimariyi asla bozmayın!

---

## 🏗 Proje Hakkında Kısaca
Bu proje, kullanıcıların klasik yöntemlerle veya **Yapay Zeka (AI Ajan)** desteği ile anketler oluşturabildiği ve katılabildiği dinamik bir **React 19 + Vite** uygulamasıdır. 
- **Frontend:** React, React Router v7, Context API, Özel Hook'lar (`useCreateSurvey`, `useFillSurvey`), CSS Modules / Styled JSX.
- **Backend Entegrasyonu:** Tüm anket verileri (kayıt, okuma, AI soru üretimi, Ajan sohbeti vb.) `http://localhost:5000/api` üzerinden çalışır. `src/services/dbService.js` ve `src/services/aiService.js` dosyaları backend ile iletişimi sağlar.
- **Firebase:** Projede Firebase **SADECE** kimlik doğrulama (Auth) için kullanılmaktadır. Veritabanı ve AI istekleri doğrudan Firebase üzerinden değil, kendi Node.js backend'imiz üzerinden işlenmektedir.

---

## 🚫 YAPAY ZEKANIN ASLA YAPMAMASI GEREKEN HATALAR (KIRMIZI ÇİZGİLER)

Önceki geliştirme aşamalarında yaşanan kronik hatalar ve bunlardan kaçınma yolları:

### 1. Çift Implementasyon (Kodu Basitleştirirken Mimariyi Bozmak)
- **Hata:** Gelişmiş bir Custom Hook (örn: `useCreateSurvey.js`) mevcutken, bu hook'u bağlamayı unutup veya zor bulup, `CreateSurvey.jsx` içerisine sıfırdan basit bir `useState` mantığı kurmak.
- **Kural:** Her zaman sayfanın bir `use...` hook'u olup olmadığını kontrol et. Varsa, iş mantığını hook içine yaz; UI kısmını sayfaya (`.jsx`) yaz. Mimariyi silip baştan daha ilkel bir versiyonunu yazma!

### 2. Props Uyumsuzluğu (Props Mismatch)
- **Hata:** Bir bileşeni çağırırken eksik veri göndermek. Örneğin, `ChatInterface` bileşeninin çalışması için `messages, inputText, setInputText` gibi state'lere ihtiyacı varken sadece `surveyTitle` gönderip diğerlerini silmek. (Ajan modunu bozmuştu).
- **Kural:** Bir bileşeni değiştirirken veya yeniden render ederken, o bileşenin içeriğine girip **hangi props'ları beklediğini mutlaka oku.**

### 3. Kullanılmayan Modülleri Aktifleştirmek (veya Kullanılanı Silmek)
- **Hata:** Firebase Console'da kapalı olan bir hizmeti (Örn: Firebase Storage) `firebase.js` içerisinde top-level (en üstte) `getStorage()` diye çağırarak uygulamanın başlangıçta (beyaz ekran vererek) çökmesine sebep olmak.
- **Kural:** Senden istenmediği sürece var olmayan veya kullanılmayan bir kütüphaneyi/altyapıyı projeye import etme. `dbService.js` gibi yerlerde de daha önceden var olan bir fonksiyonu (`uploadImage` gibi) kazara silme.

### 4. Backend vs. Firebase Karmaşası
- **Hata:** Firebase Auth kullanılıyor diye, yeni bir veri kaydetme özelliğini doğrudan `firebase/firestore` kodlarıyla frontend'e yazmak.
- **Kural:** Veritabanı okuma/yazma işlemleri `dbService.js` içindeki `fetch` komutları ile **backend (localhost:5000)** üzerinden yapılır. AI fonksiyonları da `aiService.js` üzerinden backend'e atılır. Mimariyi frontend-heavy bir Firebase projesine dönüştürme.

### 5. Gereksiz Importlar ve "Warning" Bırakmak
- **Hata:** Sayfa yeniden düzenlenirken eski `useState`, `useRef` veya component import'larını silmeyip projede ESLint hataları ve gereksiz ağırlık bırakmak.
- **Kural:** Yaptığın tüm değişikliklerin sonunda kullanılmayan değişken, import veya argümanları (`catch (error)` içindeki error dahil) mutlaka temizle. 

> **Özet:** Projeye yeni bir kod eklemeden veya mevcut kodu silmeden önce **"Bu yaptığım değişiklik projenin diğer ayaklarını (hook'ları, backend servislerini, props yapısını) kırıyor mu?"** diye iki kez düşün. Gerekirse ilgili dosyaları `view_file` ile oku.
