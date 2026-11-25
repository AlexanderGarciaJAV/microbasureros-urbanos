import { useMemo } from 'react';
import { obtenerMunicipio } from '@/constants/catalogos.js';
import { useDatos } from '@/context/DatosContext.jsx';

/** Traduce los ids de un reporte a los nombres que ve el usuario. */
export function useCatalogos() {
  const { zonas, categorias } = useDatos();
  return useMemo(() => {
    const nombreCategoria = (id) =>
      categorias.find((categoria) => categoria.id === id)?.nombre ?? 'Sin categoría';
    const nombreZona = (id) => {
      const zona = zonas.find((item) => item.id === id);
      return zona
        ? `${zona.nombre}, ${zona.barrio} (${obtenerMunicipio(zona.municipioId)?.nombre})`
        : 'Zona no disponible';
    };
    return { nombreCategoria, nombreZona };
  }, [zonas, categorias]);
}
