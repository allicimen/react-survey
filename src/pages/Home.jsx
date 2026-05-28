import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useHome from '../hooks/useHome';
import ShareModal from '../components/ShareModal';
import { SurveyCardSkeleton } from '../components/Skeleton';
import {
  Pencil,
  Share2,
  Trash2,
  Users,
  Plus,
  FolderOpen,
  Search,
  Bot,
  ClipboardList
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [shareData, setShareData] = useState({ isOpen: false, id: null, title: '' });
  
  const {
    searchTerm, setSearchTerm,
    filteredSurveys,
    totalSurveys,
    totalResponses,
    handleDelete,
    formatDate,
    isLoading
  } = useHome();

  const openShareModal = (e, id, title) => {
    if (e) e.stopPropagation(); 
    setShareData({ isOpen: true, id, title });
  };

  if (isLoading) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <div><div style={{ width: '150px', height: '32px', background: '#eee', borderRadius: '8px', marginBottom: '8px' }}></div></div>
        </header>
        <section className="stats-grid">
          <div className="card" style={{ height: '100px', background: '#f9f9f9' }}></div>
          <div className="card" style={{ height: '100px', background: '#f9f9f9' }}></div>
        </section>
        <div className="survey-grid">
          <SurveyCardSkeleton />
          <SurveyCardSkeleton />
          <SurveyCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Panelim</h1>
          <p>Anketlerini ve yanıtlarını buradan takip edebilirsin.</p>
        </div>
        <Link to="/create" className="btn btn-primary">
          <Plus size={18} /> Yeni Anket Oluştur
        </Link>
      </header>

      <section className="stats-grid">
        <div className="card stats-card">
          <span className="stats-label">Toplam Anket</span>
          <span className="stats-value">{totalSurveys}</span>
        </div>
        <div className="card stats-card">
          <span className="stats-label">Toplam Yanıt</span>
          <span className="stats-value">{totalResponses}</span>
        </div>
      </section>

      <div className="content-header">
        <h2>Anketlerim</h2>
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Anket adı ile ara..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredSurveys.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon"><FolderOpen size={48} strokeWidth={1.5} /></div>
          <h3>Anket Bulunamadı</h3>
          <p>{searchTerm ? "Aramanızla eşleşen bir anket yok." : "Henüz bir anket oluşturmadınız. Hemen başlayın!"}</p>
          {!searchTerm && (
            <Link to="/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              İlk Anketi Oluştur
            </Link>
          )}
        </div>
      ) : (
        <div className="survey-grid">
          {filteredSurveys.map((survey) => {
            const isAgent = survey.mode === 'agent';
            return (
              <div key={survey.id} className={`card survey-card ${isAgent ? 'agent' : ''}`}>
                <div className="survey-card-body" onClick={() => navigate(`/results/${survey.id}`)}>
                  <div className="survey-badge">
                    {isAgent
                      ? <><Bot size={12} /> AI Ajanı</>
                      : <><ClipboardList size={12} /> Klasik</>
                    }
                  </div>
                  <h3 className="survey-title">{survey.title}</h3>
                  <p className="survey-desc">{survey.description || "Açıklama girilmemiş..."}</p>
                  
                  <div className="survey-meta">
                    <span className="meta-item">
                      <Users size={13} /> {survey.responses?.length || 0} Yanıt
                    </span>
                    <span className="meta-item">•</span>
                    <span className="meta-item">{formatDate(survey.createdAt)}</span>
                  </div>
                </div>

                <div className="survey-card-actions">
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/edit/${survey.id}`); }} className="action-btn" title="Düzenle">
                    <Pencil size={15} />
                  </button>
                  <button onClick={(e) => openShareModal(e, survey.id, survey.title)} className="action-btn" title="Paylaş">
                    <Share2 size={15} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(survey.id, e); }} className="action-btn delete" title="Sil">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ShareModal 
        isOpen={shareData.isOpen} 
        onClose={() => setShareData({ ...shareData, isOpen: false })}
        surveyId={shareData.id}
        surveyTitle={shareData.title}
      />

      <style jsx="true">{`
        .dashboard { max-width: 1100px; margin: 0 auto; }
        .dashboard-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
        .dashboard-header h1 { margin: 0; font-size: 1.75rem; font-weight: 800; }
        .dashboard-header p { margin: 0.25rem 0 0 0; color: var(--text-muted); }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
        .stats-card { display: flex; flex-direction: column; gap: 0.5rem; }
        .stats-label { font-size: 0.875rem; color: var(--text-muted); font-weight: 500; }
        .stats-value { font-size: 2rem; font-weight: 800; color: var(--primary); }

        .content-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .search-wrapper { position: relative; width: 300px; display: flex; align-items: center; }
        .search-icon { position: absolute; left: 12px; color: var(--text-muted); pointer-events: none; }
        .search-wrapper input { width: 100%; padding: 0.6rem 1rem 0.6rem 2.5rem; border-radius: var(--radius-md); border: 1px solid var(--border); background: var(--bg-card); color: var(--text-main); outline: none; transition: var(--transition); }
        .search-wrapper input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }

        .survey-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
        .survey-card { display: flex; flex-direction: column; padding: 0; overflow: hidden; cursor: pointer; }
        .survey-card.agent { border-color: #8b5cf6; }
        .survey-card-body { padding: 1.5rem; flex: 1; }

        .survey-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.6rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          background: var(--primary-light);
          color: var(--primary);
          margin-bottom: 1rem;
        }
        .survey-card.agent .survey-badge { background: rgba(139, 92, 246, 0.1); color: #7c3aed; }

        .survey-title { font-size: 1.1rem; font-weight: 700; margin: 0 0 0.5rem 0; color: var(--text-main); }
        .survey-desc { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .survey-meta { display: flex; align-items: center; gap: 0.75rem; font-size: 0.8rem; color: var(--text-muted); }
        .meta-item { display: flex; align-items: center; gap: 0.3rem; }

        .survey-card-actions { display: flex; justify-content: flex-end; gap: 0.5rem; padding: 1rem 1.5rem; background: var(--bg-main); border-top: 1px solid var(--border); }

        .empty-state { text-align: center; padding: 4rem 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .empty-icon { color: var(--text-muted); opacity: 0.5; }

        @media (max-width: 768px) {
          .dashboard-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .content-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .search-wrapper { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Home;