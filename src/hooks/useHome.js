// src/hooks/useHome.js
import { useState, useEffect } from 'react';
import { getSurveys, deleteSurvey } from '../services/dbService';
import { auth } from '../firebase'; // <-- 1. Auth eklendi
import { onAuthStateChanged } from 'firebase/auth'; // <-- 2. Dinleyici eklendi

const useHome = () => {
  const [surveys, setSurveys] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 3. Verileri Yükle (Kullanıcı durumunu dinleyerek)
  useEffect(() => {
    setIsLoading(true);

    // Firebase'e "Kullanıcı durumu netleşince bana haber ver" diyoruz
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Kullanıcı giriş yapmış, verileri çekebiliriz
        try {
          const data = await getSurveys();
          setSurveys(data);
        } catch (error) {
          console.error("Veri çekme hatası:", error);
        }
      } else {
        // Kullanıcı yoksa listeyi boşalt
        setSurveys([]);
      }
      setIsLoading(false); // Yükleme bitti
    });

    // Sayfadan çıkılınca dinlemeyi durdur
    return () => unsubscribe();
  }, []);

  // --- Buradan aşağısı aynı ---
  
  const handleDelete = async (id, e) => {
    e.preventDefault(); 
    if (window.confirm("Bu anketi silmek istediğine emin misin?")) {
      await deleteSurvey(id); 
      
      // Listeyi güncellemek için tekrar çekiyoruz
      const updatedData = await getSurveys();
      setSurveys(updatedData);
    }
  };

  const handleShare = (id, e) => {
    e.preventDefault();
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/survey/${id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("✅ Anket linki kopyalandı!");
    });
  };

  const totalSurveys = surveys.length;
  const totalResponses = surveys.reduce((acc, curr) => acc + (curr.responses ? curr.responses.length : 0), 0);

  const filteredSurveys = surveys.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "Tarih yok";
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return {
    surveys,
    searchTerm, setSearchTerm,
    filteredSurveys,
    totalSurveys,
    totalResponses,
    handleDelete,
    handleShare,
    formatDate,
    isLoading 
  };
};

export default useHome;