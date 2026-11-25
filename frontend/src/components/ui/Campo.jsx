import { useId } from 'react';
import { IconAlerta } from './Iconos.jsx';

// Estructura común de todos los campos: etiqueta, ayuda, contador y error accesible.
// El control concreto llega como función, por eso se reutiliza sin modificarlo.
export default function Campo({ etiqueta, ayuda, error, esRequerido, maximo, largo, children }) {
  const id = useId();
  const descripcion =
    [error && `${id}-error`, ayuda && `${id}-ayuda`].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`campo ${error ? 'campo--error' : ''}`}>
      <div className="campo__titulo">
        <label htmlFor={id}>
          {etiqueta}
          {!esRequerido && <span className="campo__opcional"> (opcional)</span>}
        </label>
        {maximo && (
          <span className="campo__contador" aria-hidden="true">
            {largo}/{maximo}
          </span>
        )}
      </div>
      {children({
        id,
        required: esRequerido,
        'aria-invalid': error ? 'true' : 'false',
        'aria-describedby': descripcion,
      })}
      {error && (
        <p id={`${id}-error`} className="campo__error" role="alert">
          <IconAlerta width={16} height={16} /> {error}
        </p>
      )}
      {ayuda && (
        <p id={`${id}-ayuda`} className="campo__ayuda">
          {ayuda}
        </p>
      )}
    </div>
  );
}
