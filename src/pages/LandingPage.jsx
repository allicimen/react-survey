import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo'; 
import { Sparkles, Check } from 'lucide-react'; 
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
// ANA KAPLAYICI
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: 'transparent', // CSS'ten gelen gradient arka planını kullan
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden'
    }}>
      
      {/* 1. ÜST NAVBAR */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          padding: '24px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Logo Bölümü */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800', fontSize: '22px', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
          <Logo />
          AI Survey
        </div>

        {/* Sağ Butonlar */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/login" style={{ 
            textDecoration: 'none', color: 'var(--text-muted)', fontWeight: '600', transition: 'color 0.2s'
          }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>
            Giriş Yap
          </Link>
          
          <Link to="/register" style={{ 
            textDecoration: 'none', 
            backgroundColor: 'var(--bg-card)', 
            color: 'var(--primary)', 
            border: '1px solid var(--border)',
            fontWeight: '700', 
            padding: '10px 24px',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = 'var(--shadow-md)'; }}
          onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'var(--shadow-sm)'; }}
          >
            Kayıt Ol
          </Link>
        </div>
      </motion.nav>

      {/* 2. ORTA ALAN (HERO SECTION) */}
      <div style={{
        flex: 1, 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',     
        textAlign: 'center',      
        padding: '0 20px',
        position: 'relative',
        zIndex: 5
      }}>
        
        {/* Başlık */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          style={{ 
            fontSize: 'clamp(40px, 6vw, 72px)', 
            fontWeight: '800', 
            color: 'var(--text-main)', 
            margin: '0 0 24px 0',
            lineHeight: '1.1',
            maxWidth: '900px',
            letterSpacing: '-1.5px'
          }}
        >
          Anketlerinizi <span style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>Yapay Zeka</span> ile<br />
          Saniyeler İçinde Tasarlayın
        </motion.h1>

        {/* Alt Açıklama */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          style={{ 
            fontSize: 'clamp(16px, 2vw, 22px)', 
            color: 'var(--text-muted)', 
            maxWidth: '650px',
            margin: '0 0 48px 0',
            lineHeight: '1.6'
          }}
        >
          Sıkıcı formlarla uğraşmayı bırakın. Sadece konuyu söyleyin, yapay zeka sizin için en doğru soruları hazırlasın ve insanmış gibi sohbet ederek verileri toplasın.
        </motion.p>

        {/* DEV BUTON */}
        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(124, 58, 237, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/login')}
          style={{
            padding: '20px 48px',
            fontSize: '18px',
            fontWeight: '700',
            color: 'white',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))', 
            border: 'none',
            borderRadius: '50px', 
            cursor: 'pointer',
            boxShadow: 'var(--shadow-md)', 
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Sparkles size={20} /> AI ile Ücretsiz Başla
        </motion.button>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{ marginTop: '50px', display: 'flex', gap: '40px', color: 'var(--text-muted)', fontSize: '15px', fontWeight: '600' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '4px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={14} strokeWidth={3} />
            </span> Saniyeler İçinde Üret
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '4px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={14} strokeWidth={3} />
            </span> Yapay Zeka Ajanı
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '4px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={14} strokeWidth={3} />
            </span> Akıllı Analiz Raporları
          </span>
        </motion.div>

      </div>
    </div>
  );
};

export default LandingPage;