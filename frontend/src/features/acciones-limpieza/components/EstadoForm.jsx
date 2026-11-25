import Alerta from '@/components/ui/Alerta.jsx';
import Boton from '@/components/ui/Boton.jsx';
import CampoSeleccion from '@/components/ui/CampoSeleccion.jsx';
import { obtenerEstado, obtenerTransiciones } from '@/constants/estados.js';
import { useFormulario } from '@/hooks/useFormulario.js';
import { validarCambioEstado } from '../validarAccion.js';

// La administración valida, rechaza o reabre; no registra limpiezas.
export default function EstadoForm({ reporte, rol, onGuardar }) {
  const { errorGeneral, estaEnviando, formularioRef, campo, enviar } = useFormulario({
    inicial: { estadoId: '' },
    validar: validarCambioEstado,
    onGuardar,
  });
  const opciones = obtenerTransiciones(rol, reporte.estadoId).map((id) => ({
    valor: id,
    texto: obtenerEstado(id).nombre,
  }));
  if (opciones.length === 0) {
    return <Alerta tono="info">Este reporte quedó Rechazado y ya no cambia de estado.</Alerta>;
  }
  return (
    <form ref={formularioRef} onSubmit={enviar} noValidate className="tarjeta">
      <h2>Cambiar estado</h2>
      {errorGeneral && <Alerta>{errorGeneral}</Alerta>}
      <CampoSeleccion
        etiqueta={`Está ${obtenerEstado(reporte.estadoId).nombre}. Pasar a`}
        opciones={opciones}
        {...campo('estadoId')}
      />
      <div className="acciones">
        <Boton type="submit" estaCargando={estaEnviando}>
          Guardar estado
        </Boton>
      </div>
    </form>
  );
}
