import { useState } from 'react';
import Field from '../components/Field.jsx';
import Modal from '../components/Modal.jsx';
import { IconEdit, IconPlus, IconSearch, IconTrash } from '../components/Icons.jsx';
import { useApp } from '../context/AppContext.jsx';
import { MUNICIPIOS } from '../data/seed.js';
import * as v from '../utils/validators.js';

const POR_PAGINA = 5;

export default function Gestion() {
  const {
    zonas,
    categorias,
    guardarZona,
    eliminarZona,
    guardarCategoria,
    eliminarCategoria,
    notificar,
  } = useApp();
  const [tipo, setTipo] = useState('zonas'); // 'zonas' | 'categorias'
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('todos');
  const [pagina, setPagina] = useState(1);
  const [editando, setEditando] = useState(null); // objeto en edición (o {} para nuevo)
  const [errores, setErrores] = useState({});
  const [aEliminar, setAEliminar] = useState(null);
  const [errorEliminar, setErrorEliminar] = useState('');

  const esZona = tipo === 'zonas';
  const items = (esZona ? zonas : categorias)
    .filter((x) => (estado === 'todos' ? true : estado === 'activo' ? x.activo : !x.activo))
    .filter((x) =>
      `${x.nombre} ${x.barrio ?? ''} ${x.descripcion ?? ''}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );
  const paginas = Math.max(1, Math.ceil(items.length / POR_PAGINA));
  const actual = Math.min(pagina, paginas);
  const visibles = items.slice((actual - 1) * POR_PAGINA, actual * POR_PAGINA);

  const abrirNuevo = () => {
    setErrores({});
    setEditando(
      esZona
        ? { nombre: '', barrio: '', municipioId: '1', activo: true }
        : { nombre: '', descripcion: '', activo: true }
    );
  };
  const abrirEditar = (x) => {
    setErrores({});
    setEditando({ ...x, municipioId: String(x.municipioId ?? '') });
  };

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setEditando((x) => ({ ...x, [name]: type === 'checkbox' ? checked : value }));
    if (errores[name]) setErrores((er) => ({ ...er, [name]: '' }));
  };

  const guardar = (ev) => {
    ev.preventDefault();
    const e = esZona
      ? {
          nombre: v.texto(editando.nombre, 3, 100, 'El nombre'),
          barrio: v.texto(editando.barrio, 3, 100, 'El barrio'),
          municipioId: editando.municipioId ? '' : 'Selecciona el municipio.',
        }
      : {
          nombre: v.texto(editando.nombre, 3, 80, 'El nombre'),
          descripcion: v.texto(editando.descripcion, 5, 200, 'La descripción'),
        };
    const lista = esZona ? zonas : categorias;
    const repetido = lista.some(
      (x) =>
        x.id !== editando.id &&
        x.nombre.trim().toLowerCase() === editando.nombre.trim().toLowerCase() &&
        (!esZona ||
          (x.barrio.trim().toLowerCase() === editando.barrio.trim().toLowerCase() &&
            x.municipioId === Number(editando.municipioId)))
    );
    if (!e.nombre && repetido)
      e.nombre = 'Ya existe un registro con ese nombre (restricción UNIQUE).';
    setErrores(e);
    if (v.hayErrores(e)) return;
    const datos = esZona
      ? {
          ...editando,
          nombre: editando.nombre.trim(),
          barrio: editando.barrio.trim(),
          municipioId: Number(editando.municipioId),
        }
      : { ...editando, nombre: editando.nombre.trim(), descripcion: editando.descripcion.trim() };
    (esZona ? guardarZona : guardarCategoria)(datos);
    notificar(
      `${esZona ? 'Zona' : 'Categoría'} ${editando.id ? 'actualizada' : 'creada'} correctamente.`
    );
    setEditando(null);
  };

  const confirmarEliminar = () => {
    const r = (esZona ? eliminarZona : eliminarCategoria)(aEliminar.id);
    if (!r.ok) return setErrorEliminar(r.error);
    notificar(`${esZona ? 'Zona' : 'Categoría'} eliminada.`);
    setAEliminar(null);
  };

  return (
    <section aria-labelledby="titulo-gestion">
      <div className="encabezado-pagina">
        <div>
          <h1 id="titulo-gestion">Gestión de Zonas y Categorías</h1>
          <p className="lead">
            Administra las áreas de cobertura y los tipos de incidentes reportables.
          </p>
        </div>
        <button type="button" className="btn btn--primario" onClick={abrirNuevo}>
          <IconPlus /> {esZona ? 'Nueva zona' : 'Nueva categoría'}
        </button>
      </div>

      <div className="pestanas pestanas--bloque" role="tablist" aria-label="Tipo de registro">
        {['zonas', 'categorias'].map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tipo === t}
            onClick={() => {
              setTipo(t);
              setPagina(1);
              setBusqueda('');
              setEstado('todos');
            }}
          >
            {t === 'zonas' ? 'Zonas geográficas' : 'Categorías de residuo'}
          </button>
        ))}
      </div>

      <div className="tarjeta filtros filtros--fila">
        <div className="buscador">
          <IconSearch />
          <label htmlFor="buscar" className="sr-only">
            Buscar por nombre
          </label>
          <input
            id="buscar"
            type="search"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPagina(1);
            }}
          />
        </div>
        <div className="filtro">
          <label htmlFor="f-estado-g">Estado:</label>
          <select
            id="f-estado-g"
            value={estado}
            onChange={(e) => {
              setEstado(e.target.value);
              setPagina(1);
            }}
          >
            <option value="todos">Todos</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      <div className="tarjeta tabla-contenedor">
        <table className="tabla">
          <caption className="sr-only">
            {esZona ? 'Zonas geográficas registradas' : 'Categorías de residuo registradas'}
          </caption>
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">{esZona ? 'Municipio' : 'Descripción'}</th>
              <th scope="col">Estado</th>
              <th scope="col" className="tabla__acciones">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {visibles.length === 0 && (
              <tr>
                <td colSpan={4} className="vacio-celda">
                  No se encontraron registros.
                </td>
              </tr>
            )}
            {visibles.map((x) => (
              <tr key={x.id} className={x.activo ? '' : 'fila--inactiva'}>
                <th scope="row" data-etiqueta="Nombre">
                  <span className="fila__titulo">{x.nombre}</span>
                  {esZona && <span className="fila__sub">Barrio {x.barrio}</span>}
                </th>
                <td data-etiqueta={esZona ? 'Municipio' : 'Descripción'}>
                  {esZona
                    ? `${MUNICIPIOS.find((m) => m.id === x.municipioId)?.nombre}, ${MUNICIPIOS.find((m) => m.id === x.municipioId)?.departamento}`
                    : x.descripcion}
                </td>
                <td data-etiqueta="Estado">
                  <span className={`pastilla ${x.activo ? 'pastilla--activa' : ''}`}>
                    {x.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="tabla__acciones" data-etiqueta="Acciones">
                  <button type="button" className="btn-icono" onClick={() => abrirEditar(x)}>
                    <IconEdit />
                    <span className="sr-only">Editar {x.nombre}</span>
                  </button>
                  <button
                    type="button"
                    className="btn-icono btn-icono--peligro"
                    onClick={() => {
                      setErrorEliminar('');
                      setAEliminar(x);
                    }}
                  >
                    <IconTrash />
                    <span className="sr-only">Eliminar {x.nombre}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="paginacion">
          <p aria-live="polite">
            Mostrando {items.length === 0 ? 0 : (actual - 1) * POR_PAGINA + 1} a{' '}
            {Math.min(actual * POR_PAGINA, items.length)} de {items.length} registros
          </p>
          <nav aria-label="Paginación">
            <ul>
              {Array.from({ length: paginas }, (_, i) => i + 1).map((n) => (
                <li key={n}>
                  <button
                    type="button"
                    className={n === actual ? 'activo' : ''}
                    aria-current={n === actual ? 'page' : undefined}
                    onClick={() => setPagina(n)}
                  >
                    {n}
                    <span className="sr-only"> (página)</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {editando && (
        <Modal
          titulo={`${editando.id ? 'Editar' : 'Nueva'} ${esZona ? 'zona' : 'categoría'}`}
          onCerrar={() => setEditando(null)}
        >
          <form onSubmit={guardar} noValidate>
            <Field
              label="Nombre"
              name="nombre"
              value={editando.nombre}
              onChange={cambiar}
              error={errores.nombre}
              maxLength={100}
              required
            />
            {esZona ? (
              <>
                <Field
                  label="Barrio"
                  name="barrio"
                  value={editando.barrio}
                  onChange={cambiar}
                  error={errores.barrio}
                  maxLength={100}
                  required
                />
                <Field
                  as="select"
                  label="Municipio"
                  name="municipioId"
                  value={editando.municipioId}
                  onChange={cambiar}
                  error={errores.municipioId}
                  required
                >
                  {MUNICIPIOS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre} ({m.departamento})
                    </option>
                  ))}
                </Field>
              </>
            ) : (
              <Field
                as="textarea"
                rows={3}
                label="Descripción"
                name="descripcion"
                value={editando.descripcion}
                onChange={cambiar}
                error={errores.descripcion}
                maxLength={200}
                required
              />
            )}
            <label className="check">
              <input type="checkbox" name="activo" checked={editando.activo} onChange={cambiar} />{' '}
              Activo (disponible al registrar reportes)
            </label>
            <div className="acciones">
              <button type="button" className="btn btn--outline" onClick={() => setEditando(null)}>
                Cancelar
              </button>
              <button type="submit" className="btn btn--primario">
                Guardar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {aEliminar && (
        <Modal titulo="Confirmar eliminación" onCerrar={() => setAEliminar(null)}>
          <p>
            ¿Seguro que deseas eliminar <strong>{aEliminar.nombre}</strong>? Esta acción no se puede
            deshacer.
          </p>
          {errorEliminar && (
            <div className="alerta alerta--error" role="alert">
              {errorEliminar}
            </div>
          )}
          <div className="acciones">
            <button type="button" className="btn btn--outline" onClick={() => setAEliminar(null)}>
              Cancelar
            </button>
            <button type="button" className="btn btn--peligro" onClick={confirmarEliminar}>
              Eliminar
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
