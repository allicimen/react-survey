/* services/dbService.js */

const STORAGE_KEY = 'survey_app_data';

// Tüm anketleri getirir
export const getSurveys = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Tek bir anketi ID'sine göre bulur
export const getSurvey = (id) => {
  const surveys = getSurveys();
  return surveys.find(s => s.id === id);
};

// Anketi kaydeder veya günceller
export const saveSurvey = (survey) => {
  const surveys = getSurveys();
  const existingIndex = surveys.findIndex(s => s.id === survey.id);

  if (existingIndex >= 0) {
    // Varsa güncelle
    surveys[existingIndex] = survey;
  } else {
    // Yoksa yeni ekle
    surveys.push(survey);
  }

  // Veriyi string'e çevirip kaydet
  localStorage.setItem(STORAGE_KEY, JSON.stringify(surveys));
};

// Anketi siler
export const deleteSurvey = (id) => {
  const surveys = getSurveys();
  const newSurveys = surveys.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newSurveys));
};


// Ankete yeni bir cevap ekler
export const addResponseToSurvey = (surveyId, response) => {
  const surveys = getSurveys();
  const surveyIndex = surveys.findIndex(s => s.id === surveyId);

  if (surveyIndex >= 0) {
    // Eğer anketin henüz hiç cevabı yoksa boş dizi oluştur
    if (!surveys[surveyIndex].responses) {
      surveys[surveyIndex].responses = [];
    }
    
    // Yeni cevabı ekle (Tarih bilgisiyle beraber)
    surveys[surveyIndex].responses.push({
      ...response,
      submittedAt: new Date().toISOString()
    });

    // Kaydet
    localStorage.setItem('survey_app_data', JSON.stringify(surveys));
    return true;
  }
  return false;
};