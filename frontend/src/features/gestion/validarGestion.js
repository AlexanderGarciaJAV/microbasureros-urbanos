import { longitud, requerido, validarCampos } from '../../utils/validadores.js';

const ESQUEMA_ZONA = {
  nombre: [requerido(), longitud(3, 100)],
  barrio: [requerido(), longitud(3, 100)],
  municipioId: [requerido('Elige el municipio.')],
};

const ESQUEMA_CATEGORIA = {
  nombre: [requerido(), longitud(3, 80)],
  descripcion: [requerido(), longitud(5, 200)],
};

export const validarZona = (formulario) => validarCampos(formulario, ESQUEMA_ZONA);
export const validarCategoria = (formulario) => validarCampos(formulario, ESQUEMA_CATEGORIA);
