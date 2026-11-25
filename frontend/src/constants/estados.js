// Ids iguales a los de la tabla estado_reporte de la base de datos.
export const ESTADO = { PENDIENTE: 1, EN_PROCESO: 2, RESUELTO: 3, RECHAZADO: 4 };

export const ESTADOS = [
  { id: ESTADO.PENDIENTE, nombre: 'Pendiente', tono: 'alerta' },
  { id: ESTADO.EN_PROCESO, nombre: 'En proceso', tono: 'info' },
  { id: ESTADO.RESUELTO, nombre: 'Resuelto', tono: 'exito' },
  { id: ESTADO.RECHAZADO, nombre: 'Rechazado', tono: 'neutro' },
];

// Transiciones del plan técnico. Solo el administrador rechaza o reabre un reporte.
const TRANSICIONES = {
  operario: {
    [ESTADO.PENDIENTE]: [ESTADO.EN_PROCESO],
    [ESTADO.EN_PROCESO]: [ESTADO.RESUELTO],
  },
  administrador: {
    [ESTADO.PENDIENTE]: [ESTADO.EN_PROCESO, ESTADO.RECHAZADO],
    [ESTADO.EN_PROCESO]: [ESTADO.RESUELTO, ESTADO.RECHAZADO],
    [ESTADO.RESUELTO]: [ESTADO.EN_PROCESO],
  },
};

/**
 * Estados a los que un rol puede mover un reporte.
 * @param {string} rol
 * @param {number} estadoId estado actual
 * @returns {number[]}
 */
export const obtenerTransiciones = (rol, estadoId) => TRANSICIONES[rol]?.[estadoId] ?? [];

export const obtenerEstado = (id) => ESTADOS.find((estado) => estado.id === id) ?? ESTADOS[0];
