// Validaciones básicas de formularios: obligatoriedad, formato y longitud.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;

export const required = (v) => (String(v ?? '').trim() ? '' : 'Este campo es obligatorio.');

export const nombre = (v, etiqueta = 'El nombre') => {
  const t = String(v ?? '').trim();
  if (!t) return 'Este campo es obligatorio.';
  if (t.length < 2) return `${etiqueta} debe tener al menos 2 caracteres.`;
  if (t.length > 80) return `${etiqueta} no puede superar 80 caracteres.`;
  if (!SOLO_LETRAS.test(t)) return `${etiqueta} solo puede contener letras.`;
  return '';
};

export const correo = (v) => {
  const t = String(v ?? '').trim();
  if (!t) return 'Este campo es obligatorio.';
  if (t.length > 120) return 'El correo no puede superar 120 caracteres.';
  if (!EMAIL.test(t)) return 'Ingresa un correo válido, por ejemplo nombre@dominio.com.';
  return '';
};

export const clave = (v) => {
  const t = String(v ?? '');
  if (!t) return 'Este campo es obligatorio.';
  if (t.length < 8) return 'La contraseña debe tener mínimo 8 caracteres.';
  if (t.length > 64) return 'La contraseña no puede superar 64 caracteres.';
  if (!/[A-Za-z]/.test(t) || !/\d/.test(t)) return 'Debe combinar letras y números.';
  return '';
};

export const confirmar = (v, original) => {
  if (!v) return 'Este campo es obligatorio.';
  return v === original ? '' : 'Las contraseñas no coinciden.';
};

export const texto = (v, min, max, etiqueta = 'El texto') => {
  const t = String(v ?? '').trim();
  if (!t) return 'Este campo es obligatorio.';
  if (t.length < min) return `${etiqueta} debe tener al menos ${min} caracteres.`;
  if (t.length > max) return `${etiqueta} no puede superar ${max} caracteres.`;
  return '';
};

export const foto = (archivo) => {
  if (!archivo) return 'La fotografía es obligatoria.';
  if (!['image/jpeg', 'image/png'].includes(archivo.type)) return 'Formato no permitido: usa JPG o PNG.';
  if (archivo.size > 5 * 1024 * 1024) return 'La imagen supera el máximo de 5 MB.';
  return '';
};

export const hayErrores = (errores) => Object.values(errores).some(Boolean);
