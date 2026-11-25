import FotoReporte from '@/components/ui/FotoReporte.jsx';
import Insignia from '@/components/ui/Insignia.jsx';
import MapaEsquema from '@/components/ui/MapaEsquema.jsx';
import { obtenerEstado } from '@/constants/estados.js';
import { formatearFecha } from '@/utils/formatos.js';

export default function FichaReporte({ reporte, categoria, zona }) {
  const estado = obtenerEstado(reporte.estadoId);
  return (
    <section className="tarjeta ficha" aria-labelledby="titulo-ficha">
      <div className="ficha__cabecera">
        <h2 id="titulo-ficha">{reporte.descripcion}</h2>
        <Insignia tono={estado.tono}>{estado.nombre}</Insignia>
      </div>
      <div className="ficha__medios">
        <FotoReporte reporte={reporte} categoria={categoria} />
        <MapaEsquema
          latitud={reporte.latitud}
          longitud={reporte.longitud}
          etiqueta={`Ubicación ${reporte.latitud}, ${reporte.longitud}`}
        />
      </div>
      <dl className="ficha__datos">
        <div>
          <dt>Código</dt>
          <dd>{reporte.codigo}</dd>
        </div>
        <div>
          <dt>Tipo de residuo</dt>
          <dd>{categoria}</dd>
        </div>
        <div>
          <dt>Zona</dt>
          <dd>{zona}</dd>
        </div>
        <div>
          <dt>Reportado</dt>
          <dd>{formatearFecha(reporte.fecha)}</dd>
        </div>
      </dl>
    </section>
  );
}
