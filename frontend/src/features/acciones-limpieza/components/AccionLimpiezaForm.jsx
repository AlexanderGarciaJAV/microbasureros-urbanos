import Alerta from '@/components/ui/Alerta.jsx';
import Boton from '@/components/ui/Boton.jsx';
import CampoArea from '@/components/ui/CampoArea.jsx';
import CampoSeleccion from '@/components/ui/CampoSeleccion.jsx';
import { IconCorrecto } from '@/components/ui/Iconos.jsx';
import { RESULTADOS_LIMPIEZA } from '@/constants/catalogos.js';
import { obtenerEstado, obtenerTransiciones } from '@/constants/estados.js';
import { useFormulario } from '@/hooks/useFormulario.js';
import { validarAccion } from '../validarAccion.js';

const RESULTADOS = RESULTADOS_LIMPIEZA.map(({ id, nombre }) => ({ valor: id, texto: nombre }));

// El operario registra la limpieza y, en el mismo envío, el estado en que queda el reporte.
export default function AccionLimpiezaForm({ reporte, rol, onGuardar }) {
  const { errorGeneral, estaEnviando, formularioRef, campo, enviar } = useFormulario({
    inicial: { resultado: '', descripcion: '', estadoId: '' },
    validar: validarAccion,
    onGuardar,
  });
  const actual = obtenerEstado(reporte.estadoId);
  const estados = [
    { valor: actual.id, texto: `Sigue ${actual.nombre}` },
    ...obtenerTransiciones(rol, reporte.estadoId).map((id) => ({
      valor: id,
      texto: `Pasa a ${obtenerEstado(id).nombre}`,
    })),
  ];
  return (
    <form ref={formularioRef} onSubmit={enviar} noValidate className="tarjeta">
      <h2>Registrar acción de limpieza</h2>
      {errorGeneral && <Alerta>{errorGeneral}</Alerta>}
      <div className="fila">
        <CampoSeleccion etiqueta="Resultado" opciones={RESULTADOS} {...campo('resultado')} />
        <CampoSeleccion etiqueta="Estado del reporte" opciones={estados} {...campo('estadoId')} />
      </div>
      <CampoArea
        etiqueta="¿Qué hiciste?"
        ayuda="El ciudadano leerá este texto en el seguimiento."
        maximo={300}
        {...campo('descripcion')}
      />
      <div className="acciones">
        <Boton type="submit" icono={IconCorrecto} estaCargando={estaEnviando}>
          Guardar acción
        </Boton>
      </div>
    </form>
  );
}
