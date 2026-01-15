// src/services/dbService.js
import { db, auth } from "../firebase"; // <-- auth eklendi
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  arrayUnion,
  query,  // <-- Sorgu oluşturmak için
  where   // <-- Filtrelemek için
} from "firebase/firestore";

const COLLECTION_NAME = "surveys";

// 1. Sadece GİRİŞ YAPAN KULLANICININ anketlerini getirir
export const getSurveys = async () => {
  try {
    const user = auth.currentUser;
    // Eğer kullanıcı giriş yapmamışsa veri gösterme (Boş dizi dön)
    if (!user) return [];

    // SORGULAMA: userId'si benim uid'me eşit olanları getir
    const q = query(collection(db, COLLECTION_NAME), where("userId", "==", user.uid));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Firebase veri çekme hatası:", error);
    return [];
  }
};

// 2. Tek bir anketi ID'sine göre bulur
export const getSurvey = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("Anket bulunamadı!");
      return null;
    }
  } catch (error) {
    console.error("Anket getirme hatası:", error);
    return null;
  }
};

// 3. Anketi kaydeder (veya varsa günceller)
// setDoc kullandığımız için ID aynıysa üzerine yazar (Update gibi çalışır)
export const saveSurvey = async (survey) => {
  try {
    await setDoc(doc(db, COLLECTION_NAME, survey.id), survey);
  } catch (error) {
    console.error("Kaydetme hatası:", error);
    throw error;
  }
};

// 4. Güncelleme Fonksiyonu
export const updateSurvey = saveSurvey;

// 5. Anketi siler
export const deleteSurvey = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Silme hatası:", error);
  }
};

// 6. Ankete yeni bir cevap ekler
export const addResponseToSurvey = async (surveyId, response) => {
  try {
    const surveyRef = doc(db, COLLECTION_NAME, surveyId);

    // arrayUnion: Mevcut diziye yeni elemanı ekler
    await updateDoc(surveyRef, {
      responses: arrayUnion({
        ...response,
        submittedAt: new Date().toISOString()
      })
    });
    return true;
  } catch (error) {
    console.error("Cevap ekleme hatası:", error);
    return false;
  }
};