import { Link, Route, Routes } from 'react-router-dom';
import EstadoVacio from '@/components/ui/EstadoVacio.jsx';
import AccesoPage from '@/features/auth/pages/AccesoPage.jsx';
import TareasPage from '@/features/acciones-limpieza/pages/TareasPage.jsx';
import ComponentesPage from '@/features/componentes/pages/ComponentesPage.jsx';
import EstadisticasPage from '@/features/estadisticas/pages/EstadisticasPage.jsx';
import GestionPage from '@/features/gestion/pages/GestionPage.jsx';
import MisReportesPage from '@/features/reportes/pages/MisReportesPage.jsx';
import NuevoReportePage from '@/features/reportes/pages/NuevoReportePage.jsx';
import RutaProtegida from './RutaProtegida.jsx';
import { RUTAS } from './rutas.js';

const PROTEGIDAS = [
  { ruta: RUTAS.nuevoReporte, pagina: <NuevoReportePage /> },
  { ruta: RUTAS.misReportes, pagina: <MisReportesPage /> },
  { ruta: RUTAS.tareas, pagina: <TareasPage />, hija: ':id' },
  { ruta: RUTAS.gestion, pagina: <GestionPage /> },
  { ruta: RUTAS.estadisticas, pagina: <EstadisticasPage /> },
];

export default function AppRouter() {
  return (
    <Routes>
      <Route path={RUTAS.acceso} element={<AccesoPage />} />
      <Route path={RUTAS.componentes} element={<ComponentesPage />} />
      {PROTEGIDAS.map(({ ruta, pagina, hija }) => (
        <Route key={ruta} path={ruta} element={<RutaProtegida ruta={ruta} />}>
          <Route index element={pagina} />
          {hija && <Route path={hija} element={pagina} />}
        </Route>
      ))}
      <Route
        path="*"
        element={
          <EstadoVacio
            titulo="Página no encontrada"
            mensaje="La dirección que buscas no existe o cambió de lugar."
            accion={
              <Link to={RUTAS.acceso} className="btn btn--primario">
                Volver al inicio
              </Link>
            }
          />
        }
      />
    </Routes>
  );
}
