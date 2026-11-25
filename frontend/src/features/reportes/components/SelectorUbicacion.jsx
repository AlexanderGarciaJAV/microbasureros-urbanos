import { useState } from 'react';
import Boton from '@/components/ui/Boton.jsx';
import CampoTexto from '@/components/ui/CampoTexto.jsx';
import { IconUbicacion } from '@/components/ui/Iconos.jsx';
import MapaEsquema from '@/components/ui/MapaEsquema.jsx';
import { aNumero } from '@/utils/formatos.js';

const AYUDA = 'Usa tu ubicación, toca el esquema o escribe las coordenadas.';

export default function SelectorUbicacion({ campo, onElegir }) {
  const [mensaje, setMensaje] = useState('');
  const [estaBuscando, setEstaBuscando] = useState(false);
  const latitud = campo('latitud');
  const longitud = campo('longitud');

  const ubicar = () => {
    if (!navigator.geolocation) {
      setMensaje('Tu navegador no comparte la ubicación. Escribe las coordenadas.');
      return;
    }
    setEstaBuscando(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onElegir({ latitud: coords.latitude.toFixed(6), longitud: coords.longitude.toFixed(6) });
        setMensaje('Listo, tomamos tu ubicación.');
        setEstaBuscando(false);
      },
      () => {
        setMensaje('No pudimos tomar tu ubicación. Toca el esquema o escribe las coordenadas.');
        setEstaBuscando(false);
      },
      { timeout: 6000 }
    );
  };

  return (
    <>
      <MapaEsquema
        latitud={aNumero(latitud.value)}
        longitud={aNumero(longitud.value)}
        etiqueta={`Esquema con el marcador en ${latitud.value}, ${longitud.value}`}
        onElegir={onElegir}
      />
      <div className="ubicacion-acciones">
        <p className="campo__ayuda" aria-live="polite">
          {mensaje || AYUDA}
        </p>
        <Boton
          variante="secundario"
          icono={IconUbicacion}
          estaCargando={estaBuscando}
          onClick={ubicar}
        >
          Usar mi ubicación
        </Boton>
      </div>
      <div className="fila">
        <CampoTexto etiqueta="Latitud" inputMode="decimal" {...latitud} />
        <CampoTexto etiqueta="Longitud" inputMode="decimal" {...longitud} />
      </div>
    </>
  );
}
