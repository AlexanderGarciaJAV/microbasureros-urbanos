import { useMemo, useState } from 'react';
import { useDatos } from '@/context/DatosContext.jsx';
import { normalizar } from '@/utils/formatos.js';

const POR_ESTADO = {
  todos: () => true,
  activos: (registro) => registro.activo,
  inactivos: (registro) => !registro.activo,
};

/** Datos, filtros y operaciones del catálogo elegido, con la misma forma para todos. */
export function useGestion(tipo) {
  const datos = useDatos();
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('todos');

  const catalogos = {
    zonas: {
      registros: datos.zonas,
      guardar: datos.guardarZona,
      eliminar: datos.eliminarZona,
      cambiarActivo: datos.cambiarActivoZona,
    },
    categorias: {
      registros: datos.categorias,
      guardar: datos.guardarCategoria,
      eliminar: datos.eliminarCategoria,
      cambiarActivo: datos.cambiarActivoCategoria,
    },
  };
  const { registros, ...operaciones } = catalogos[tipo];

  const filtrados = useMemo(() => {
    const texto = normalizar(busqueda);
    return registros
      .filter(POR_ESTADO[estado])
      .filter(({ nombre, barrio = '', descripcion = '' }) =>
        normalizar(`${nombre} ${barrio} ${descripcion}`).includes(texto)
      );
  }, [registros, estado, busqueda]);

  const limpiar = () => {
    setBusqueda('');
    setEstado('todos');
  };

  return { filtrados, ...operaciones, busqueda, setBusqueda, estado, setEstado, limpiar };
}
