import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { ArrowLeft, Mail, Lock, Sparkles, AlertCircle, UserPlus } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); 
    } catch (err) {
      setError('Kayıt başarısız: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* SOL TARAF - GÖRSEL (PC'de görünür, Mobilde gizlenir) */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="brand-logo">
            <Sparkles size={24} color="white" />
          </div>
          <span className="brand-text">AI Survey</span>
        </div>
        
        <div className="auth-visual-content">
          <h1 className="visual-title">Anketlerinizi<br />Yapay Zeka ile<br />Geleceğe Taşıyın.</h1>
          <p className="visual-subtitle">
            Kullanıcılarınızı sıkıcı formlarla değil, doğal bir sohbetle tanıyın. 
            Hemen kayıt olun ve akıllı analizlerin gücünü keşfedin.
          </p>
        </div>

        <div className="auth-glow glow-1"></div>
        <div className="auth-glow glow-2"></div>
      </div>

      {/* SAĞ TARAF - FORM */}
      <div className="auth-right">
        <div className="form-container">
          <button onClick={() => navigate('/')} className="btn-back" style={{ alignSelf: 'flex-start', marginBottom: '2rem' }}>
            <ArrowLeft size={16} /> Ana Sayfa
          </button>

          <div className="form-header">
            <h2>Yeni Hesap Oluştur <UserPlus size={24} style={{display:'inline', verticalAlign:'middle', marginLeft:'0.5rem', color:'var(--primary)'}}/></h2>
            <p>Hemen ücretsiz bir hesap açın ve ilk anketinizi oluşturun.</p>
          </div>
          
          {error && (
            <div className="auth-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="auth-form">
            <div className="input-group">
              <label>E-posta Adresi</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  placeholder="ornek@sirket.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Şifre</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={isLoading}>
              {isLoading ? "Hesap Oluşturuluyor..." : "Kayıt Ol"}
            </button>
          </form>

          <div className="auth-footer">
            <p>Zaten bir hesabınız var mı? <Link to="/login">Giriş Yap</Link></p>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .auth-page {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background: var(--bg-main);
        }

        /* --- SOL GÖRSEL --- */
        .auth-left {
          flex: 1;
          background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #db2777 100%);
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 3rem;
          color: white;
          overflow: hidden;
          justify-content: center;
        }

        .auth-brand {
          position: absolute;
          top: 2rem;
          left: 3rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          z-index: 10;
        }

        .brand-logo {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .brand-text {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .auth-visual-content {
          position: relative;
          z-index: 10;
          max-width: 480px;
        }

        .visual-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -1px;
        }

        .visual-subtitle {
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.9;
        }

        .auth-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          z-index: 1;
        }

        .glow-1 {
          width: 400px;
          height: 400px;
          background: rgba(236, 72, 153, 0.4);
          top: -100px;
          right: -100px;
        }

        .glow-2 {
          width: 500px;
          height: 500px;
          background: rgba(124, 58, 237, 0.4);
          bottom: -150px;
          left: -150px;
        }

        /* --- SAĞ FORM --- */
        .auth-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: var(--bg-main);
        }

        .form-container {
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
        }

        .form-header {
          margin-bottom: 2rem;
        }
        .form-header h2 {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }
        .form-header p {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .auth-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #fef2f2;
          color: #b91c1c;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid #fecaca;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .input-wrapper input {
          width: 100%;
          padding: 0.85rem 1rem 0.85rem 2.8rem;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: var(--text-main);
          font-size: 0.95rem;
          outline: none;
          transition: var(--transition);
        }

        .input-wrapper input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-light);
        }

        .auth-submit {
          padding: 1rem;
          font-size: 1rem;
          margin-top: 0.5rem;
        }

        .auth-footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.95rem;
          color: var(--text-muted);
        }

        .auth-footer a {
          color: var(--primary);
          font-weight: 700;
          text-decoration: none;
          transition: var(--transition);
        }

        .auth-footer a:hover {
          color: var(--primary-hover);
          text-decoration: underline;
        }

        /* --- MOBİL UYUMLULUK --- */
        @media (max-width: 768px) {
          .auth-left { display: none; }
          .auth-right { padding: 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default Register;