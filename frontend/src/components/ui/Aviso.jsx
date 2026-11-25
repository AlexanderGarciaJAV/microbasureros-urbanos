import { useAviso } from '@/context/AvisoContext.jsx';
import BotonIcono from './BotonIcono.jsx';
import { IconCerrar, IconCorrecto } from './Iconos.jsx';

// Confirmación breve. La región existe siempre para que el lector de pantalla la anuncie.
export default function Aviso() {
  const { aviso, cerrarAviso } = useAviso();
  return (
    <div className="aviso-zona" role="status" aria-live="polite">
      {aviso && (
        <div key={aviso.id} className={`aviso aviso--${aviso.tono}`}>
          <IconCorrecto />
          <span>{aviso.mensaje}</span>
          <BotonIcono icono={IconCerrar} etiqueta="Cerrar aviso" onClick={cerrarAviso} />
        </div>
      )}
    </div>
  );
}
