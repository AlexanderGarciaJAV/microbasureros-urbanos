import { IconAlerta, IconCorrecto, IconReloj } from './Iconos.jsx';

const ICONOS = { alerta: IconAlerta, info: IconReloj, exito: IconCorrecto };

// El significado se da con texto e ícono; el color solo lo refuerza.
export default function Insignia({ tono = 'neutro', children }) {
  const Icono = ICONOS[tono];
  return (
    <span className={`insignia insignia--${tono}`}>
      {Icono && <Icono width={14} height={14} />}
      {children}
    </span>
  );
}
