import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Loading from './Components/loading/loading';
import HomePage from './Pages/Home/index';
import NotFound from './Pages/Error/index';
import Dividas from './Components/FormDivida/Divida';
import Layout from './Components/Layout/compartilhado';
import Relatorio from './Pages/Relatorio/relatorio';

//https://legacy-reactjs-org.translate.goog/docs/code-splitting.html?_x_tr_sl=en&_x_tr_tl=pt&_x_tr_hl=pt&_x_tr_pto=tc&_x_tr_hist=true
// evitar de renderizar componente ser ser chamado.
// const NotFound = lazy(() => import('./Pages/Error/index'));
// const Dividas = lazy(() => import('./Pages/Dividas/index'));
// const Layout = lazy(() => import('./Components/Layout/compartilhado'));
// const Relatorio = lazy(() => import('./Pages/Relatorio/relatorio'));

export default function App() {
  return (
    <BrowserRouter>
      {/* <Suspense fallback={<Loading/>}> */}
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
      {/* </Suspense> */}
    </BrowserRouter>
  );
}
