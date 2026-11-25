import { useState } from 'react';

export function usePaginacion(registros, porPagina) {
  const [pagina, setPagina] = useState(1);
  const totalPaginas = Math.max(1, Math.ceil(registros.length / porPagina));
  // Al filtrar o eliminar puede desaparecer la página en la que estaba el usuario.
  const actual = Math.min(pagina, totalPaginas);
  const inicio = (actual - 1) * porPagina;
  return {
    visibles: registros.slice(inicio, inicio + porPagina),
    pagina: actual,
    totalPaginas,
    desde: registros.length === 0 ? 0 : inicio + 1,
    hasta: Math.min(inicio + porPagina, registros.length),
    total: registros.length,
    irA: setPagina,
  };
}
