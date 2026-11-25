import { ESTADO, obtenerEstado, obtenerTransiciones } from '../constants/estados.js';
import { ROL } from '../constants/roles.js';
import { codigoReporte } from './datosPrueba.js';
import { ErrorNegocio } from './ErrorNegocio.js';

const puedeVer = (reporte, usuario) =>
  usuario.rol !== ROL.CIUDADANO || reporte.ciudadanoId === usuario.ciudadanoId;

export const crearReportesApi = ({ reportes, acciones, historial }) => ({
  async listar(usuario) {
    const lista = await reportes.listar();
    return lista.filter((reporte) => puedeVer(reporte, usuario)).reverse();
  },

  async crear(datos, usuario) {
    const nuevo = await reportes.crear({
      ...datos,
      fecha: new Date().toLocaleDateString('en-CA'),
      estadoId: ESTADO.PENDIENTE,
      ciudadanoId: usuario.ciudadanoId ?? null,
      operarioId: null,
    });
    const reporte = await reportes.actualizar(nuevo.id, { codigo: codigoReporte(nuevo.id) });
    await historial.crear({
      reporteId: reporte.id,
      estadoAnterior: null,
      estadoNuevo: ESTADO.PENDIENTE,
      fecha: new Date().toISOString(),
      autor: null,
    });
    return reporte;
  },

  /** Cambia el estado respetando las transiciones del rol y deja el registro en el historial. */
  async cambiarEstado(id, estadoNuevo, usuario) {
    const reporte = await reportes.obtener(id);
    if (!reporte) throw new ErrorNegocio('El reporte ya no existe.', 404);
    if (!obtenerTransiciones(usuario.rol, reporte.estadoId).includes(estadoNuevo)) {
      throw new ErrorNegocio(
        `No puedes pasar un reporte de ${obtenerEstado(reporte.estadoId).nombre} a ${obtenerEstado(estadoNuevo).nombre}.`,
        409,
        'estadoId'
      );
    }
    if (estadoNuevo === ESTADO.RESUELTO) {
      const tieneAccion = (await acciones.listar()).some((accion) => accion.reporteId === id);
      if (!tieneAccion) {
        throw new ErrorNegocio(
          'Falta una acción de limpieza. El operario debe registrarla antes de marcarlo como Resuelto.',
          409,
          'estadoId'
        );
      }
    }
    await historial.crear({
      reporteId: id,
      estadoAnterior: reporte.estadoId,
      estadoNuevo,
      fecha: new Date().toISOString(),
      autor: usuario.nombre,
    });
    return reportes.actualizar(id, { estadoId: estadoNuevo });
  },

  async listarHistorial() {
    return historial.listar();
  },
});
