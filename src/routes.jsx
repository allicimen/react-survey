import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';

// Layouts
import MainLayout from './layout/MainLayout';

// Sayfalar
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import CreateSurvey from './pages/CreateSurvey';
import FillSurvey from './pages/FillSurvey';
import Results from './pages/Results';
import Login from './pages/Login';
import SurveyPreview from './pages/SurveyPreview';
import Settings from './pages/Settings';
import Register from './components/Register';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },

      {
        element: <MainLayout />,
        children: [
          { path: 'dashboard', element: <Home /> },
          { path: 'create', element: <CreateSurvey /> },
          { path: 'edit/:id', element: <CreateSurvey /> },
          { path: 'results/:id', element: <Results /> },
          { path: 'settings', element: <Settings /> },
        ]
      },

      { path: 'survey/:id', element: <FillSurvey /> },
      { path: 'preview/:id', element: <SurveyPreview /> },
    ],
  },
]);

export default router;