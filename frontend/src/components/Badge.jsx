import { IconAlert, IconCheck } from './Icons.jsx';

const CLASES = {
  1: 'badge--pendiente',
  2: 'badge--proceso',
  3: 'badge--resuelto',
  4: 'badge--rechazado',
};

// El estado se comunica con texto + icono + color (no solo con color).
export default function Badge({ estadoId, nombre }) {
  return (
    <span className={`badge ${CLASES[estadoId] ?? ''}`}>
      {estadoId === 3 && <IconCheck width={14} height={14} />}
      {(estadoId === 1 || estadoId === 4) && <IconAlert width={14} height={14} />}
      {nombre}
    </span>
  );
}
