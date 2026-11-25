import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import EncabezadoPagina from '@/components/ui/EncabezadoPagina.jsx';
import EstadoVacio from '@/components/ui/EstadoVacio.jsx';
import { IconEscoba } from '@/components/ui/Iconos.jsx';
import LineaTiempo from '@/components/ui/LineaTiempo.jsx';
import { useAuth } from '@/context/AuthContext.jsx';
import { useAviso } from '@/context/AvisoContext.jsx';
import { useDatos } from '@/context/DatosContext.jsx';
import { useCatalogos } from '@/hooks/useCatalogos.js';
import { useSeguimiento } from '@/hooks/useSeguimiento.js';
import { obtenerEstado } from '@/constants/estados.js';
import { RUTAS } from '@/routes/rutas.js';
import { pluralizar } from '@/utils/formatos.js';
import AccionLimpiezaForm from '../components/AccionLimpiezaForm.jsx';
import EstadoForm from '../components/EstadoForm.jsx';
import FichaReporte from '../components/FichaReporte.jsx';
import ListaTareas from '../components/ListaTareas.jsx';
import { useTareas } from '../hooks/useTareas.js';

export default function TareasPage() {
  const { id } = useParams();
  const { sesion } = useAuth();
  const { notificar } = useAviso();
  const { cambiarEstado, registrarAccion } = useDatos();
  const { nombreCategoria, nombreZona } = useCatalogos();
  const { tareas, cerrados, seleccionado, esAdministrador } = useTareas(id);
  const eventos = useSeguimiento(seleccionado?.id);
  const listaRef = useRef(null);
  const detalleRef = useRef(null);
  const idPrevio = useRef(id);

  // En el celular la lista y el detalle se reemplazan: el foco acompaña a la parte visible.
  useEffect(() => {
    if (idPrevio.current === id) return;
    idPrevio.current = id;
    (id ? detalleRef : listaRef).current.focus();
  }, [id]);

  const guardarEstado = async ({ estadoId }) => {
    const nuevo = Number(estadoId);
    if (nuevo === seleccionado.estadoId) return;
    await cambiarEstado(seleccionado.id, nuevo);
    notificar(`${seleccionado.codigo} pasó a ${obtenerEstado(nuevo).nombre}.`);
  };
  const guardarAccion = async ({ resultado, descripcion, estadoId }) => {
    await registrarAccion({ reporteId: seleccionado.id, resultado, descripcion });
    notificar(`Guardamos la acción de limpieza de ${seleccionado.codigo}.`);
    await guardarEstado({ estadoId });
  };

  const tieneCambios = esAdministrador || tareas.some((tarea) => tarea.id === seleccionado?.id);
  const Formulario = esAdministrador ? EstadoForm : AccionLimpiezaForm;
  // La llave reinicia el formulario al cambiar de reporte o después de guardar.
  const llave = `${seleccionado?.id}-${seleccionado?.estadoId}-${eventos.length}`;

  return (
    <>
      <EncabezadoPagina
        titulo={esAdministrador ? 'Seguimiento de tareas' : 'Mis tareas'}
        descripcion={`${pluralizar(tareas.length, 'reporte abierto', 'reportes abiertos')}. Primero los más antiguos.`}
      />
      <div className={`tareas ${seleccionado ? 'tareas--con-detalle' : ''}`}>
        <section ref={listaRef} tabIndex={-1} className="tareas__lista" aria-label="Reportes">
          {tareas.length === 0 ? (
            <EstadoVacio
              icono={IconEscoba}
              titulo="No hay reportes por atender"
              mensaje="Cuando llegue uno nuevo aparecerá aquí."
            />
          ) : (
            <ListaTareas tareas={tareas} idActivo={seleccionado?.id} nombreZona={nombreZona} />
          )}
          {cerrados.length > 0 && (
            <details className="cerrados">
              <summary>Cerrados ({cerrados.length})</summary>
              <ListaTareas tareas={cerrados} idActivo={seleccionado?.id} nombreZona={nombreZona} />
            </details>
          )}
        </section>

        <div
          ref={detalleRef}
          tabIndex={-1}
          className="tareas__detalle"
          role="region"
          aria-label="Detalle del reporte"
        >
          {seleccionado ? (
            <>
              <Link to={RUTAS.tareas} className="volver">
                Volver a la lista
              </Link>
              <FichaReporte
                reporte={seleccionado}
                categoria={nombreCategoria(seleccionado.categoriaId)}
                zona={nombreZona(seleccionado.zonaId)}
              />
              {tieneCambios && (
                <Formulario
                  key={llave}
                  reporte={seleccionado}
                  rol={sesion.rol}
                  onGuardar={esAdministrador ? guardarEstado : guardarAccion}
                />
              )}
              <section className="tarjeta" aria-label="Seguimiento">
                <h2>Seguimiento</h2>
                <LineaTiempo eventos={eventos} />
              </section>
            </>
          ) : (
            <EstadoVacio
              icono={IconEscoba}
              titulo="Elige un reporte"
              mensaje="Selecciona un reporte de la lista para ver su detalle."
            />
          )}
        </div>
      </div>
    </>
  );
}
