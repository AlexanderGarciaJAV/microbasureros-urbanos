import { ROL } from '../constants/roles.js';
import { ErrorNegocio } from './ErrorNegocio.js';

// La contraseña nunca sale del servicio: la sesión solo lleva los datos públicos.
const publico = ({ contrasena, ...usuario }) => usuario;
const mismoCorreo = (correo) => (usuario) =>
  usuario.correo.toLowerCase() === correo.trim().toLowerCase();

export const crearAuthApi = (usuarios) => ({
  async iniciarSesion({ correo, contrasena }) {
    const usuario = (await usuarios.listar()).find(mismoCorreo(correo));
    if (!usuario || usuario.contrasena !== contrasena) {
      throw new ErrorNegocio(
        'El correo o la contraseña no coinciden. Revísalos e intenta de nuevo.',
        401
      );
    }
    return publico(usuario);
  },

  async registrarCiudadano({ nombre, apellido, correo, contrasena }) {
    const registrados = await usuarios.listar();
    if (registrados.some(mismoCorreo(correo))) {
      throw new ErrorNegocio('Ya existe una cuenta con este correo. Inicia sesión.', 409, 'correo');
    }
    const usuario = await usuarios.crear({
      nombre: `${nombre.trim()} ${apellido.trim()}`,
      correo: correo.trim(),
      contrasena,
      rol: ROL.CIUDADANO,
      ciudadanoId: 100 + registrados.length,
    });
    return publico(usuario);
  },
});
