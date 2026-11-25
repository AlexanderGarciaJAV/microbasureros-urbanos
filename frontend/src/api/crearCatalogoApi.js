// Zonas y categorías comparten operaciones; solo cambian sus reglas de unicidad y de uso.
import { ErrorNegocio } from './ErrorNegocio.js';

export function crearCatalogoApi({ coleccion, reportes, llave, esRepetido, textos }) {
  const verificarRepetido = async (datos, idActual) => {
    const registros = await coleccion.listar();
    if (registros.some((item) => item.id !== idActual && esRepetido(item, datos))) {
      throw new ErrorNegocio(textos.repetido, 409, 'nombre');
    }
  };

  return {
    listar: () => coleccion.listar(),

    async guardar(datos) {
      await verificarRepetido(datos, datos.id);
      return datos.id ? coleccion.actualizar(datos.id, datos) : coleccion.crear(datos);
    },

    async cambiarActivo(id, activo) {
      return coleccion.actualizar(id, { activo });
    },

    async eliminar(id) {
      const enUso = (await reportes.listar()).filter((reporte) => reporte[llave] === id).length;
      if (enUso > 0) throw new ErrorNegocio(textos.enUso(enUso), 409);
      return coleccion.eliminar(id);
    },
  };
}
