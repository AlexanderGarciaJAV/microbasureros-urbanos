import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { IconLeaf, IconMenu, IconClose } from './Icons.jsx';

const ENLACES = [
  { to: '/reportar', texto: 'Reportar', roles: ['ciudadano', 'administrador'] },
  { to: '/mis-reportes', texto: 'Mis Reportes', roles: ['ciudadano', 'administrador'] },
  { to: '/tareas', texto: 'Tareas', roles: ['operario', 'administrador'] },
  { to: '/gestion', texto: 'Zonas y Categorías', roles: ['administrador'] },
  { to: '/estadisticas', texto: 'Estadísticas', roles: ['administrador'] },
];

export default function Header() {
  const { sesion, cerrarSesion } = useApp();
  const [abierto, setAbierto] = useState(false);
  const navegar = useNavigate();
  const visibles = ENLACES.filter((e) => sesion && e.roles.includes(sesion.rol));

  const salir = () => {
    cerrarSesion();
    setAbierto(false);
    navegar('/');
  };

  return (
    <header className="header">
      <div className="header__barra">
        <Link
          to={sesion ? (visibles[0]?.to ?? '/') : '/'}
          className="marca"
          aria-label="Limpieza Urbana, ir al inicio"
        >
          <span className="marca__logo">
            <IconLeaf width={18} height={18} />
          </span>
          <span className="marca__texto">Limpieza Urbana</span>
        </Link>

        {sesion && (
          <>
            <button
              type="button"
              className="btn-menu"
              aria-expanded={abierto}
              aria-controls="menu-principal"
              onClick={() => setAbierto((v) => !v)}
            >
              {abierto ? <IconClose /> : <IconMenu />}
              <span className="sr-only">{abierto ? 'Cerrar menú' : 'Abrir menú'}</span>
            </button>

            <nav
              id="menu-principal"
              className={`nav ${abierto ? 'nav--abierto' : ''}`}
              aria-label="Navegación principal"
            >
              <ul>
                {visibles.map((e) => (
                  <li key={e.to}>
                    <NavLink
                      to={e.to}
                      onClick={() => setAbierto(false)}
                      className={({ isActive }) => (isActive ? 'activo' : '')}
                    >
                      {e.texto}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <div className="nav__usuario">
                <span className="nav__rol" title={sesion.nombre}>
                  <span className="avatar" aria-hidden="true">
                    {sesion.nombre.charAt(0)}
                  </span>
                  <span>
                    <strong>{sesion.nombre}</strong>
                    <small>{sesion.rol}</small>
                  </span>
                </span>
                <button type="button" className="btn btn--outline" onClick={salir}>
                  Cerrar sesión
                </button>
              </div>
            </nav>
          </>
        )}
      </div>
    </header>
  );
}
