import { useId } from 'react';
import { IconLupa } from './Iconos.jsx';

export default function Buscador({ etiqueta, valor, onCambiar }) {
  const id = useId();
  return (
    <div className="buscador">
      <IconLupa />
      <label htmlFor={id} className="sr-only">
        {etiqueta}
      </label>
      <input
        id={id}
        type="search"
        placeholder={etiqueta}
        value={valor}
        onChange={(evento) => onCambiar(evento.target.value)}
      />
    </div>
  );
}
