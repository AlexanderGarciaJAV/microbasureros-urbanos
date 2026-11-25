import { IconLeaf } from './Icons.jsx';

export default function Footer() {
  const enlaces = ['Accesibilidad', 'Contacto', 'Privacidad', 'Transparencia'];
  return (
    <footer className="footer">
      <div className="footer__contenido">
        <span className="footer__marca">
          <IconLeaf width={16} height={16} /> Limpieza Urbana
        </span>
        <nav aria-label="Enlaces de pie de página">
          <ul>
            {enlaces.map((t) => (
              <li key={t}>
                <a href="#/" onClick={(e) => e.preventDefault()}>
                  {t}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p>© 2026 Gobierno Municipal - Dirección de Higiene Urbana</p>
      </div>
    </footer>
  );
}
