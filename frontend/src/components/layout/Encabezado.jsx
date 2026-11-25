import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Boton from '@/components/ui/Boton.jsx';
import { IconCerrar, IconHoja, IconMenu, IconSalir } from '@/components/ui/Iconos.jsx';
import { useAuth } from '@/context/AuthContext.jsx';
import { RUTAS, inicioDe, modulosDe } from '@/routes/rutas.js';

export default function Encabezado() {
  const { sesion, cerrarSesion } = useAuth();
  const [esAbierto, setEsAbierto] = useState(false);
  const navegar = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setEsAbierto(false), [pathname]);

  const salir = () => {
    cerrarSesion();
    navegar(RUTAS.acceso);
  };

  return (
    <header className="encabezado">
      <div className="encabezado__barra">
        <Link to={sesion ? inicioDe(sesion.rol) : RUTAS.acceso} className="marca">
          <span className="marca__logo">
            <IconHoja />
          </span>
          Limpieza Urbana
        </Link>
        {sesion && (
          <>
            <button
              type="button"
              className="btn-icono encabezado__menu"
              aria-expanded={esAbierto}
              aria-controls="menu-principal"
              onClick={() => setEsAbierto((valor) => !valor)}
            >
              {esAbierto ? <IconCerrar /> : <IconMenu />}
              <span className="sr-only">Menú</span>
            </button>
            <div id="menu-principal" className={`menu ${esAbierto ? 'menu--abierto' : ''}`}>
              <nav aria-label="Módulos">
                <ul>
                  {modulosDe(sesion.rol).map(({ ruta, texto, icono: Icono }) => (
                    <li key={ruta}>
                      <NavLink to={ruta}>
                        <Icono /> {texto}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="menu__usuario">
                <span className="avatar" aria-hidden="true">
                  {sesion.nombre.charAt(0)}
                </span>
                <span className="menu__nombre">
                  {sesion.nombre}
                  <small>{sesion.rol}</small>
                </span>
                <Boton variante="texto" icono={IconSalir} onClick={salir}>
                  Salir
                </Boton>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
