const AppError = require('../errors/AppError');

// Express reconoce el manejador de errores por sus cuatro parámetros.
// eslint-disable-next-line no-unused-vars
function manejarErrores(error, req, res, next) {
  if (error instanceof AppError) {
    return res.status(error.estadoHttp).json({ exito: false, mensaje: error.message });
  }
  console.error(error); // el detalle queda en el servidor, nunca en el cliente
  return res.status(500).json({ exito: false, mensaje: 'Error interno del servidor' });
}

module.exports = manejarErrores;
