import { useMemo } from 'react';
import { ESTADO, ESTADOS, obtenerEstado } from '@/constants/estados.js';
import { useDatos } from '@/context/DatosContext.jsx';
import { useCatalogos } from '@/hooks/useCatalogos.js';

const ordenar = (datos) => datos.filter((dato) => dato.valor > 0).sort((a, b) => b.valor - a.valor);

/** Calcula los totales a partir de los reportes; la vista solo los muestra. */
export function useEstadisticas() {
  const { reportes, zonas, categorias } = useDatos();
  const { nombreCategoria, nombreZona } = useCatalogos();

  return useMemo(() => {
    const contar = (condicion) => reportes.filter(condicion).length;
    const total = reportes.length;
    const resueltos = contar((reporte) => reporte.estadoId === ESTADO.RESUELTO);
    return {
      total,
      resueltos,
      pendientes: contar((reporte) => reporte.estadoId === ESTADO.PENDIENTE),
      enProceso: contar((reporte) => reporte.estadoId === ESTADO.EN_PROCESO),
      porcentajeResuelto: total ? Math.round((resueltos / total) * 100) : 0,
      porEstado: ESTADOS.map((estado) => ({
        etiqueta: estado.nombre,
        tono: estado.tono,
        valor: contar((reporte) => reporte.estadoId === estado.id),
      })),
      porZona: ordenar(
        zonas.map((zona) => ({
          etiqueta: `${zona.nombre}, ${zona.barrio}`,
          valor: contar((reporte) => reporte.zonaId === zona.id),
        }))
      ),
      porCategoria: ordenar(
        categorias.map((categoria) => ({
          etiqueta: categoria.nombre,
          valor: contar((reporte) => reporte.categoriaId === categoria.id),
        }))
      ),
      recientes: [...reportes]
        .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id)
        .slice(0, 5),
      filasCsv: [
        ['codigo', 'fecha', 'zona', 'categoria', 'estado'],
        ...reportes.map((reporte) => [
          reporte.codigo,
          reporte.fecha,
          nombreZona(reporte.zonaId),
          nombreCategoria(reporte.categoriaId),
          obtenerEstado(reporte.estadoId).nombre,
        ]),
      ],
    };
  }, [reportes, zonas, categorias, nombreCategoria, nombreZona]);
}
