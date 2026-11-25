import Alerta from '@/components/ui/Alerta.jsx';
import CampoSeleccion from '@/components/ui/CampoSeleccion.jsx';
import CampoTexto from '@/components/ui/CampoTexto.jsx';
import { MUNICIPIOS } from '@/constants/catalogos.js';
import { useFormulario } from '@/hooks/useFormulario.js';
import { validarZona } from '../validarGestion.js';
import PieFormulario from './PieFormulario.jsx';

const NUEVA = { nombre: '', barrio: '', municipioId: '', activo: true };
const OPCIONES = MUNICIPIOS.map(({ id, nombre, departamento }) => ({
  valor: id,
  texto: `${nombre} (${departamento})`,
}));

export default function ZonaForm({ registro, onGuardar, onCancelar }) {
  const { valores, errorGeneral, estaEnviando, formularioRef, campo, cambiar, enviar } =
    useFormulario({
      inicial: registro ?? NUEVA,
      validar: validarZona,
      onGuardar: (zona) =>
        onGuardar({
          ...zona,
          nombre: zona.nombre.trim(),
          barrio: zona.barrio.trim(),
          municipioId: Number(zona.municipioId),
        }),
    });
  return (
    <form ref={formularioRef} onSubmit={enviar} noValidate>
      {errorGeneral && <Alerta>{errorGeneral}</Alerta>}
      <CampoTexto etiqueta="Nombre de la zona" {...campo('nombre')} />
      <CampoTexto etiqueta="Barrio" {...campo('barrio')} />
      <CampoSeleccion etiqueta="Municipio" opciones={OPCIONES} {...campo('municipioId')} />
      <PieFormulario
        esActivo={valores.activo}
        onCambiar={cambiar}
        estaEnviando={estaEnviando}
        textoGuardar="Guardar zona"
        onCancelar={onCancelar}
      />
    </form>
  );
}
