// src/routes.jsx
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';

// Sayfalar
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import CreateSurvey from './pages/CreateSurvey';
import FillSurvey from './pages/FillSurvey';
import Results from './pages/Results';
import Login from './pages/Login';
import SurveyPreview from './pages/SurveyPreview';
import Register from './components/Register'; // <-- 1. Register'ı içeri aktardık

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    children: [
      { index: true, element: <LandingPage /> },
      
      { path: 'dashboard', element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> }, // <-- 2. Yeni Rota Eklendi
      
      { path: 'create', element: <CreateSurvey /> },
      { path: 'edit/:id', element: <CreateSurvey /> }, 

      { path: 'survey/:id', element: <FillSurvey /> },
      { path: 'results/:id', element: <Results /> },
      { path: 'preview/:id', element: <SurveyPreview /> },
    ],
  },
]);

export default router;