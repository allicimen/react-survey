import React, { useState } from 'react';
import { Image, X, FolderOpen, Loader2 } from 'lucide-react';

const SurveyImage = ({ element, onUpdate, onDelete }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Resim boyutu kontrolü (Örn: Max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Lütfen 2MB'den küçük bir resim seçin. (Sistem veritabanına doğrudan kayıt yapıyor)");
      return;
    }

    setIsUploading(true);
    
    // Base64'e dönüştür (Güvenli ve Storage gerektirmeyen yöntem)
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      onUpdate(element.id, { ...element, text: base64String });
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert("Resim okunurken bir hata oluştu.");
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <strong style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Image size={18} /> Görsel Alanı
        </strong>
        <button 
          onClick={() => onDelete(element.id)}
          style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input 
          type="text" 
          placeholder="Görsel URL veya Yükleyin..." 
          value={element.text}
          onChange={(e) => onUpdate(element.id, { ...element, text: e.target.value })}
          style={{
            flex: 1, padding: '10px', borderRadius: '8px',
            border: '1px solid var(--border)', fontSize: '14px',
            background: 'var(--bg-main)', color: 'var(--text-main)'
          }}
        />
        <label className="btn-upload" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isUploading ? <Loader2 size={16} className="spin" /> : <FolderOpen size={16} />}
          {isUploading ? 'Yükleniyor...' : 'Seç'}
          <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} disabled={isUploading} />
        </label>
      </div>

      <style jsx="true">{`
        .btn-upload {
          background: var(--bg-main);
          border: 1px solid var(--border);
          padding: 8px 15px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: var(--transition);
        }
        .btn-upload:hover { border-color: var(--primary); color: var(--primary); }
      `}</style>


      {/* Önizleme Alanı */}
      {element.text && (
        <div style={{ marginTop: '16px', textAlign: 'center', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
          <img 
            src={element.text} 
            alt="Önizleme" 
            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            onError={(e) => { e.target.style.display = 'none'; alert("Resim yüklenemedi, linki kontrol et!"); }}
          />
        </div>
      )}
    </div>
  );
};

export default SurveyImage;