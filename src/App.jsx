import React from 'react';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <div className="app-container">
      <Outlet />
      
      <style jsx="true">{`
        .app-container {
          min-height: 100vh;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default App;