import { IconPin } from './Iconos.jsx';

// Vista esquemática centrada en la zona de referencia; el marcador se mueve con las coordenadas.
// TODO (MBU-28): reemplazar el esquema por un mapa interactivo.
const CENTRO = { latitud: 7.7625, longitud: -73.3917 };
const ALCANCE = 0.02;
const limitar = (valor) => Math.min(96, Math.max(4, valor));

export default function MapaEsquema({ latitud, longitud, etiqueta, onElegir }) {
  const izquierda = limitar(50 + ((longitud - CENTRO.longitud) / ALCANCE) * 50);
  const arriba = limitar(50 - ((latitud - CENTRO.latitud) / ALCANCE) * 50);

  const elegir = (evento) => {
    const caja = evento.currentTarget.getBoundingClientRect();
    const x = (evento.clientX - caja.left) / caja.width - 0.5;
    const y = (evento.clientY - caja.top) / caja.height - 0.5;
    onElegir({
      latitud: (CENTRO.latitud - y * ALCANCE * 2).toFixed(6),
      longitud: (CENTRO.longitud + x * ALCANCE * 2).toFixed(6),
    });
  };

  return (
    // El clic es una ayuda adicional: con teclado la ubicación se escribe en los campos de abajo.
    <div
      className={`mapa ${onElegir ? 'mapa--editable' : ''}`}
      onClick={onElegir && elegir}
      role="img"
      aria-label={etiqueta}
    >
      <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="200" fill="#eaf1ea" />
        <path
          d="M0 150c60-24 110 10 170-14s130-6 230-40v30c-100 34-170 16-230 40S60 156 0 180z"
          fill="#cfe3f3"
        />
        <g stroke="#fff" strokeWidth="9" fill="none">
          <path d="M0 60h400M0 108h400M70 0v200M160 0v200M250 0v200M335 0v200" />
          <path d="M0 10l400 120" strokeWidth="12" />
        </g>
        <g fill="#d6e4d7">
          <rect x="82" y="70" width="64" height="30" rx="4" />
          <rect x="174" y="118" width="60" height="26" rx="4" />
          <rect x="264" y="16" width="58" height="34" rx="4" />
          <rect x="14" y="18" width="42" height="30" rx="4" />
        </g>
      </svg>
      {Number.isFinite(latitud) && Number.isFinite(longitud) && (
        <span className="mapa__pin" style={{ left: `${izquierda}%`, top: `${arriba}%` }}>
          <IconPin width={34} height={34} />
        </span>
      )}
      <span className="mapa__nota">Vista esquemática</span>
    </div>
  );
}
