import { useId, useRef } from 'react';

const DESPLAZAMIENTO = { ArrowRight: 1, ArrowLeft: -1 };

/** Pestañas con el patrón ARIA: se recorren con flechas y el panel queda asociado a su pestaña. */
export default function Pestanas({ etiqueta, pestanas, activa, onCambiar, children }) {
  const id = useId();
  const botones = useRef({});

  const alPresionar = (evento) => {
    const paso = DESPLAZAMIENTO[evento.key];
    if (!paso) return;
    const actual = pestanas.findIndex((pestana) => pestana.id === activa);
    const siguiente = pestanas[(actual + paso + pestanas.length) % pestanas.length].id;
    onCambiar(siguiente);
    botones.current[siguiente]?.focus();
  };

  return (
    <>
      <div className="pestanas" role="tablist" aria-label={etiqueta} onKeyDown={alPresionar}>
        {pestanas.map((pestana) => (
          <button
            key={pestana.id}
            ref={(nodo) => {
              botones.current[pestana.id] = nodo;
            }}
            type="button"
            role="tab"
            id={`${id}-${pestana.id}`}
            aria-selected={pestana.id === activa}
            aria-controls={`${id}-panel`}
            tabIndex={pestana.id === activa ? 0 : -1}
            onClick={() => onCambiar(pestana.id)}
          >
            {pestana.texto}
          </button>
        ))}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${activa}`}>
        {children}
      </div>
    </>
  );
}
