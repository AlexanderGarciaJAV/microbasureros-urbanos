import { Link } from 'react-router-dom';
import { RUTAS } from '@/routes/rutas.js';

export default function PieDePagina() {
  return (
    <footer className="pie">
      <div className="pie__contenido">
        <p>Limpieza Urbana. Proyecto formativo ADSO, ficha 3336057, SENA.</p>
        <Link to={RUTAS.componentes}>Catálogo de componentes</Link>
      </div>
    </footer>
  );
}
