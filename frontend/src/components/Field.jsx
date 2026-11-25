import { useId, useState } from 'react';
import { IconEye, IconEyeOff } from './Icons.jsx';

// Campo de formulario controlado, con etiqueta asociada, ayuda y mensaje de error accesible.
export default function Field({
  label,
  error,
  hint,
  as = 'input',
  children,
  className = '',
  ...props
}) {
  const id = useId();
  const descripcion =
    [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  const [ver, setVer] = useState(false);
  const esClave = props.type === 'password';
  const Tag = as;

  return (
    <div className={`campo ${error ? 'campo--error' : ''} ${className}`}>
      <label htmlFor={id}>
        {label}
        {props.required && (
          <span className="req" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      <div className="campo__control">
        <Tag
          id={id}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={descripcion}
          {...props}
          type={esClave && ver ? 'text' : props.type}
        >
          {children}
        </Tag>
        {esClave && (
          <button
            type="button"
            className="campo__ojo"
            onClick={() => setVer((v) => !v)}
            aria-pressed={ver}
          >
            {ver ? <IconEyeOff /> : <IconEye />}
            <span className="sr-only">{ver ? 'Ocultar contraseña' : 'Mostrar contraseña'}</span>
          </button>
        )}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="campo__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="campo__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
