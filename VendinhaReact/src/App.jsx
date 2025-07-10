import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from './Pages/Error/index';
import HomePage from './Pages/Home/index';
import Dividas from './Pages/Dividas/index';
import Layout from './Components/Layout/compartilhado';
import Relatorio from './Pages/Relatorio/relatorio';


export default function App() {

  return (
    <>
      <BrowserRouter>
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
    </BrowserRouter>
    </>
  )
}
