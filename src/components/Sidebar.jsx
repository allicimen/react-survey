import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { auth } from '../firebase';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  PlusCircle,
  Settings,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { path: '/dashboard', label: 'Panelim', icon: <LayoutDashboard size={20} /> },
    { path: '/create', label: 'Yeni Anket', icon: <PlusCircle size={20} /> },
    { path: '/settings', label: 'Ayarlar', icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    if (window.confirm("Çıkış yapmak istediğinize emin misiniz?")) {
      auth.signOut();
      navigate('/login');
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Logo />
        <span className="sidebar-title">AI Survey</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={toggleTheme} className="footer-btn">
          {theme === 'light'
            ? <><Moon size={16} /><span>Gece Modu</span></>
            : <><Sun size={16} /><span>Gündüz Modu</span></>
          }
        </button>
        <button onClick={handleLogout} className="footer-btn logout">
          <LogOut size={16} />
          <span>Çıkış Yap</span>
        </button>
      </div>

      <style jsx="true">{`
        .sidebar {
          width: var(--sidebar-width);
          background: var(--bg-sidebar);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-right: 1px solid var(--border);
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          z-index: 100;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
        }

        .sidebar-title {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.025em;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          text-decoration: none;
          color: var(--text-muted);
          border-radius: var(--radius-md);
          font-weight: 500;
          font-size: 0.9rem;
          transition: var(--transition);
        }

        .nav-item:hover {
          background: var(--primary-light);
          color: var(--primary);
        }

        .nav-item.active {
          background: var(--primary);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
        }

        .sidebar-footer {
          border-top: 1px solid var(--border);
          padding-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .footer-btn {
          width: 100%;
          padding: 0.75rem 1rem;
          border: none;
          background: transparent;
          color: var(--text-muted);
          border-radius: var(--radius-md);
          font-weight: 500;
          font-size: 0.85rem;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          transition: var(--transition);
        }

        .footer-btn:hover {
          background: var(--bg-main);
          color: var(--text-main);
        }

        .footer-btn.logout {
          color: #ef4444;
        }

        .footer-btn.logout:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
