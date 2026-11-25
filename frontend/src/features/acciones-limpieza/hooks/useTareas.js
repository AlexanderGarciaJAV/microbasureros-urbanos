import { ESTADO } from '@/constants/estados.js';
import { ROL } from '@/constants/roles.js';
import { useAuth } from '@/context/AuthContext.jsx';
import { useDatos } from '@/context/DatosContext.jsx';

const ABIERTOS = [ESTADO.PENDIENTE, ESTADO.EN_PROCESO];

/** El operario ve lo libre y lo suyo; la administración ve todo. */
export function useTareas(idSeleccionado) {
  const { reportes } = useDatos();
  const { sesion } = useAuth();
  const esAdministrador = sesion.rol === ROL.ADMINISTRADOR;
  const permitidos = reportes.filter(
    (reporte) => esAdministrador || !reporte.operarioId || reporte.operarioId === sesion.operarioId
  );
  // Primero lo más antiguo: es lo que lleva más tiempo esperando.
  const tareas = permitidos
    .filter((reporte) => ABIERTOS.includes(reporte.estadoId))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
  const cerrados = permitidos.filter((reporte) => !ABIERTOS.includes(reporte.estadoId));
  const seleccionado = permitidos.find((reporte) => String(reporte.id) === idSeleccionado) ?? null;
  return { tareas, cerrados, seleccionado, esAdministrador };
}
