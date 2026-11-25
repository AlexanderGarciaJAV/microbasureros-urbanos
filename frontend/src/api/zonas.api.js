import { normalizar, pluralizar } from '../utils/formatos.js';
import { crearCatalogoApi } from './crearCatalogoApi.js';

export const crearZonasApi = ({ zonas, reportes }) =>
  crearCatalogoApi({
    coleccion: zonas,
    reportes,
    llave: 'zonaId',
    esRepetido: (zona, datos) =>
      zona.municipioId === datos.municipioId &&
      normalizar(zona.nombre) === normalizar(datos.nombre) &&
      normalizar(zona.barrio) === normalizar(datos.barrio),
    textos: {
      repetido: 'Ya existe esa zona en el mismo barrio y municipio.',
      enUso: (total) =>
        `No se puede eliminar: tiene ${pluralizar(total, 'reporte', 'reportes')}. Puedes desactivarla para que no aparezca en reportes nuevos.`,
    },
  });
