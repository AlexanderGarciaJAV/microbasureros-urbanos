import { IconAlerta } from './Iconos.jsx';

export default function Alerta({ tono = 'error', children, accion }) {
  return (
    <div className={`alerta alerta--${tono}`} role={tono === 'error' ? 'alert' : 'status'}>
      <IconAlerta />
      <div>{children}</div>
      {accion}
    </div>
  );
}
