import { obtenerResultado } from '@/constants/catalogos.js';
import { obtenerEstado } from '@/constants/estados.js';
import { useDatos } from '@/context/DatosContext.jsx';

/** Une los cambios de estado y las acciones de limpieza de un reporte en una sola secuencia. */
export function useSeguimiento(reporteId) {
  const { historial, acciones } = useDatos();
  const cambios = historial
    .filter((registro) => registro.reporteId === reporteId)
    .map((registro) => {
      const estado = obtenerEstado(registro.estadoNuevo);
      return {
        id: `h${registro.id}`,
        fecha: registro.fecha,
        autor: registro.autor,
        tono: estado.tono,
        titulo: registro.estadoAnterior ? `Pasó a ${estado.nombre}` : 'Reporte registrado',
      };
    });
  const limpiezas = acciones
    .filter((accion) => accion.reporteId === reporteId)
    .map((accion) => ({
      id: `a${accion.id}`,
      fecha: accion.fecha,
      autor: accion.autor,
      tono: 'info',
      titulo: obtenerResultado(accion.resultado),
      detalle: accion.descripcion,
    }));
  return [...cambios, ...limpiezas].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
}
