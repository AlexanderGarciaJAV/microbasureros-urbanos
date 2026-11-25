import { useState } from 'react';
import Alerta from '@/components/ui/Alerta.jsx';
import Boton from '@/components/ui/Boton.jsx';
import BotonIcono from '@/components/ui/BotonIcono.jsx';
import CampoArea from '@/components/ui/CampoArea.jsx';
import CampoContrasena from '@/components/ui/CampoContrasena.jsx';
import CampoSeleccion from '@/components/ui/CampoSeleccion.jsx';
import CampoTexto from '@/components/ui/CampoTexto.jsx';
import EncabezadoPagina from '@/components/ui/EncabezadoPagina.jsx';
import EstadoVacio from '@/components/ui/EstadoVacio.jsx';
import Filtros from '@/components/ui/Filtros.jsx';
import { IconEditar, IconEliminar, IconEnviar, IconMas } from '@/components/ui/Iconos.jsx';
import Indicador from '@/components/ui/Indicador.jsx';
import Insignia from '@/components/ui/Insignia.jsx';
import Interruptor from '@/components/ui/Interruptor.jsx';
import Modal from '@/components/ui/Modal.jsx';
import TablaDatos from '@/components/ui/TablaDatos.jsx';
import { ESTADOS } from '@/constants/estados.js';

const FILAS = [
  { id: 1, nombre: 'Zona Centro', total: 4 },
  { id: 2, nombre: 'Zona Norte', total: 3 },
];
const COLUMNAS = [
  { clave: 'nombre', titulo: 'Zona' },
  { clave: 'total', titulo: 'Reportes' },
];
const OPCIONES = [
  { valor: 'a', texto: 'Escombros' },
  { valor: 'b', texto: 'Llantas' },
];
const sinAccion = () => {};

function Muestra({ titulo, nota, children }) {
  return (
    <section className="tarjeta muestra" aria-label={titulo}>
      <h2>{titulo}</h2>
      <p className="campo__ayuda">{nota}</p>
      {children}
    </section>
  );
}

export default function ComponentesPage() {
  const [texto, setTexto] = useState('Zona Centro');
  const [filtro, setFiltro] = useState('a');
  const [esActivo, setEsActivo] = useState(true);
  const [esModalAbierto, setEsModalAbierto] = useState(false);
  const cambiarTexto = (evento) => setTexto(evento.target.value);

  return (
    <>
      <EncabezadoPagina
        titulo="Catálogo de componentes"
        descripcion="Piezas reutilizables de la interfaz con sus variantes y estados."
      />
      <div className="rejilla-2">
        <Muestra titulo="Botón" nota="Cuatro variantes, con ícono, en carga y deshabilitado.">
          <div className="muestra__fila">
            <Boton icono={IconEnviar}>Primario</Boton>
            <Boton variante="secundario">Secundario</Boton>
            <Boton variante="peligro">Peligro</Boton>
            <Boton variante="texto">Texto</Boton>
            <Boton estaCargando>Guardando</Boton>
            <Boton disabled>Deshabilitado</Boton>
          </div>
        </Muestra>
        <Muestra
          titulo="Botón de ícono"
          nota="Siempre exige una etiqueta para el lector de pantalla."
        >
          <div className="muestra__fila">
            <BotonIcono icono={IconEditar} etiqueta="Editar ejemplo" />
            <BotonIcono icono={IconEliminar} tono="peligro" etiqueta="Eliminar ejemplo" />
          </div>
        </Muestra>
        <Muestra titulo="Campos" nota="Comparten etiqueta, ayuda y error; cambia solo el control.">
          <CampoTexto etiqueta="Texto" name="m1" value={texto} onChange={cambiarTexto} />
          <CampoTexto
            etiqueta="Con error"
            name="m2"
            value=""
            onChange={sinAccion}
            error="Este campo es obligatorio."
          />
          <CampoSeleccion
            etiqueta="Selección"
            name="m3"
            value="a"
            onChange={sinAccion}
            opciones={OPCIONES}
          />
          <CampoContrasena
            etiqueta="Contraseña"
            name="m4"
            value="Ejemplo123"
            onChange={sinAccion}
            ayuda="Mínimo 8 caracteres."
          />
        </Muestra>
        <Muestra titulo="Área de texto e interruptor" nota="El contador se calcula con el valor.">
          <CampoArea
            etiqueta="Descripción"
            name="m5"
            value={texto}
            onChange={cambiarTexto}
            maximo={60}
            esRequerido={false}
          />
          <Interruptor
            etiqueta="Activa"
            ayuda="Se puede cambiar con la barra espaciadora."
            name="m6"
            checked={esActivo}
            onChange={() => setEsActivo((valor) => !valor)}
          />
        </Muestra>
        <Muestra titulo="Insignias y filtros" nota="El estado se entiende sin depender del color.">
          <div className="muestra__fila">
            {ESTADOS.map((estado) => (
              <Insignia key={estado.id} tono={estado.tono}>
                {estado.nombre}
              </Insignia>
            ))}
          </div>
          <Filtros
            etiqueta="Ejemplo de filtros"
            opciones={OPCIONES}
            valor={filtro}
            onCambiar={setFiltro}
          />
        </Muestra>
        <Muestra titulo="Alertas y diálogo" nota="El diálogo atrapa el foco y cierra con Escape.">
          <Alerta>No se puede eliminar: tiene 4 reportes.</Alerta>
          <Alerta tono="info">Este reporte ya no cambia de estado.</Alerta>
          <Boton variante="secundario" icono={IconMas} onClick={() => setEsModalAbierto(true)}>
            Abrir diálogo
          </Boton>
        </Muestra>
        <Muestra
          titulo="Tabla de datos"
          nota="Recibe columnas y filas; sirve para cualquier módulo."
        >
          <TablaDatos titulo="Ejemplo de tabla" columnas={COLUMNAS} filas={FILAS} />
        </Muestra>
        <Muestra
          titulo="Indicadores y estado vacío"
          nota="Guían cuando hay datos y cuando no los hay."
        >
          <ul className="indicadores indicadores--2">
            <Indicador titulo="Pendientes" valor={4} tono="alerta" />
            <Indicador titulo="Resueltos" valor={4} tono="exito" />
          </ul>
          <EstadoVacio
            titulo="Aún no hay reportes"
            mensaje="Aparecerán cuando envíes el primero."
          />
        </Muestra>
      </div>
      {esModalAbierto && (
        <Modal titulo="Diálogo de ejemplo" onCerrar={() => setEsModalAbierto(false)}>
          <p>Prueba a recorrerlo con la tecla Tab y a cerrarlo con Escape.</p>
          <div className="acciones">
            <Boton onClick={() => setEsModalAbierto(false)}>Entendido</Boton>
          </div>
        </Modal>
      )}
    </>
  );
}
