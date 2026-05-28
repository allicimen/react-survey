import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uygulama Hatası Yakalandı:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-card card">
            <div className="error-icon"><AlertTriangle size={64} strokeWidth={1.5} /></div>
            <h1>Bir Şeyler Ters Gitti</h1>
            <p>Beklenmedik bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin veya ana panele dönün.</p>
            <div className="error-actions">
              <button onClick={() => window.location.reload()} className="btn btn-primary">
                <RefreshCw size={16} /> Sayfayı Yenile
              </button>
              <a href="/dashboard" className="btn-back" style={{ marginTop: '1rem' }}>
                <ArrowLeft size={16} /> Panele Dön
              </a>
            </div>
          </div>

          <style jsx="true">{`
            .error-boundary-container {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: var(--bg-main);
              padding: 2rem;
            }
            .error-card {
              max-width: 500px;
              text-align: center;
              padding: 4rem 2rem;
              animation: scaleUp 0.3s ease-out;
            }
            .error-icon {
              font-size: 4rem;
              margin-bottom: 1.5rem;
              color: #f59e0b;
              display: flex;
              justify-content: center;
            }
            .error-card h1 { font-size: 1.75rem; font-weight: 800; margin-bottom: 1rem; }
            .error-card p { color: var(--text-muted); margin-bottom: 2.5rem; line-height: 1.6; }
            .error-actions { display: flex; flex-direction: column; align-items: center; }
            
            @keyframes scaleUp {
              from { transform: scale(0.9); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
