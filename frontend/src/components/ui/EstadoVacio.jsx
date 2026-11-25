import { IconHoja } from './Iconos.jsx';

export default function EstadoVacio({ titulo, mensaje, accion, icono: Icono = IconHoja }) {
  return (
    <div className="estado-vacio">
      <span className="estado-vacio__icono">
        <Icono width={28} height={28} />
      </span>
      <h2>{titulo}</h2>
      <p>{mensaje}</p>
      {accion}
    </div>
  );
}
