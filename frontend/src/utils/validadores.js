// Reglas de validación puras: no conocen React ni los formularios que las usan.
// Cada regla recibe el valor (y el formulario completo) y devuelve el mensaje de error o ''.
import { TAMANO_MAXIMO_FOTO, TIPOS_FOTO } from '../constants/catalogos.js';

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
const limpiar = (valor) => String(valor ?? '').trim();

export const requerido =
  (mensaje = 'Este campo es obligatorio.') =>
  (valor) =>
    limpiar(valor) ? '' : mensaje;

export const longitud = (minimo, maximo) => (valor) => {
  const total = limpiar(valor).length;
  if (total < minimo) return `Escribe al menos ${minimo} caracteres (llevas ${total}).`;
  if (total > maximo) return `Usa máximo ${maximo} caracteres (llevas ${total}).`;
  return '';
};

export const soloLetras = () => (valor) =>
  SOLO_LETRAS.test(limpiar(valor)) ? '' : 'Usa solo letras, sin números ni símbolos.';

export const formatoCorreo = () => (valor) =>
  CORREO.test(limpiar(valor)) ? '' : 'Revisa el correo. Ejemplo: nombre@dominio.com';

export const contrasenaSegura = () => (valor) =>
  /[A-Za-z]/.test(valor) && /\d/.test(valor) ? '' : 'Combina letras y números.';

export const igualA = (campo, mensaje) => (valor, formulario) =>
  valor === formulario[campo] ? '' : mensaje;

// Se exige texto antes de convertir: Number('') y Number('  ') dan 0, que es una coordenada válida.
export const numeroEntre = (minimo, maximo) => (valor) => {
  const texto = limpiar(valor).replace(',', '.');
  const numero = Number(texto);
  return texto && Number.isFinite(numero) && numero >= minimo && numero <= maximo
    ? ''
    : `Escribe un número entre ${minimo} y ${maximo}.`;
};

export const fotografia = () => (archivo) => {
  if (!archivo) return 'Agrega una fotografía del lugar.';
  if (!TIPOS_FOTO.includes(archivo.type)) return 'Ese archivo no sirve. Usa una imagen JPG o PNG.';
  if (archivo.size > TAMANO_MAXIMO_FOTO)
    return 'La imagen pesa más de 5 MB. Elige una más liviana.';
  return '';
};

/**
 * Aplica un esquema de reglas a un formulario.
 * @param {object} formulario valores actuales
 * @param {Record<string, Function[]>} esquema reglas por campo, en orden de prioridad
 * @returns {Record<string, string>} solo los campos con error
 */
export function validarCampos(formulario, esquema) {
  const errores = {};
  Object.entries(esquema).forEach(([campo, reglas]) => {
    for (const regla of reglas) {
      const mensaje = regla(formulario[campo], formulario);
      if (mensaje) {
        errores[campo] = mensaje;
        break;
      }
    }
  });
  return errores;
}
