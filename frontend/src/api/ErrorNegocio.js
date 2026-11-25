// Equivale al AppError del backend: mensaje para el usuario y código HTTP.
export class ErrorNegocio extends Error {
  constructor(mensaje, codigo = 400, campo = null) {
    super(mensaje);
    this.name = 'ErrorNegocio';
    this.codigo = codigo;
    this.campo = campo;
  }
}
