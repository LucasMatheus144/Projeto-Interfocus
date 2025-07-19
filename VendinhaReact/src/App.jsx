import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Loading from './Components/loading/loading';
import HomePage from './Pages/Home/index';
import NotFound from './Pages/Error/index';
import Layout from './Components/Layout/compartilhado';
import Relatorio from './Pages/Relatorio/relatorio';

//https://legacy-reactjs-org.translate.goog/docs/code-splitting.html?_x_tr_sl=en&_x_tr_tl=pt&_x_tr_hl=pt&_x_tr_pto=tc&_x_tr_hist=true
//evitar de renderizar componente até ser chamado.
const Dividas = lazy(() => import('./Pages/Dividas/index'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading/>}>
        <Routes>
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
