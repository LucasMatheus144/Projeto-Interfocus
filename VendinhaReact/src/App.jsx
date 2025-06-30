import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from './pages/Error/index';
import HomePage from './pages/Home/index';
import Dividas from './pages/Dividas/index';
import Layout from './Components/Layout/compartilhado';


export default function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        {/* Layout persistente */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="dividas" element={<Dividas />} />
        </Route>

        {/* 404 sem layout */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}
