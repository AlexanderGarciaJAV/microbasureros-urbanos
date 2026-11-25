import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/Badge.jsx';
import { IconCalendar, IconFilter, IconPin } from '../components/Icons.jsx';
import { useApp } from '../context/AppContext.jsx';
import { CATEGORIAS_INICIALES, ESTADOS } from '../data/seed.js';

const fmt = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
const POR_PAGINA = 6;

export default function MisReportes() {
  const { sesion, reportes, zonas, categorias } = useApp();
  const [filtro, setFiltro] = useState('');
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [limite, setLimite] = useState(POR_PAGINA);

  const propios = useMemo(
    () => reportes.filter((r) => sesion.rol === 'administrador' || r.ciudadanoId === sesion.ciudadanoId),
    [reportes, sesion],
  );
  const filtrados = propios.filter((r) => !filtro || r.estadoId === Number(filtro));
  const visibles = filtrados.slice(0, limite);
  const zona = (id) => zonas.find((z) => z.id === id);
  const categoria = (id) => (categorias.find((c) => c.id === id) ?? CATEGORIAS_INICIALES.find((c) => c.id === id))?.nombre ?? '';

  return (
    <section aria-labelledby="titulo-historial">
      <div className="encabezado-pagina">
        <div>
          <h1 id="titulo-historial">Mi Historial de Reportes</h1>
          <p className="lead">Consulta el estado y seguimiento de tus solicitudes ciudadanas.</p>
        </div>
        <button type="button" className="btn btn--gris" aria-expanded={mostrarFiltro} onClick={() => setMostrarFiltro((m) => !m)}>
          <IconFilter /> Filtrar
        </button>
      </div>

      {mostrarFiltro && (
        <div className="filtros tarjeta" role="group" aria-label="Filtros">
          <label htmlFor="f-estado">Estado</label>
          <select id="f-estado" value={filtro} onChange={(e) => { setFiltro(e.target.value); setLimite(POR_PAGINA); }}>
            <option value="">Todos</option>
            {ESTADOS.map((e) => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
        </div>
      )}

      <p className="contador" aria-live="polite">{filtrados.length} {filtrados.length === 1 ? 'reporte' : 'reportes'}</p>

      {visibles.length === 0 ? (
        <div className="vacio tarjeta">
          <p>No hay reportes para mostrar.</p>
          <Link to="/reportar" className="btn btn--primario">Registrar un reporte</Link>
        </div>
      ) : (
        <ul className="rejilla-tarjetas">
          {visibles.map((r) => {
            const estado = ESTADOS.find((e) => e.id === r.estadoId);
            const z = zona(r.zonaId);
            return (
              <li key={r.id} className="tarjeta-reporte">
                <div className="tarjeta-reporte__foto">
                  <img src={r.foto} alt={`Fotografía del reporte ${r.codigo}: ${categoria(r.categoriaId)}`} loading="lazy" />
                  <Badge estadoId={estado.id} nombre={estado.nombre} />
                </div>
                <div className="tarjeta-reporte__cuerpo">
                  <p className="meta">
                    <span><IconCalendar width={15} height={15} /> {fmt(r.fecha)}</span>
                    <span># {r.codigo}</span>
                  </p>
                  <h2>{r.descripcion}</h2>
                  <p className="ubicacion"><IconPin width={16} height={16} /> {z ? `${z.nombre}, ${z.barrio}` : 'Zona no disponible'}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {limite < filtrados.length && (
        <div className="centrado">
          <button type="button" className="btn btn--outline" onClick={() => setLimite((l) => l + POR_PAGINA)}>
            Cargar más reportes
          </button>
        </div>
      )}
    </section>
  );
}
