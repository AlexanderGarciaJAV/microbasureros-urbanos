// Único lugar donde se arman los servicios. Para conectar la API real se crea otra función
// que devuelva el mismo objeto; las vistas y los contextos no cambian.
import { crearAccionesApi } from './acciones.api.js';
import { crearAuthApi } from './auth.api.js';
import { crearCategoriasApi } from './categorias.api.js';
import { crearColeccion } from './crearColeccion.js';
import * as prueba from './datosPrueba.js';
import { crearReportesApi } from './reportes.api.js';
import { crearZonasApi } from './zonas.api.js';

export function crearServiciosMemoria({ espera = 0 } = {}) {
  const datos = {
    usuarios: crearColeccion(prueba.USUARIOS, espera),
    reportes: crearColeccion(prueba.REPORTES, espera),
    acciones: crearColeccion(prueba.ACCIONES, espera),
    historial: crearColeccion(prueba.HISTORIAL, espera),
    zonas: crearColeccion(prueba.ZONAS, espera),
    categorias: crearColeccion(prueba.CATEGORIAS, espera),
  };
  return {
    auth: crearAuthApi(datos.usuarios),
    reportes: crearReportesApi(datos),
    acciones: crearAccionesApi(datos),
    zonas: crearZonasApi(datos),
    categorias: crearCategoriasApi(datos),
  };
}
