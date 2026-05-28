import React from 'react';
import { Video, Trash2, AlertTriangle } from 'lucide-react';

const SurveyVideo = ({ element, onUpdate, onDelete }) => {
  
  // YouTube linkinden ID'yi çeken yardımcı fonksiyon
  // Öğrenim Notu: Regex (Düzenli İfadeler) kullanarak metin içinden ID ayıklıyoruz.
  const getYoutubeID = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoID = getYoutubeID(element.text);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <strong style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Video size={18} /> Video Alanı
        </strong>
        <button 
          onClick={() => onDelete(element.id)}
          style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Trash2 size={14} /> Sil
        </button>
      </div>

      <input 
        type="text" 
        placeholder="YouTube video linkini buraya yapıştırın..." 
        value={element.text}
        onChange={(e) => onUpdate(element.id, { ...element, text: e.target.value })}
        style={{
          width: '100%', padding: '10px', borderRadius: '8px',
          border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box'
        }}
      />

      {/* Video Oynatıcı (Eğer geçerli bir ID varsa gösterir) */}
      {videoID ? (
        <div style={{ marginTop: '16px', position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '12px' }}
            src={`https://www.youtube.com/embed/${videoID}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        // Link girildi ama geçersizse uyarı
        element.text && (
          <div style={{marginTop: '10px', color: '#f59e0b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px'}}>
            <AlertTriangle size={14} /> Geçerli bir YouTube linki giriniz.
          </div>
        )
      )}
    </div>
  );
};

export default SurveyVideo;