import { Link, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Toast from './components/Toast.jsx';
import { useApp } from './context/AppContext.jsx';
import Auth, { inicioPorRol } from './pages/Auth.jsx';
import Estadisticas from './pages/Estadisticas.jsx';
import Gestion from './pages/Gestion.jsx';
import MisReportes from './pages/MisReportes.jsx';
import Reportar from './pages/Reportar.jsx';
import Tareas from './pages/Tareas.jsx';

// Ruta protegida: exige sesión y que el rol tenga permiso sobre la vista.
function Protegida({ roles }) {
  const { sesion } = useApp();
  if (!sesion) return <Navigate to="/" replace />;
  if (!roles.includes(sesion.rol)) return <Navigate to={inicioPorRol(sesion.rol)} replace />;
  return <Outlet />;
}

function NoEncontrada() {
  return (
    <section className="tarjeta vacio">
      <h1>Página no encontrada</h1>
      <p>La dirección que buscas no existe.</p>
      <Link to="/" className="btn btn--primario">
        Volver al inicio
      </Link>
    </section>
  );
}

export default function App() {
  return (
    <>
      <a className="saltar" href="#contenido">
        Saltar al contenido principal
      </a>
      <Header />
      <main id="contenido" className="principal" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route element={<Protegida roles={['ciudadano', 'administrador']} />}>
            <Route path="/reportar" element={<Reportar />} />
            <Route path="/mis-reportes" element={<MisReportes />} />
          </Route>
          <Route element={<Protegida roles={['operario', 'administrador']} />}>
            <Route path="/tareas" element={<Tareas />} />
            <Route path="/tareas/:id" element={<Tareas />} />
          </Route>
          <Route element={<Protegida roles={['administrador']} />}>
            <Route path="/gestion" element={<Gestion />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
          </Route>
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      <Toast />
      <Footer />
    </>
  );
}
