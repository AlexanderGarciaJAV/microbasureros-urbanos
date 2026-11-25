import { useMemo, useState } from 'react';
import { ESTADOS } from '@/constants/estados.js';
import { useDatos } from '@/context/DatosContext.jsx';
import { useCatalogos } from '@/hooks/useCatalogos.js';
import { normalizar } from '@/utils/formatos.js';

/** Filtra los reportes del ciudadano por estado y por texto. */
export function useReportes() {
  const { reportes } = useDatos();
  const { nombreCategoria, nombreZona } = useCatalogos();
  const [estadoId, setEstadoId] = useState(0);
  const [busqueda, setBusqueda] = useState('');

  const filtrados = useMemo(() => {
    const texto = normalizar(busqueda);
    return reportes
      .filter((reporte) => !estadoId || reporte.estadoId === estadoId)
      .filter((reporte) =>
        normalizar(
          `${reporte.codigo} ${reporte.descripcion} ${nombreCategoria(reporte.categoriaId)} ${nombreZona(reporte.zonaId)}`
        ).includes(texto)
      );
  }, [reportes, estadoId, busqueda, nombreCategoria, nombreZona]);

  const opciones = [
    { valor: 0, texto: 'Todos', total: reportes.length },
    ...ESTADOS.map((estado) => ({
      valor: estado.id,
      texto: estado.nombre,
      total: reportes.filter((reporte) => reporte.estadoId === estado.id).length,
    })),
  ];

  return {
    filtrados,
    tieneReportes: reportes.length > 0,
    opciones,
    estadoId,
    setEstadoId,
    busqueda,
    setBusqueda,
  };
}
