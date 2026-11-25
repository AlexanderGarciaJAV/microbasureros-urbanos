import {
  contrasenaSegura,
  formatoCorreo,
  igualA,
  longitud,
  requerido,
  soloLetras,
  validarCampos,
} from '../../utils/validadores.js';

const NOMBRE = [requerido(), longitud(2, 80), soloLetras()];
const CORREO = [requerido(), formatoCorreo(), longitud(5, 120)];

const ESQUEMA_INGRESO = { correo: CORREO, contrasena: [requerido('Escribe tu contraseña.')] };

const ESQUEMA_REGISTRO = {
  nombre: NOMBRE,
  apellido: NOMBRE,
  correo: CORREO,
  contrasena: [requerido(), longitud(8, 64), contrasenaSegura()],
  confirmacion: [
    requerido('Repite la contraseña.'),
    igualA('contrasena', 'Las contraseñas no coinciden.'),
  ],
};

export const validarIngreso = (formulario) => validarCampos(formulario, ESQUEMA_INGRESO);
export const validarRegistro = (formulario) => validarCampos(formulario, ESQUEMA_REGISTRO);
