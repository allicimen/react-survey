import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; // updateProfile'i ekledik

const Register = () => {
  const [firstName, setFirstName] = useState(""); // İsim için hafıza
  const [lastName, setLastName] = useState("");   // Soyisim için hafıza
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı!");
      return;
    }

    try {
      // 1. Önce kullanıcıyı oluşturuyoruz
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Oluşan kullanıcının profiline İsim ve Soyismini ekliyoruz
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });

      setSuccess(`Kayıt Başarılı! Aramıza hoş geldin, ${firstName} 🎉`);
      
      // Kutucukları temizleyelim
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("Bu e-posta adresi zaten kayıtlı.");
      } else if (err.code === "auth/invalid-email") {
        setError("Geçersiz e-posta adresi.");
      } else {
        setError("Bir hata oluştu: " + err.message);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Kayıt Ol</h2>
        
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.row}>
            <input
              type="text"
              placeholder="Adınız"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={styles.halfInput}
              required
            />
            <input
              type="text"
              placeholder="Soyadınız"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={styles.halfInput}
              required
            />
          </div>

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
            placeholder="Şifre (En az 6 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Kayıt Ol
          </button>
        </form>
      </div>
    </div>
  );
};

// CSS Stilleri (Görseli biraz daha güzelleştirdim)
const styles = {
  container: { 
    display: "flex", justifyContent: "center", alignItems: "center", 
    height: "100vh", backgroundColor: "#f0f2f5", fontFamily: "Arial, sans-serif" 
  },
  card: { 
    backgroundColor: "white", padding: "2.5rem", borderRadius: "12px", 
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)", width: "400px", textAlign: "center" 
  },
  title: { marginBottom: "1.5rem", color: "#333", fontSize: "24px" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  row: { display: "flex", gap: "10px" }, // İsim ve Soyisim yan yana dursun diye
  halfInput: { 
    width: "50%", padding: "12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px" 
  },
  input: { 
    padding: "12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", width: "100%", boxSizing: "border-box" 
  },
  button: { 
    padding: "12px", backgroundColor: "#007bff", color: "white", border: "none", 
    borderRadius: "6px", cursor: "pointer", fontSize: "16px", fontWeight: "bold", marginTop: "10px",
    transition: "background 0.3s"
  },
  error: { color: "#dc3545", fontSize: "14px", marginBottom: "10px", backgroundColor: "#f8d7da", padding: "8px", borderRadius: "4px" },
  success: { color: "#28a745", fontSize: "14px", marginBottom: "10px", backgroundColor: "#d4edda", padding: "8px", borderRadius: "4px" }
};

export default Register;