import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Firebase yolun farklıysa burayı düzelt

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Başarılıysa panele git
    } catch (err) {
      setError('Kayıt başarısız: ' + err.message);
    }
  };

  return (
    <div style={styles.container}>
      
      {/* KART YAPISI */}
      <div style={styles.card}>
        
        {/* 1. GERİ GİT BUTONU (Sol Üst) */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
            <button onClick={() => navigate('/')} style={styles.backButton}>
                ← Ana Sayfa
            </button>
        </div>

        <h2 style={styles.title}>Yeni Hesap Oluştur</h2>
        
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="email"
            placeholder="E-posta Adresi"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Kayıt Ol</button>
        </form>

        {/* 2. GİRİŞ YAP BUTONU (En Alt) */}
        <div style={styles.loginLinkContainer}>
            <p style={{ color: '#64748b' }}>Zaten bir hesabın var mı?</p>
            <Link to="/login" style={styles.link}>
                Giriş Yap
            </Link>
        </div>

      </div>
    </div>
  );
};

// --- CSS STİLLERİ (Mobil Uyumlu) ---
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px', // Çok geniş olmasın
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '20px',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '16px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box', // Taşmayı önler
  },
  button: {
    padding: '14px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    color: '#ef4444',
    marginBottom: '10px',
    fontSize: '14px',
  },
  loginLinkContainer: {
    marginTop: '25px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '20px',
    width: '100%',
  },
  link: {
    color: '#2563eb',
    fontWeight: '700',
    textDecoration: 'none',
    fontSize: '16px',
  }
};

export default Register;