import { useState } from 'react';
import Campo from './Campo.jsx';
import { IconOjo, IconOjoCerrado } from './Iconos.jsx';

export default function CampoContrasena({ etiqueta, ayuda, error, esRequerido = true, ...props }) {
  const [esVisible, setEsVisible] = useState(false);
  return (
    <Campo etiqueta={etiqueta} ayuda={ayuda} error={error} esRequerido={esRequerido}>
      {(control) => (
        <div className="control-grupo">
          <input
            className="control"
            {...props}
            {...control}
            type={esVisible ? 'text' : 'password'}
          />
          <button
            type="button"
            className="control-grupo__accion"
            aria-pressed={esVisible}
            onClick={() => setEsVisible((valor) => !valor)}
          >
            {esVisible ? <IconOjoCerrado /> : <IconOjo />}
            <span className="sr-only">Mostrar contraseña</span>
          </button>
        </div>
      )}
    </Campo>
  );
}
