export const MUNICIPIOS = [
  { id: 1, nombre: 'San Alberto', departamento: 'Cesar' },
  { id: 2, nombre: 'Aguachica', departamento: 'Cesar' },
  { id: 3, nombre: 'Armenia', departamento: 'Quindío' },
];

// Valores del ENUM accion_limpieza.resultado.
export const RESULTADOS_LIMPIEZA = [
  { id: 'Limpieza_total', nombre: 'Limpieza total' },
  { id: 'Limpieza_parcial', nombre: 'Limpieza parcial' },
  { id: 'Sin_accion', nombre: 'No se pudo limpiar' },
];

export const TIPOS_FOTO = ['image/jpeg', 'image/png'];
export const TAMANO_MAXIMO_FOTO = 5 * 1024 * 1024;

export const obtenerMunicipio = (id) => MUNICIPIOS.find((municipio) => municipio.id === id);
export const obtenerResultado = (id) =>
  RESULTADOS_LIMPIEZA.find((resultado) => resultado.id === id)?.nombre ?? '';
