import { useEffect, useRef } from 'react';
import { useTituloPagina } from '@/hooks/useTituloPagina.js';

// Al cambiar de ruta el foco pasa al título: el lector de pantalla anuncia la vista nueva.
export default function EncabezadoPagina({ titulo, descripcion, acciones }) {
  const tituloRef = useRef(null);
  useTituloPagina(titulo);

  useEffect(() => {
    tituloRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, []);

  return (
    <header className="encabezado-pagina">
      <div>
        <h1 ref={tituloRef} tabIndex={-1}>
          {titulo}
        </h1>
        {descripcion && <p>{descripcion}</p>}
      </div>
      {acciones && <div className="encabezado-pagina__acciones">{acciones}</div>}
    </header>
  );
}
