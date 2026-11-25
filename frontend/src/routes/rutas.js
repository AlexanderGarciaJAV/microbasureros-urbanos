import { ROL } from '@/constants/roles.js';
import {
  IconCamara,
  IconCapas,
  IconEscoba,
  IconGrafico,
  IconLista,
} from '@/components/ui/Iconos.jsx';

// Única definición de cada módulo: de aquí salen el menú y los permisos de las rutas.
export const RUTAS = {
  acceso: '/',
  componentes: '/componentes',
  nuevoReporte: '/reportar',
  misReportes: '/mis-reportes',
  tareas: '/tareas',
  gestion: '/gestion',
  estadisticas: '/estadisticas',
};

const { CIUDADANO, OPERARIO, ADMINISTRADOR } = ROL;

export const MODULOS = [
  { ruta: RUTAS.estadisticas, texto: 'Estadísticas', icono: IconGrafico, roles: [ADMINISTRADOR] },
  { ruta: RUTAS.nuevoReporte, texto: 'Reportar', icono: IconCamara, roles: [CIUDADANO] },
  { ruta: RUTAS.misReportes, texto: 'Mis reportes', icono: IconLista, roles: [CIUDADANO] },
  { ruta: RUTAS.tareas, texto: 'Tareas', icono: IconEscoba, roles: [OPERARIO, ADMINISTRADOR] },
  { ruta: RUTAS.gestion, texto: 'Zonas y categorías', icono: IconCapas, roles: [ADMINISTRADOR] },
];

export const modulosDe = (rol) => MODULOS.filter((modulo) => modulo.roles.includes(rol));
export const inicioDe = (rol) => modulosDe(rol)[0].ruta;
export const rolesDe = (ruta) => MODULOS.find((modulo) => modulo.ruta === ruta).roles;
