import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { updateProfile, onAuthStateChanged } from "firebase/auth";
import { useTheme } from '../context/ThemeContext';
import { getSurveys } from '../services/dbService';
import { Link } from 'react-router-dom';
import { ArrowLeft, UserCircle, Palette, HardDrive, Moon, Sun, Download, Save } from 'lucide-react';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [userName, setUserName] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email.split('@')[0]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateName = async () => {
    if (!userName.trim()) return;
    setIsUpdating(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: userName });
        alert("İsminiz başarıyla güncellendi.");
      }
    } catch (error) {
      alert("Hata: " + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const surveys = await getSurveys();
      const blob = new Blob([JSON.stringify(surveys, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `survey_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Veri indirme hatası.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <Link to="/dashboard" className="btn-back" style={{ marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Panele Dön
        </Link>
        <h1>Ayarlar</h1>
        <p>Profilini ve uygulama tercihlerini buradan yönetebilirsin.</p>
      </header>

      <div className="settings-grid">
        {/* Profil Ayarları */}
        <div className="card settings-card">
          <h3 className="card-section-title"><UserCircle size={18} /> Profil Bilgileri</h3>
          <div className="input-group">
            <label>Görünen İsim</label>
            <input 
              type="text" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)} 
            />
          </div>
          <button onClick={handleUpdateName} disabled={isUpdating} className="btn btn-primary">
            <Save size={16} /> {isUpdating ? 'Güncelleniyor...' : 'İsmi Güncelle'}
          </button>
        </div>

        {/* Görünüm Ayarları */}
        <div className="card settings-card">
          <h3 className="card-section-title"><Palette size={18} /> Görünüm</h3>
          <p>Uygulama temasını tercihine göre değiştirebilirsin.</p>
          <div className="theme-toggle-area">
            <span>Şu anki Tema: <strong>{theme === 'light' ? 'Aydınlık' : 'Karanlık'}</strong></span>
            <button onClick={toggleTheme} className="btn btn-secondary">
              {theme === 'light' ? <><Moon size={16} /> Karanlık Moda Geç</> : <><Sun size={16} /> Aydınlık Moda Geç</>}
            </button>
          </div>
        </div>

        {/* Veri Yönetimi */}
        <div className="card settings-card danger-zone">
          <h3 className="card-section-title"><HardDrive size={18} /> Veri ve Yedekleme</h3>
          <p>Tüm anketlerini ve yanıtlarını JSON formatında bilgisayarına indirebilirsin.</p>
          <button onClick={handleExportData} disabled={isExporting} className="btn btn-outline">
            <Download size={16} /> {isExporting ? 'Hazırlanıyor...' : 'Verileri Dışa Aktar'}
          </button>
        </div>
      </div>

      <style jsx="true">{`
        .settings-page { max-width: 800px; margin: 0 auto; }
        .settings-header { margin-bottom: 2.5rem; }
        .settings-header h1 { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; }
        .settings-header p { color: var(--text-muted); }

        .settings-grid { display: flex; flex-direction: column; gap: 1.5rem; }

        .card-section-title {
          margin-top: 0;
          margin-bottom: 1.25rem;
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        
        .input-group { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; }
        .input-group label { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }
        .input-group input { padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border); background: var(--bg-main); color: var(--text-main); outline: none; transition: var(--transition); }
        .input-group input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }

        .theme-toggle-area { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; }

        .danger-zone { border-left: 4px solid #f59e0b; }
      `}</style>
    </div>
  );
};

export default Settings;
