import Alerta from '@/components/ui/Alerta.jsx';
import CampoArea from '@/components/ui/CampoArea.jsx';
import CampoTexto from '@/components/ui/CampoTexto.jsx';
import { useFormulario } from '@/hooks/useFormulario.js';
import { validarCategoria } from '../validarGestion.js';
import PieFormulario from './PieFormulario.jsx';

const NUEVA = { nombre: '', descripcion: '', activo: true };

export default function CategoriaForm({ registro, onGuardar, onCancelar }) {
  const { valores, errorGeneral, estaEnviando, formularioRef, campo, cambiar, enviar } =
    useFormulario({
      inicial: registro ?? NUEVA,
      validar: validarCategoria,
      onGuardar: (categoria) =>
        onGuardar({
          ...categoria,
          nombre: categoria.nombre.trim(),
          descripcion: categoria.descripcion.trim(),
        }),
    });
  return (
    <form ref={formularioRef} onSubmit={enviar} noValidate>
      {errorGeneral && <Alerta>{errorGeneral}</Alerta>}
      <CampoTexto etiqueta="Nombre de la categoría" {...campo('nombre')} />
      <CampoArea etiqueta="Descripción" maximo={200} {...campo('descripcion')} />
      <PieFormulario
        esActivo={valores.activo}
        onCambiar={cambiar}
        estaEnviando={estaEnviando}
        textoGuardar="Guardar categoría"
        onCancelar={onCancelar}
      />
    </form>
  );
}
