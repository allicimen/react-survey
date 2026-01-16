// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';
import { getSurveys } from '../services/dbService'; 
import { auth } from '../firebase';
import { onAuthStateChanged, updateProfile } from "firebase/auth";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const { theme, toggleTheme } = useTheme();

  // State'ler
  const [userName, setUserName] = useState("Yükleniyor...");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false); 
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Görünürlük Kontrolü
  const isCustomerView = location.pathname.includes('/survey/');
  const isLandingPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const isCreatePage = location.pathname === '/create'; 

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const displayName = user.displayName || user.email.split('@')[0];
        setUserName(displayName);
      } else {
        setUserName("Misafir");
      }
    });
    return () => unsubscribe();
  }, []);

  if (isLandingPage || isLoginPage || isRegisterPage || isCreatePage) {
    return null;
  }

  // --- VERİ İNDİRME ---
  const handleExportData = async () => {
    setIsExporting(true); 
    try {
      const surveys = await getSurveys();
      if (!surveys || surveys.length === 0) {
        alert("İndirilecek veri bulunamadı.");
        setIsExporting(false);
        return;
      }
      const formattedData = JSON.stringify(surveys, null, 2);
      const blob = new Blob([formattedData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date();
      const dateStr = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
      a.download = `anket_yedek_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsSettingsOpen(false); 
    } catch (error) {
      console.error("Export hatası:", error);
      alert("Veri indirilirken bir hata oluştu.");
    } finally {
      setIsExporting(false);
    }
  };

  // --- PROFİL İŞLEMLERİ ---
  const handleNameChange = async () => {
    const newName = prompt("Yeni isminizi giriniz:", userName);
    if (newName && newName.trim() !== "") {
      try {
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName: newName });
        }
        setUserName(newName);
        setIsProfileOpen(false);
      } catch (error) {
        console.error("İsim değiştirme hatası:", error);
        alert("İsim değiştirilemedi.");
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm("Çıkış yapmak istediğinize emin misiniz?")) {
      auth.signOut(); 
      localStorage.removeItem('user_token'); 
      localStorage.removeItem('admin_name');
      navigate('/login'); 
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // --- STİLLER ---
  const navStyle = {
    backgroundColor: 'var(--nav-bg)',
    padding: isMobile ? '0 12px' : '0 24px', 
    height: '70px',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100,
    transition: 'background-color 0.3s ease, border-color 0.3s ease'
  };

  const navButtonStyle = {
    display: 'flex', alignItems: 'center', gap: '8px', 
    padding: isMobile ? '8px' : '8px 16px', 
    borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '500',
    color: 'var(--text-secondary)',
    transition: 'all 0.2s ease', cursor: 'pointer', userSelect: 'none'
  };

  const dropdownStyle = {
    position: 'absolute', top: '50px', right: '0', width: '220px',
    backgroundColor: 'var(--bg-card)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--border-color)',
    padding: '8px',
    display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 1000
  };

  const menuItemStyle = {
    padding: '10px 12px', fontSize: '14px', fontWeight: '500', 
    color: 'var(--text-main)',
    borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center',
    gap: '8px', transition: 'background-color 0.2s'
  };

  return (
    <nav style={navStyle}>
      <Link to={isCustomerView ? "#" : "/dashboard"} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px', textDecoration:'none' }}>
        <Logo />
        <span style={{ fontSize: isMobile ? '18px' : '20px', fontWeight:'700', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
          AI Survey
        </span>
      </Link>

      {!isCustomerView && (
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '12px' }}>
            
           <Link to="/dashboard" style={{
               ...navButtonStyle, 
               backgroundColor: location.pathname === '/dashboard' ? 'var(--bg-hover)' : 'transparent',
               color: location.pathname === '/dashboard' ? 'var(--primary-color)' : 'var(--text-secondary)'
           }}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
             {!isMobile && <span>Panelim</span>}
           </Link>
           
           <div style={{ position: 'relative' }}>
             <div onClick={() => { setIsSettingsOpen(!isSettingsOpen); setIsProfileOpen(false); }}
               style={{
                   ...navButtonStyle, 
                   backgroundColor: isSettingsOpen ? 'var(--bg-hover)' : 'transparent',
                   color: isSettingsOpen ? 'var(--text-main)' : 'var(--text-secondary)'
               }}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.18-.08a2 2 0 0 0-2 0l-.45.45a2 2 0 0 0 0 2l.08.18a2 2 0 0 1 0 2l-.25.43a2 2 0 0 1-1.73 1l-.18.2V12.22a2 2 0 0 0 2 2h.18a2 2 0 0 1 1.73 1l.25.43a2 2 0 0 1 0 2l.08.18a2 2 0 0 0 2 0l.45.45a2 2 0 0 0 2 0l.18.08a2 2 0 0 1 0 2l.43.25a2 2 0 0 1 1 1.73V22h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.18.08a2 2 0 0 0 2 0l.45-.45a2 2 0 0 0 0-2l-.08-.18a2 2 0 0 1 0-2l.25-.43a2 2 0 0 1 1.73-1l.18-.2V11.78a2 2 0 0 0-2-2h-.18a2 2 0 0 1-1.73-1l-.25-.43a2 2 0 0 1 0-2l-.08-.18a2 2 0 0 0-2 0l-.45-.45a2 2 0 0 0-2 0l-.18-.08a2 2 0 0 1 0-2l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
               {!isMobile && <span>Ayarlar</span>}
             </div>

             {isSettingsOpen && (
               <div style={dropdownStyle}>
                 <div onClick={toggleTheme} style={menuItemStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                   {theme === 'light' ? 'Karanlık Mod' : 'Aydınlık Mod'}
                 </div>
                 <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }}></div>
                 <div 
                   onClick={!isExporting ? handleExportData : null} 
                   style={{...menuItemStyle, opacity: isExporting ? 0.5 : 1, cursor: isExporting ? 'default' : 'pointer'}} 
                   onMouseOver={(e) => !isExporting && (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')} 
                   onMouseOut={(e) => !isExporting && (e.currentTarget.style.backgroundColor = 'transparent')}
                 >
                   {isExporting ? 'İndiriliyor...' : 'Verileri İndir'}
                 </div>
               </div>
             )}
           </div>

           <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 8px' }}></div>
           
           <div style={{ position: 'relative' }}>
             <div onClick={() => { setIsProfileOpen(!isProfileOpen); setIsSettingsOpen(false); }}
               style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', transition: '0.2s', backgroundColor: isProfileOpen ? 'var(--bg-hover)' : 'transparent', userSelect: 'none'}}>
               <div style={{width:'36px', height:'36px', borderRadius:'50%', background:'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'600'}}>
                 {getInitials(userName)}
               </div>
               {!isMobile && (
                   <div style={{ display: 'flex', flexDirection: 'column' }}>
                     <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>{userName}</span>
                     <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Admin</span>
                   </div>
               )}
               <span style={{ fontSize: '10px', color: 'var(--text-secondary)', marginLeft: '4px' }}>▼</span>
             </div>

             {isProfileOpen && (
               <div style={dropdownStyle}>
                 <div style={{padding:'10px', borderBottom:'1px solid #eee', fontWeight:'bold', color:'#2563eb', fontSize:'13px'}}>
                    {userName}
                 </div>
                 <div onClick={handleNameChange} style={menuItemStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                   İsim Değiştir
                 </div>
                 <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }}></div>
                 <div onClick={handleLogout} style={{ ...menuItemStyle, color: '#ef4444' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                   Çıkış Yap
                 </div>
               </div>
             )}
           </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;