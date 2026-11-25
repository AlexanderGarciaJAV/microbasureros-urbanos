import { useEffect, useId, useRef } from 'react';
import BotonIcono from './BotonIcono.jsx';
import { IconCerrar } from './Iconos.jsx';

// Usa <dialog> nativo: el navegador atrapa el foco, bloquea el fondo y cierra con Escape.
export default function Modal({ titulo, onCerrar, children }) {
  const dialogoRef = useRef(null);
  const id = useId();

  useEffect(() => {
    const dialogo = dialogoRef.current;
    const previo = document.activeElement;
    dialogo.showModal();
    return () => {
      dialogo.close();
      previo?.focus?.();
    };
  }, []);

  const cerrarConEscape = (evento) => {
    evento.preventDefault();
    onCerrar();
  };

  return (
    <dialog ref={dialogoRef} className="modal" aria-labelledby={id} onCancel={cerrarConEscape}>
      <header className="modal__cabecera">
        <h2 id={id}>{titulo}</h2>
        <BotonIcono icono={IconCerrar} etiqueta="Cerrar" onClick={onCerrar} />
      </header>
      <div className="modal__cuerpo">{children}</div>
    </dialog>
  );
}
