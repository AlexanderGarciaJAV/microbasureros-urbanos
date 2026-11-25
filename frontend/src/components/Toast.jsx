import { useApp } from '../context/AppContext.jsx';

// Región "live" para anunciar confirmaciones a lectores de pantalla.
export default function Toast() {
  const { aviso } = useApp();
  return (
    <div className="toast-zona" role="status" aria-live="polite">
      {aviso && <div className={`toast toast--${aviso.tipo}`}>{aviso.mensaje}</div>}
    </div>
  );
}
