// Datos ficticios alineados con el modelo relacional. Se reemplazan al conectar la API.
import { ESTADO } from '../constants/estados.js';
import { ROL } from '../constants/roles.js';

export const ZONAS = [
  { id: 1, nombre: 'Zona Centro', barrio: 'Centro', municipioId: 1, activo: true },
  { id: 2, nombre: 'Zona Norte', barrio: 'La Esperanza', municipioId: 1, activo: true },
  { id: 3, nombre: 'Zona Sur', barrio: 'El Progreso', municipioId: 1, activo: true },
  { id: 4, nombre: 'Ribera Quebrada', barrio: 'Villa Nueva', municipioId: 1, activo: true },
  { id: 5, nombre: 'Zona Centro', barrio: 'San José', municipioId: 2, activo: true },
  { id: 6, nombre: 'Zona Oriental', barrio: 'Los Almendros', municipioId: 2, activo: true },
  { id: 7, nombre: 'Zona Industrial', barrio: 'Quimbaya', municipioId: 3, activo: false },
];

export const CATEGORIAS = [
  { id: 1, nombre: 'Escombros', descripcion: 'Residuos de construcción y demolición' },
  { id: 2, nombre: 'Residuos orgánicos', descripcion: 'Restos de comida, poda y material vegetal' },
  { id: 3, nombre: 'Llantas', descripcion: 'Llantas y neumáticos en desuso' },
  { id: 4, nombre: 'Residuos domiciliarios', descripcion: 'Basura doméstica mezclada' },
  { id: 5, nombre: 'Voluminosos', descripcion: 'Muebles, colchones y electrodomésticos' },
].map((categoria) => ({ ...categoria, activo: true }));

const FILAS = [
  ['Montón de escombros en la esquina del parque', '2026-09-20', 7.7625, -73.3917, 1, 1, 1, 3],
  ['Basura acumulada junto al caño', '2026-09-22', 7.7681, -73.395, 2, 2, 4, 3],
  ['Llantas abandonadas en lote baldío', '2026-09-25', 7.759, -73.388, 3, 3, 3, 2],
  ['Restos de poda frente a la escuela', '2026-09-27', 7.764, -73.3935, 1, 1, 2, 3],
  ['Colchones y sillas en la vía principal', '2026-10-01', 7.7702, -73.3961, 4, 2, 5, 1],
  ['Escombros sobre la ribera de la quebrada', '2026-10-02', 7.7555, -73.3902, 5, 4, 1, 2],
  ['Basura domiciliaria tirada en la calle', '2026-10-03', 7.7611, -73.3925, 2, 1, 4, 4],
  ['Llantas apiladas detrás del taller', '2026-10-04', 8.308, -73.615, 6, 5, 3, 1],
  ['Material vegetal en el separador vial', '2026-10-05', 8.3112, -73.6098, 3, 6, 2, 3],
  ['Escombros de obra frente al colegio', '2026-10-06', 7.7668, -73.3944, 1, 2, 1, 1],
  ['Electrodomésticos viejos en zona industrial', '2026-10-07', 4.5339, -75.6811, 5, 7, 5, 2],
  ['Bolsas de basura en la esquina del mercado', '2026-10-08', 7.763, -73.391, 4, 1, 4, 1],
];

export const codigoReporte = (id) => `REP-${String(id).padStart(3, '0')}`;

export const REPORTES = FILAS.map(
  ([descripcion, fecha, latitud, longitud, ciudadanoId, zonaId, categoriaId, estadoId], indice) => {
    const tieneOperario = estadoId === ESTADO.EN_PROCESO || estadoId === ESTADO.RESUELTO;
    return {
      id: indice + 1,
      codigo: codigoReporte(indice + 1),
      descripcion,
      fecha,
      latitud,
      longitud,
      ciudadanoId,
      zonaId,
      categoriaId,
      estadoId,
      foto: null,
      operarioId: tieneOperario ? (indice % 3) + 1 : null,
    };
  }
);

export const ACCIONES = REPORTES.filter((reporte) => reporte.estadoId === ESTADO.RESUELTO).map(
  (reporte, indice) => ({
    id: indice + 1,
    reporteId: reporte.id,
    operarioId: reporte.operarioId,
    autor: 'Cuadrilla de aseo',
    fecha: `${reporte.fecha}T15:30:00`,
    resultado: 'Limpieza_total',
    descripcion: 'Se recogió el material y se barrió el punto.',
  })
);

// Historial coherente con el estado actual de cada reporte de prueba.
const RECORRIDO = { 1: [1], 2: [1, 2], 3: [1, 2, 3], 4: [1, 4] };
export const HISTORIAL = REPORTES.flatMap((reporte) =>
  RECORRIDO[reporte.estadoId].map((estadoNuevo, paso, recorrido) => ({
    reporteId: reporte.id,
    estadoAnterior: paso === 0 ? null : recorrido[paso - 1],
    estadoNuevo,
    fecha: `${reporte.fecha}T${String(8 + paso * 3).padStart(2, '0')}:00:00`,
    autor:
      paso === 0 ? null : estadoNuevo === ESTADO.RECHAZADO ? 'Administración' : 'Cuadrilla de aseo',
  }))
).map((registro, indice) => ({ ...registro, id: indice + 1 }));

// Cuentas de demostración: la autenticación real llega con MBU-10.
export const USUARIOS = [
  {
    id: 1,
    correo: 'laura.martinez@example.com',
    contrasena: 'Ciudadano123',
    rol: ROL.CIUDADANO,
    nombre: 'Laura Martínez',
    ciudadanoId: 1,
  },
  {
    id: 2,
    correo: 'jorge.salazar@aseo.example.com',
    contrasena: 'Operario123',
    rol: ROL.OPERARIO,
    nombre: 'Jorge Salazar',
    operarioId: 1,
  },
  {
    id: 3,
    correo: 'admin@microbasureros.example.com',
    contrasena: 'Admin12345',
    rol: ROL.ADMINISTRADOR,
    nombre: 'Administración Municipal',
  },
];
