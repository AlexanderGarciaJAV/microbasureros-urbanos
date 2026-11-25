export const formatearFecha = (iso) =>
  new Date(iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export const formatearFechaHora = (iso) =>
  new Date(iso).toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

// Compara nombres sin distinguir mayúsculas, tildes ni espacios.
export const normalizar = (texto) =>
  String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();

export const pluralizar = (cantidad, singular, plural) =>
  `${cantidad} ${cantidad === 1 ? singular : plural}`;

// Acepta coma o punto decimal, como se escribe en Colombia.
export const aNumero = (texto) => {
  const limpio = String(texto ?? '')
    .trim()
    .replace(',', '.');
  return limpio === '' ? NaN : Number(limpio);
};
