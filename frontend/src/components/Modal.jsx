import { useEffect, useRef } from 'react';
import { IconClose } from './Icons.jsx';

// Diálogo accesible: role="dialog", cierre con Escape y foco inicial dentro del diálogo.
export default function Modal({ titulo, onCerrar, children }) {
  const ref = useRef(null);
  const cerrarRef = useRef(onCerrar);
  cerrarRef.current = onCerrar;

  useEffect(() => {
    const previo = document.activeElement;
    ref.current?.querySelector('input, select, textarea')?.focus();
    const onKey = (e) => e.key === 'Escape' && cerrarRef.current();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previo?.focus?.();
    };
  }, []);

  return (
    <div className="modal__fondo" onMouseDown={(e) => e.target === e.currentTarget && onCerrar()}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        ref={ref}
      >
        <div className="modal__cabecera">
          <h2 id="modal-titulo">{titulo}</h2>
          <button type="button" className="btn-icono" onClick={onCerrar}>
            <IconClose />
            <span className="sr-only">Cerrar</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
