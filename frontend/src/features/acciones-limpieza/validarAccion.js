import { ESTADO } from '../../constants/estados.js';
import { longitud, requerido, validarCampos } from '../../utils/validadores.js';

const resueltoConLimpieza =
  () =>
  (estadoId, { resultado }) =>
    Number(estadoId) === ESTADO.RESUELTO && resultado === 'Sin_accion'
      ? 'Si no se pudo limpiar, el reporte no puede quedar Resuelto.'
      : '';

const ESQUEMA_ACCION = {
  resultado: [requerido('Elige el resultado de la limpieza.')],
  descripcion: [requerido('Describe lo que hiciste.'), longitud(10, 300)],
  estadoId: [requerido('Elige el estado del reporte.'), resueltoConLimpieza()],
};

const ESQUEMA_ESTADO = { estadoId: [requerido('Elige el nuevo estado.')] };

export const validarAccion = (formulario) => validarCampos(formulario, ESQUEMA_ACCION);
export const validarCambioEstado = (formulario) => validarCampos(formulario, ESQUEMA_ESTADO);
