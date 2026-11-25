import { useState } from 'react';
import Boton from '@/components/ui/Boton.jsx';
import BotonIcono from '@/components/ui/BotonIcono.jsx';
import Buscador from '@/components/ui/Buscador.jsx';
import DialogoConfirmacion from '@/components/ui/DialogoConfirmacion.jsx';
import Filtros from '@/components/ui/Filtros.jsx';
import { IconEditar, IconEliminar, IconLupa, IconMas } from '@/components/ui/Iconos.jsx';
import Insignia from '@/components/ui/Insignia.jsx';
import Modal from '@/components/ui/Modal.jsx';
import Paginacion from '@/components/ui/Paginacion.jsx';
import TablaDatos from '@/components/ui/TablaDatos.jsx';
import { useAviso } from '@/context/AvisoContext.jsx';
import { usePaginacion } from '@/hooks/usePaginacion.js';
import { useGestion } from '../hooks/useGestion.js';

const POR_PAGINA = 5;
const ESTADOS = [
  { valor: 'todos', texto: 'Todos' },
  { valor: 'activos', texto: 'Activos' },
  { valor: 'inactivos', texto: 'Inactivos' },
];
const NUEVO = {};

export default function CatalogoPanel({ tipo }) {
  const {
    filtrados,
    guardar,
    eliminar,
    cambiarActivo,
    busqueda,
    setBusqueda,
    estado,
    setEstado,
    limpiar,
  } = useGestion(tipo.id);
  const { visibles, ...paginacion } = usePaginacion(filtrados, POR_PAGINA);
  const { notificar } = useAviso();
  const [editando, setEditando] = useState(null);
  const [porEliminar, setPorEliminar] = useState(null);
  const { Formulario, singular } = tipo;
  const esNuevo = editando === NUEVO;

  const alGuardar = async (datos) => {
    await guardar(datos);
    setEditando(null);
    notificar(`Guardamos la ${singular} ${datos.nombre}.`);
  };
  const alEliminar = async () => {
    await eliminar(porEliminar.id);
    notificar(`Eliminamos la ${singular} ${porEliminar.nombre}.`);
  };
  const alDesactivar = async () => {
    await cambiarActivo(porEliminar.id, false);
    notificar(`Desactivamos la ${singular} ${porEliminar.nombre}.`);
  };

  const columnas = [
    {
      clave: 'nombre',
      titulo: 'Nombre',
      render: (registro) => (
        <>
          {registro.nombre}
          <small>{tipo.detalle(registro)}</small>
        </>
      ),
    },
    tipo.columna,
    {
      clave: 'activo',
      titulo: 'Estado',
      render: ({ activo }) => (
        <Insignia tono={activo ? 'exito' : 'neutro'}>{activo ? 'Activa' : 'Inactiva'}</Insignia>
      ),
    },
  ];

  return (
    <>
      <div className="herramientas">
        <Buscador etiqueta={`Buscar ${singular}`} valor={busqueda} onCambiar={setBusqueda} />
        <Filtros
          etiqueta="Filtrar por estado"
          opciones={ESTADOS}
          valor={estado}
          onCambiar={setEstado}
        />
        <Boton icono={IconMas} onClick={() => setEditando(NUEVO)}>
          Nueva {singular}
        </Boton>
      </div>

      <TablaDatos
        titulo={tipo.texto}
        columnas={columnas}
        filas={visibles}
        vacio={{
          icono: IconLupa,
          titulo: 'No hay coincidencias',
          mensaje: 'Prueba con otra palabra o con otro estado.',
          accion: (
            <Boton variante="secundario" onClick={limpiar}>
              Quitar filtros
            </Boton>
          ),
        }}
        acciones={(registro) => (
          <>
            <BotonIcono
              icono={IconEditar}
              etiqueta={`Editar ${registro.nombre}`}
              onClick={() => setEditando(registro)}
            />
            <BotonIcono
              icono={IconEliminar}
              tono="peligro"
              etiqueta={`Eliminar ${registro.nombre}`}
              onClick={() => setPorEliminar(registro)}
            />
          </>
        )}
        pie={<Paginacion {...paginacion} />}
      />

      {editando && (
        <Modal
          titulo={esNuevo ? `Nueva ${singular}` : `Editar ${singular}`}
          onCerrar={() => setEditando(null)}
        >
          <Formulario
            registro={esNuevo ? null : editando}
            onGuardar={alGuardar}
            onCancelar={() => setEditando(null)}
          />
        </Modal>
      )}

      {porEliminar && (
        <DialogoConfirmacion
          titulo={`¿Eliminar ${porEliminar.nombre}?`}
          mensaje="Se borra de la lista y no se puede recuperar."
          textoConfirmar={`Eliminar ${singular}`}
          textoCancelar="Conservar"
          alternativa={{ texto: 'Desactivar', accion: alDesactivar }}
          onConfirmar={alEliminar}
          onCerrar={() => setPorEliminar(null)}
        />
      )}
    </>
  );
}
