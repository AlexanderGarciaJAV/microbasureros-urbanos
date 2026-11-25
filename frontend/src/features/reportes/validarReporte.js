import {
  fotografia,
  longitud,
  numeroEntre,
  requerido,
  validarCampos,
} from '../../utils/validadores.js';

const ESQUEMA = {
  archivo: [fotografia()],
  latitud: [numeroEntre(-90, 90)],
  longitud: [numeroEntre(-180, 180)],
  categoriaId: [requerido('Elige el tipo de residuo.')],
  zonaId: [requerido('Elige la zona.')],
  descripcion: [requerido('Cuéntanos qué encontraste.'), longitud(10, 500)],
};

export const validarReporte = (formulario) => validarCampos(formulario, ESQUEMA);
