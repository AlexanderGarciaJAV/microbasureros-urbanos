import Alerta from '@/components/ui/Alerta.jsx';
import Boton from '@/components/ui/Boton.jsx';
import CampoArea from '@/components/ui/CampoArea.jsx';
import CampoSeleccion from '@/components/ui/CampoSeleccion.jsx';
import { IconEnviar } from '@/components/ui/Iconos.jsx';
import { useFormulario } from '@/hooks/useFormulario.js';
import { validarReporte } from '../validarReporte.js';
import SelectorFoto from './SelectorFoto.jsx';
import SelectorUbicacion from './SelectorUbicacion.jsx';

const INICIAL = {
  archivo: null,
  latitud: '7.7625',
  longitud: '-73.3917',
  categoriaId: '',
  zonaId: '',
  descripcion: '',
};

const aOpciones = (registros, describir) =>
  registros
    .filter((registro) => registro.activo)
    .map((registro) => ({ valor: registro.id, texto: describir(registro) }));

export default function ReporteForm({ zonas, categorias, onGuardar }) {
  const {
    valores,
    errores,
    errorGeneral,
    estaEnviando,
    formularioRef,
    campo,
    asignar,
    enviar,
    reiniciar,
  } = useFormulario({ inicial: INICIAL, validar: validarReporte, onGuardar });

  const elegirUbicacion = ({ latitud, longitud }) => {
    asignar('latitud', latitud);
    asignar('longitud', longitud);
  };

  return (
    <form ref={formularioRef} onSubmit={enviar} noValidate className="reporte-form">
      {errorGeneral && <Alerta>{errorGeneral}</Alerta>}
      <fieldset className="tarjeta paso">
        <legend>
          <span aria-hidden="true">1</span> Fotografía
        </legend>
        <SelectorFoto
          name="archivo"
          archivo={valores.archivo}
          error={errores.archivo}
          onElegir={(archivo) => asignar('archivo', archivo)}
        />
      </fieldset>
      <fieldset className="tarjeta paso">
        <legend>
          <span aria-hidden="true">2</span> Ubicación
        </legend>
        <SelectorUbicacion campo={campo} onElegir={elegirUbicacion} />
      </fieldset>
      <fieldset className="tarjeta paso">
        <legend>
          <span aria-hidden="true">3</span> Detalles
        </legend>
        <div className="fila">
          <CampoSeleccion
            etiqueta="Tipo de residuo"
            opciones={aOpciones(categorias, (categoria) => categoria.nombre)}
            {...campo('categoriaId')}
          />
          <CampoSeleccion
            etiqueta="Zona"
            opciones={aOpciones(zonas, (zona) => `${zona.nombre}, ${zona.barrio}`)}
            {...campo('zonaId')}
          />
        </div>
        <CampoArea
          etiqueta="¿Qué encontraste?"
          ayuda="Cuenta el tamaño, los olores o si es difícil llegar."
          maximo={500}
          {...campo('descripcion')}
        />
      </fieldset>
      <div className="acciones">
        <Boton variante="secundario" onClick={() => reiniciar()}>
          Limpiar formulario
        </Boton>
        <Boton type="submit" icono={IconEnviar} estaCargando={estaEnviando}>
          Enviar reporte
        </Boton>
      </div>
    </form>
  );
}
