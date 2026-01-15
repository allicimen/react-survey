// src/pages/Login.jsx
import React, { useState } from "react";
import { auth } from "../firebase"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom"; // Link eklendi

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('user_token', userCredential.user.accessToken);
      navigate('/dashboard'); 
    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("E-posta veya şifre hatalı.");
      } else {
        setError("Hata: " + err.message);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Giriş Yap</h2>
        
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="E-posta Adresiniz"
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
          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'} // Hover efekti (Koyu mavi)
            onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}  // Normal renk
          >
            Giriş Yap
          </button>
        </form>

        {/* Alt Kısım: Kayıt Ol Yönlendirmesi */}
        <div style={{marginTop: '20px', fontSize: '14px', color: '#64748b'}}>
           Hesabın yok mu? <Link to="/register" style={{color: '#2563eb', fontWeight: '600', textDecoration: 'none'}}>Hemen Kayıt Ol</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f2f5", fontFamily: "'Inter', sans-serif" },
  card: { backgroundColor: "white", padding: "2.5rem", borderRadius: "12px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", width: "380px", textAlign: "center" },
  title: { marginBottom: "1.5rem", color: "#1e293b", fontSize: "24px", fontWeight: '700' },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", width: "100%", boxSizing: "border-box", outline: 'none' },
  // 👇 GÜNCELLENEN KISIM: Yeşil (#28a745) yerine Mavi (#2563eb) yapıldı
  button: { 
    padding: "12px", 
    backgroundColor: "#2563eb", 
    color: "white", 
    border: "none", 
    borderRadius: "8px", 
    cursor: "pointer", 
    fontSize: "16px", 
    fontWeight: "600", 
    marginTop: "10px", 
    transition: 'background-color 0.2s' 
  },
  error: { color: "#b91c1c", fontSize: "14px", marginBottom: "10px", backgroundColor: "#fef2f2", padding: "10px", borderRadius: "6px", border: '1px solid #fecaca' }
};

export default Login;