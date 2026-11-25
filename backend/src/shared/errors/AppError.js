// Error esperado: se lanza a propósito cuando una regla de negocio no se cumple.
class AppError extends Error {
  constructor(mensaje, estadoHttp = 400) {
    super(mensaje);
    this.estadoHttp = estadoHttp;
  }
}

module.exports = AppError;
