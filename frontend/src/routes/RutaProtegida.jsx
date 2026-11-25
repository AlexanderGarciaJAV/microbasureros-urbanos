import { Navigate, Outlet } from 'react-router-dom';
import Alerta from '@/components/ui/Alerta.jsx';
import Boton from '@/components/ui/Boton.jsx';
import Cargando from '@/components/ui/Cargando.jsx';
import { useAuth } from '@/context/AuthContext.jsx';
import { useDatos } from '@/context/DatosContext.jsx';
import { RUTAS, inicioDe, rolesDe } from './rutas.js';

// Exige sesión y rol, y resuelve en un solo lugar los estados de carga y de error.
export default function RutaProtegida({ ruta }) {
  const { sesion } = useAuth();
  const { estaCargando, errorCarga, cargar } = useDatos();
  if (!sesion) return <Navigate to={RUTAS.acceso} replace />;
  if (!rolesDe(ruta).includes(sesion.rol)) return <Navigate to={inicioDe(sesion.rol)} replace />;
  if (errorCarga) {
    return (
      <Alerta
        accion={
          <Boton variante="secundario" onClick={cargar}>
            Reintentar
          </Boton>
        }
      >
        {errorCarga}
      </Alerta>
    );
  }
  return estaCargando ? <Cargando /> : <Outlet />;
}
