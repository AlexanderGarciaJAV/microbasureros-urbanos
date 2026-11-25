import Boton from '@/components/ui/Boton.jsx';
import Interruptor from '@/components/ui/Interruptor.jsx';

export default function PieFormulario({
  esActivo,
  onCambiar,
  estaEnviando,
  textoGuardar,
  onCancelar,
}) {
  return (
    <>
      <Interruptor
        etiqueta="Activa"
        ayuda="Solo lo activo aparece al crear un reporte."
        name="activo"
        checked={esActivo}
        onChange={onCambiar}
      />
      <div className="acciones">
        <Boton variante="secundario" onClick={onCancelar}>
          Cancelar
        </Boton>
        <Boton type="submit" estaCargando={estaEnviando}>
          {textoGuardar}
        </Boton>
      </div>
    </>
  );
}
