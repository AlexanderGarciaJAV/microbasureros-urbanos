import { normalizar, pluralizar } from '../utils/formatos.js';
import { crearCatalogoApi } from './crearCatalogoApi.js';

export const crearCategoriasApi = ({ categorias, reportes }) =>
  crearCatalogoApi({
    coleccion: categorias,
    reportes,
    llave: 'categoriaId',
    esRepetido: (categoria, datos) => normalizar(categoria.nombre) === normalizar(datos.nombre),
    textos: {
      repetido: 'Ya existe una categoría con ese nombre.',
      enUso: (total) =>
        `No se puede eliminar: tiene ${pluralizar(total, 'reporte', 'reportes')}. Puedes desactivarla para que no aparezca en reportes nuevos.`,
    },
  });
