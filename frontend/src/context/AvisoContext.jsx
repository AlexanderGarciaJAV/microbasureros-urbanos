import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const DURACION = 5000;
const AvisoContext = createContext(null);

export function AvisoProvider({ children }) {
  const [aviso, setAviso] = useState(null);

  const notificar = useCallback((mensaje, tono = 'exito') => {
    setAviso({ mensaje, tono, id: Date.now() });
  }, []);
  const cerrarAviso = useCallback(() => setAviso(null), []);

  useEffect(() => {
    if (!aviso) return undefined;
    const temporizador = setTimeout(() => setAviso(null), DURACION);
    return () => clearTimeout(temporizador);
  }, [aviso]);

  const valor = useMemo(() => ({ aviso, notificar, cerrarAviso }), [aviso, notificar, cerrarAviso]);
  return <AvisoContext.Provider value={valor}>{children}</AvisoContext.Provider>;
}

export const useAviso = () => useContext(AvisoContext);
