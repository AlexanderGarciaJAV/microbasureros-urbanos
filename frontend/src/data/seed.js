// Datos de ejemplo alineados con el modelo relacional de GA6-220501096-AA1-EV01
// (tablas estado_reporte, municipio, zona, categoria, ciudadano, operario, reporte).
// En esta etapa el frontend no se conecta a servicios: toda la información vive en memoria.

import fotoEscombros from '../assets/foto-escombros.jpg';
import fotoPoda from '../assets/foto-poda.jpg';
import fotoBache from '../assets/foto-bache.jpg';
import fotoContenedor from '../assets/foto-contenedor.jpg';

export const ESTADOS = [
  { id: 1, nombre: 'Pendiente', descripcion: 'Reporte registrado, sin atender' },
  { id: 2, nombre: 'En proceso', descripcion: 'Reporte en atención por un operario' },
  { id: 3, nombre: 'Resuelto', descripcion: 'Microbasurero limpiado' },
  { id: 4, nombre: 'Rechazado', descripcion: 'Reporte no procedente' },
];

export const MUNICIPIOS = [
  { id: 1, nombre: 'San Alberto', departamento: 'Cesar' },
  { id: 2, nombre: 'Aguachica', departamento: 'Cesar' },
  { id: 3, nombre: 'Armenia', departamento: 'Quindío' },
];

export const ZONAS_INICIALES = [
  { id: 1, nombre: 'Zona Centro', barrio: 'Centro', municipioId: 1, activo: true },
  { id: 2, nombre: 'Zona Norte', barrio: 'La Esperanza', municipioId: 1, activo: true },
  { id: 3, nombre: 'Zona Sur', barrio: 'El Progreso', municipioId: 1, activo: true },
  { id: 4, nombre: 'Ribera Quebrada', barrio: 'Villa Nueva', municipioId: 1, activo: true },
  { id: 5, nombre: 'Zona Centro', barrio: 'San José', municipioId: 2, activo: true },
  { id: 6, nombre: 'Zona Oriental', barrio: 'Los Almendros', municipioId: 2, activo: true },
  { id: 7, nombre: 'Zona Industrial', barrio: 'Quimbaya', municipioId: 3, activo: false },
];

export const CATEGORIAS_INICIALES = [
  { id: 1, nombre: 'Escombros', descripcion: 'Residuos de construcción y demolición', activo: true },
  { id: 2, nombre: 'Residuos orgánicos', descripcion: 'Restos de comida, poda y material vegetal', activo: true },
  { id: 3, nombre: 'Llantas', descripcion: 'Llantas y neumáticos en desuso', activo: true },
  { id: 4, nombre: 'Residuos domiciliarios', descripcion: 'Basura doméstica mezclada', activo: true },
  { id: 5, nombre: 'Voluminosos', descripcion: 'Muebles, colchones y electrodomésticos', activo: true },
];

export const CIUDADANOS = [
  { id: 1, nombre: 'Laura', apellido: 'Martínez', correo: 'laura.martinez@example.com' },
  { id: 2, nombre: 'Pedro', apellido: 'Ramírez', correo: 'pedro.ramirez@example.com' },
  { id: 3, nombre: 'Camila', apellido: 'Torres', correo: 'camila.torres@example.com' },
  { id: 4, nombre: 'Andrés', apellido: 'Gómez', correo: 'andres.gomez@example.com' },
  { id: 5, nombre: 'Valentina', apellido: 'Rojas', correo: 'valentina.rojas@example.com' },
  { id: 6, nombre: 'Diego', apellido: 'Castro', correo: 'diego.castro@example.com' },
];

export const OPERARIOS = [
  { id: 1, nombre: 'Jorge Salazar', cargo: 'Operario de aseo' },
  { id: 2, nombre: 'Marta Quintero', cargo: 'Conductora de volqueta' },
  { id: 3, nombre: 'Luis Herrera', cargo: 'Supervisor de cuadrilla' },
];

const FOTOS = [fotoEscombros, fotoPoda, fotoBache, fotoContenedor];

const base = [
  [1, 'Montón de escombros en la esquina del parque', '2026-09-20', 7.7625, -73.3917, 1, 1, 1, 3],
  [2, 'Basura acumulada junto al caño', '2026-09-22', 7.7681, -73.395, 2, 2, 4, 3],
  [3, 'Llantas abandonadas en lote baldío', '2026-09-25', 7.759, -73.388, 3, 3, 3, 2],
  [4, 'Restos de poda frente a la escuela', '2026-09-27', 7.764, -73.3935, 1, 1, 2, 3],
  [5, 'Colchones y sillas en la vía principal', '2026-10-01', 7.7702, -73.3961, 4, 2, 5, 1],
  [6, 'Escombros sobre la ribera de la quebrada', '2026-10-02', 7.7555, -73.3902, 5, 4, 1, 2],
  [7, 'Basura domiciliaria tirada en la calle', '2026-10-03', 7.7611, -73.3925, 2, 1, 4, 4],
  [8, 'Llantas apiladas detrás del taller', '2026-10-04', 8.308, -73.615, 6, 5, 3, 1],
  [9, 'Material vegetal en el separador vial', '2026-10-05', 8.3112, -73.6098, 3, 6, 2, 3],
  [10, 'Escombros de obra frente al colegio', '2026-10-06', 7.7668, -73.3944, 1, 2, 1, 1],
  [11, 'Electrodomésticos viejos en zona industrial', '2026-10-07', 4.5339, -75.6811, 5, 7, 5, 2],
  [12, 'Bolsas de basura en la esquina del mercado', '2026-10-08', 7.763, -73.391, 4, 1, 4, 1],
];

export const REPORTES_INICIALES = base.map(
  ([id, descripcion, fecha, latitud, longitud, ciudadanoId, zonaId, categoriaId, estadoId], i) => ({
    id,
    codigo: `REP-${String(id).padStart(3, '0')}`,
    descripcion,
    fecha,
    latitud,
    longitud,
    ciudadanoId,
    zonaId,
    categoriaId,
    estadoId,
    foto: FOTOS[i % FOTOS.length],
    observaciones: estadoId >= 2 ? 'Cuadrilla asignada para la atención del reporte.' : '',
    operarioId: estadoId >= 2 && estadoId !== 4 ? (i % 3) + 1 : null,
  }),
);

// Cuentas de demostración (no hay autenticación real hasta conectar el backend).
export const USUARIOS_DEMO = [
  { correo: 'laura.martinez@example.com', clave: 'Ciudadano123', rol: 'ciudadano', nombre: 'Laura Martínez', ciudadanoId: 1 },
  { correo: 'jorge.salazar@aseo.example.com', clave: 'Operario123', rol: 'operario', nombre: 'Jorge Salazar', operarioId: 1 },
  { correo: 'admin@microbasureros.example.com', clave: 'Admin12345', rol: 'administrador', nombre: 'Administrador Principal' },
];
