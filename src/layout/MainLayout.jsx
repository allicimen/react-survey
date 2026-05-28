import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import PageTransition from '../components/PageTransition';

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="main-layout">
      <Sidebar />
      <main className="content-area">
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </main>

      <style jsx="true">{`
        .main-layout {
          display: flex;
          min-height: 100vh;
        }

        .content-area {
          flex: 1;
          margin-left: var(--sidebar-width);
          padding: 2rem;
          transition: var(--transition);
        }

        @media (max-width: 768px) {
          .content-area {
            margin-left: 0;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
