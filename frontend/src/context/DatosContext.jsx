import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext.jsx';

const VACIO = { reportes: [], acciones: [], historial: [], zonas: [], categorias: [] };
const DatosContext = createContext(null);

// Estado compartido entre módulos: lo que se guarda en uno se refleja en los demás.
export function DatosProvider({ servicios, children }) {
  const { sesion } = useAuth();
  const [datos, setDatos] = useState(VACIO);
  const [estaCargando, setEstaCargando] = useState(false);
  const [errorCarga, setErrorCarga] = useState('');

  const consultar = useCallback(async () => {
    const [reportes, acciones, historial, zonas, categorias] = await Promise.all([
      servicios.reportes.listar(sesion),
      servicios.acciones.listar(),
      servicios.reportes.listarHistorial(),
      servicios.zonas.listar(),
      servicios.categorias.listar(),
    ]);
    setDatos({ reportes, acciones, historial, zonas, categorias });
  }, [servicios, sesion]);

  const cargar = useCallback(async () => {
    setEstaCargando(true);
    setErrorCarga('');
    try {
      await consultar();
    } catch {
      setErrorCarga('No pudimos cargar la información. Revisa tu conexión e intenta de nuevo.');
    } finally {
      setEstaCargando(false);
    }
  }, [consultar]);

  useEffect(() => {
    if (sesion) cargar();
    else setDatos(VACIO);
  }, [sesion, cargar]);

  const valor = useMemo(() => {
    // Ejecuta la operación y vuelve a consultar, para que todas las vistas muestren lo mismo.
    const conRecarga =
      (operacion) =>
      async (...argumentos) => {
        const resultado = await operacion(...argumentos);
        await consultar();
        return resultado;
      };
    return {
      ...datos,
      estaCargando,
      errorCarga,
      cargar,
      crearReporte: conRecarga((reporte) => servicios.reportes.crear(reporte, sesion)),
      cambiarEstado: conRecarga((id, estadoId) =>
        servicios.reportes.cambiarEstado(id, estadoId, sesion)
      ),
      registrarAccion: conRecarga((accion) => servicios.acciones.registrar(accion, sesion)),
      guardarZona: conRecarga(servicios.zonas.guardar),
      eliminarZona: conRecarga(servicios.zonas.eliminar),
      cambiarActivoZona: conRecarga(servicios.zonas.cambiarActivo),
      guardarCategoria: conRecarga(servicios.categorias.guardar),
      eliminarCategoria: conRecarga(servicios.categorias.eliminar),
      cambiarActivoCategoria: conRecarga(servicios.categorias.cambiarActivo),
    };
  }, [datos, estaCargando, errorCarga, cargar, consultar, servicios, sesion]);

  return <DatosContext.Provider value={valor}>{children}</DatosContext.Provider>;
}

export const useDatos = () => useContext(DatosContext);
