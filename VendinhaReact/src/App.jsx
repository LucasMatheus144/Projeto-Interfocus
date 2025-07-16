import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Lazy loading das páginas
const NotFound = lazy(() => import('./Pages/Error/index'));
const HomePage = lazy(() => import('./Pages/Home/index'));
const Dividas = lazy(() => import('./Pages/Dividas/index'));
const Layout = lazy(() => import('./Components/Layout/compartilhado'));
const Relatorio = lazy(() => import('./Pages/Relatorio/relatorio'));
const Loading = lazy(() => import('./Components/loading/loading') )

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading/>}>
        <Routes>
          {/* Layout persistente */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="dividas" element={<Dividas />} />
            <Route path="relatorios" element={<Relatorio />} />
          </Route>

          {/* 404 sem layout */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
