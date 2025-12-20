import Home from './pages/Home';
import CreateSurvey from './pages/CreateSurvey';
import SurveyPreview from './pages/SurveyPreview';
import FillSurvey from './pages/FillSurvey';
import Results from './pages/Results';

// Rota listesini bir dizi (array) olarak tanımlıyoruz
const routes = [
  {
    path: '/',             // Anasayfa (localhost:5173/)
    element: <Home />,
    title: 'Anasayfa'
  },
  {
    path: '/create',       // Yeni Anket Oluşturma Sayfası
    element: <CreateSurvey />,
    title: 'Anket Oluştur'
  },
  {
    path: '/preview',      // Anket Önizleme Sayfası
    element: <SurveyPreview />,
    title: 'Önizleme'
  },
  {
    path: '/survey/:id',   // Anket Doldurma Sayfası (Her anketin ID'si farklı olacak)
    element: <FillSurvey />,
    title: 'Anketi Doldur'
  },
  {
    path: '/results/:id',  // Sonuç Sayfası
    element: <Results />,
    title: 'Sonuçlar'
  }
];

export default routes;