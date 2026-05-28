import { db, auth } from "../firebase";
import { collection, doc, getDoc, getDocs, setDoc, addDoc, deleteDoc, query, where } from "firebase/firestore";

export const getSurveys = async () => {
  try {
    // Sadece mevcut kullanıcının anketlerini getirmek isterseniz where() eklenebilir,
    // ancak orijinal kodda tümünü çekiyor.
    const q = collection(db, "surveys");
    const snapshot = await getDocs(q);
    const surveys = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Bütün yanıtları tek seferde çekip anketlere dağıtıyoruz (N+1 sorgusunu önlemek için)
    const respQ = collection(db, "responses");
    const respSnap = await getDocs(respQ);
    const responsesBySurvey = {};
    
    respSnap.forEach(doc => {
      const data = doc.data();
      if (!responsesBySurvey[data.surveyId]) {
        responsesBySurvey[data.surveyId] = [];
      }
      responsesBySurvey[data.surveyId].push(data);
    });

    return surveys.map(survey => ({
      ...survey,
      responses: responsesBySurvey[survey.id] || []
    }));
  } catch (error) {
    console.error("Hata:", error);
    return [];
  }
};

export const getSurvey = async (id) => {
  try {
    const docRef = doc(db, "surveys", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
  } catch (error) {
    console.error("Hata:", error);
    return null;
  }
};

export const getSurveyResults = async (id) => {
  try {
    const docRef = doc(db, "surveys", id);
    const surveySnap = await getDoc(docRef);
    if (!surveySnap.exists()) return null;
    
    const q = query(collection(db, "responses"), where("surveyId", "==", id));
    const respSnap = await getDocs(q);
    const responses = respSnap.docs.map(doc => doc.data());
    
    return { id: surveySnap.id, ...surveySnap.data(), responses };
  } catch (error) {
    console.error("Hata:", error);
    return null;
  }
};

export const saveSurvey = async (survey) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Giriş yapılmadı");
    
    const surveyData = { ...survey, userId: user.uid };
    const { id } = surveyData;
    
    if (id) {
      await setDoc(doc(db, "surveys", id), surveyData, { merge: true });
      return surveyData;
    } else {
      const docRef = await addDoc(collection(db, "surveys"), surveyData);
      return { id: docRef.id, ...surveyData };
    }
  } catch (error) {
    console.error("Hata:", error);
    throw error;
  }
};

export const deleteSurvey = async (id) => {
  try {
    await deleteDoc(doc(db, "surveys", id));
    return true;
  } catch {
    return false;
  }
};

export const submitResponse = async (surveyId, answers) => {
  try {
    await addDoc(collection(db, "responses"), { surveyId, answers });
    return true;
  } catch (error) {
    console.error("Hata:", error);
    return false;
  }
};