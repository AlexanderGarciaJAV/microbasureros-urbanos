import { useEffect, useId, useState } from 'react';
import Boton from '@/components/ui/Boton.jsx';
import { IconAlerta, IconCamara } from '@/components/ui/Iconos.jsx';

export default function SelectorFoto({ name, archivo, error, onElegir }) {
  const id = useId();
  const [vista, setVista] = useState('');

  useEffect(() => {
    if (!archivo || error) {
      setVista('');
      return undefined;
    }
    const url = URL.createObjectURL(archivo);
    setVista(url);
    return () => URL.revokeObjectURL(url);
  }, [archivo, error]);

  return (
    <div className={`foto ${error ? 'foto--error' : ''}`}>
      <label className="foto__zona">
        {vista ? (
          <img src={vista} alt="Vista previa de la fotografía elegida" />
        ) : (
          <span className="foto__texto">
            <IconCamara width={32} height={32} />
            <strong>Toma o elige una fotografía</strong>
            <small>JPG o PNG, máximo 5 MB</small>
          </span>
        )}
        <input
          type="file"
          name={name}
          accept="image/jpeg,image/png"
          aria-label="Fotografía del lugar"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? id : undefined}
          onChange={(evento) => onElegir(evento.target.files?.[0] ?? null)}
        />
      </label>
      {error && (
        <p id={id} className="campo__error" role="alert">
          <IconAlerta width={16} height={16} /> {error}
        </p>
      )}
      {vista && (
        <Boton variante="texto" onClick={() => onElegir(null)}>
          Quitar fotografía
        </Boton>
      )}
    </div>
  );
}
