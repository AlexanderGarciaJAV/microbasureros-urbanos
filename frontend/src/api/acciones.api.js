import { ROL } from '../constants/roles.js';
import { ErrorNegocio } from './ErrorNegocio.js';

export const crearAccionesApi = ({ acciones, reportes }) => ({
  listar: () => acciones.listar(),

  async registrar({ reporteId, resultado, descripcion }, usuario) {
    if (usuario.rol !== ROL.OPERARIO) {
      throw new ErrorNegocio('Solo un operario registra acciones de limpieza.', 403);
    }
    const reporte = await reportes.obtener(reporteId);
    if (!reporte) throw new ErrorNegocio('El reporte ya no existe.', 404);
    if (reporte.operarioId && reporte.operarioId !== usuario.operarioId) {
      throw new ErrorNegocio('Este reporte lo atiende otro operario.', 409);
    }
    const accion = await acciones.crear({
      reporteId,
      resultado,
      descripcion: descripcion.trim(),
      operarioId: usuario.operarioId,
      autor: usuario.nombre,
      fecha: new Date().toISOString(),
    });
    await reportes.actualizar(reporteId, { operarioId: usuario.operarioId });
    return accion;
  },
});
