import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

// El servicio llega por propiedad: el contexto depende del contrato, no de una implementación.
export function AuthProvider({ servicio, children }) {
  const [sesion, setSesion] = useState(null);

  const iniciarSesion = useCallback(
    async (credenciales) => setSesion(await servicio.iniciarSesion(credenciales)),
    [servicio]
  );
  const registrarCiudadano = useCallback(
    async (datos) => setSesion(await servicio.registrarCiudadano(datos)),
    [servicio]
  );
  const cerrarSesion = useCallback(() => setSesion(null), []);

  const valor = useMemo(
    () => ({ sesion, iniciarSesion, registrarCiudadano, cerrarSesion }),
    [sesion, iniciarSesion, registrarCiudadano, cerrarSesion]
  );
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
