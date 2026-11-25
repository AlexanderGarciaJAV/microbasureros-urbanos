import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Badge from '../components/Badge.jsx';
import Field from '../components/Field.jsx';
import { IconCheck, IconPin } from '../components/Icons.jsx';
import { useApp } from '../context/AppContext.jsx';
import { ESTADOS, MUNICIPIOS, OPERARIOS } from '../data/seed.js';
import mapaDetalle from '../assets/mapa-detalle.jpg';
import * as v from '../utils/validators.js';

const fmt = (iso) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export default function Tareas() {
  const { reportes, zonas, categorias, sesion, actualizarReporte, notificar } = useApp();
  const { id } = useParams();
  const navegar = useNavigate();

  const pendientes = reportes.filter(
    (r) =>
      (r.estadoId === 1 || r.estadoId === 2) &&
      (sesion.rol === 'administrador' || !r.operarioId || r.operarioId === sesion.operarioId)
  );
  const seleccionado = reportes.find((r) => String(r.id) === id) ?? pendientes[0];

  const [estadoId, setEstadoId] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (seleccionado) {
      setEstadoId(String(seleccionado.estadoId));
      setObservaciones(seleccionado.observaciones ?? '');
      setErrores({});
    }
  }, [seleccionado?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!seleccionado) {
    return (
      <section className="tarjeta vacio">
        <h1>Tareas Pendientes</h1>
        <p>No tienes reportes por atender. ¡Buen trabajo!</p>
      </section>
    );
  }

  const zona = zonas.find((z) => z.id === seleccionado.zonaId);
  const municipio = MUNICIPIOS.find((m) => m.id === zona?.municipioId);
  const categoria = categorias.find((c) => c.id === seleccionado.categoriaId);

  const guardar = (ev) => {
    ev.preventDefault();
    const nuevo = Number(estadoId);
    const e = {
      observaciones:
        nuevo !== seleccionado.estadoId || observaciones
          ? v.texto(observaciones, 10, 300, 'La observación')
          : '',
    };
    if (nuevo === 3 && !observaciones.trim())
      e.observaciones = 'Describe la acción de limpieza realizada para marcar como Resuelto.';
    setErrores(e);
    if (v.hayErrores(e)) return;
    actualizarReporte(seleccionado.id, {
      estadoId: nuevo,
      observaciones: observaciones.trim(),
      operarioId: seleccionado.operarioId ?? sesion.operarioId ?? OPERARIOS[0].id,
    });
    notificar(
      `Reporte ${seleccionado.codigo} actualizado a "${ESTADOS.find((s) => s.id === nuevo).nombre}".`
    );
  };

  return (
    <div className="tareas">
      <section className="tareas__detalle" aria-labelledby="titulo-tarea">
        <nav aria-label="Ruta de navegación" className="migas">
          <button type="button" className="enlace" onClick={() => navegar('/tareas')}>
            ← Volver a Tareas
          </button>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Reporte #{seleccionado.codigo}</span>
        </nav>

        <h1 id="titulo-tarea">{seleccionado.descripcion}</h1>

        <div className="rejilla-2">
          <article className="tarjeta tarjeta--media">
            <div className="media">
              <img src={seleccionado.foto} alt={`Fotografía del reporte ${seleccionado.codigo}`} />
            </div>
            <dl>
              <dt>Categoría</dt>
              <dd>{categoria?.nombre}</dd>
              <dt>Reportado el</dt>
              <dd>{fmt(seleccionado.fecha)}</dd>
            </dl>
          </article>
          <article className="tarjeta tarjeta--media">
            <div className="media">
              <img src={mapaDetalle} alt="Mapa con la ubicación exacta del reporte" />
            </div>
            <dl>
              <dt>Ubicación exacta</dt>
              <dd>
                <IconPin width={16} height={16} /> {zona ? `${zona.nombre}, ${zona.barrio}` : '—'} (
                {municipio?.nombre})
              </dd>
              <dt>Coordenadas</dt>
              <dd>
                {seleccionado.latitud}, {seleccionado.longitud}
              </dd>
            </dl>
          </article>
        </div>

        <form
          className="tarjeta"
          onSubmit={guardar}
          noValidate
          aria-labelledby="titulo-actualizacion"
        >
          <h2 id="titulo-actualizacion">Actualización Operativa</h2>
          <Field
            as="select"
            label="Estado de Resolución"
            name="estado"
            value={estadoId}
            onChange={(e) => setEstadoId(e.target.value)}
          >
            {ESTADOS.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </Field>
          <Field
            as="textarea"
            label="Observaciones del Operario"
            name="observaciones"
            rows={4}
            value={observaciones}
            onChange={(e) => {
              setObservaciones(e.target.value);
              setErrores({});
            }}
            error={errores.observaciones}
            maxLength={300}
            hint={`${observaciones.length}/300 caracteres.`}
            placeholder="Describe la acción de limpieza ejecutada (mínimo 10 caracteres)."
          />
          <div className="acciones">
            <button type="submit" className="btn btn--primario">
              <IconCheck /> Guardar actualización
            </button>
          </div>
        </form>
      </section>

      <aside className="tarjeta tareas__lista" aria-labelledby="titulo-pendientes">
        <h2 id="titulo-pendientes">
          Tareas Pendientes{' '}
          <span className="contador-insignia" aria-label={`${pendientes.length} tareas`}>
            {pendientes.length}
          </span>
        </h2>
        <ul>
          {pendientes.map((r) => {
            const z = zonas.find((x) => x.id === r.zonaId);
            return (
              <li key={r.id}>
                <button
                  type="button"
                  className={`tarea ${r.id === seleccionado.id ? 'tarea--activa' : ''}`}
                  aria-current={r.id === seleccionado.id ? 'true' : undefined}
                  onClick={() => navegar(`/tareas/${r.id}`)}
                >
                  <span className="tarea__fila">
                    <strong>{r.codigo}</strong>
                    <Badge
                      estadoId={r.estadoId}
                      nombre={ESTADOS.find((e) => e.id === r.estadoId).nombre}
                    />
                  </span>
                  <span className="tarea__titulo">{r.descripcion}</span>
                  <span className="tarea__zona">
                    <IconPin width={14} height={14} /> {z?.nombre}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}
