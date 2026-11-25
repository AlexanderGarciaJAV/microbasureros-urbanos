import { useEffect } from 'react';

// Cada ruta cambia el título de la pestaña para que el usuario y el lector de pantalla se ubiquen.
export function useTituloPagina(titulo) {
  useEffect(() => {
    document.title = `${titulo} | Limpieza Urbana`;
  }, [titulo]);
}
