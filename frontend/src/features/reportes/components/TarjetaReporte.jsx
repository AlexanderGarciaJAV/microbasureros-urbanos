import FotoReporte from '@/components/ui/FotoReporte.jsx';
import { IconCalendario, IconPin } from '@/components/ui/Iconos.jsx';
import Insignia from '@/components/ui/Insignia.jsx';
import { obtenerEstado } from '@/constants/estados.js';
import { formatearFecha } from '@/utils/formatos.js';

export default function TarjetaReporte({ reporte, categoria, zona, onAbrir }) {
  const estado = obtenerEstado(reporte.estadoId);
  return (
    <li className="tarjeta-reporte">
      <div className="tarjeta-reporte__foto">
        <FotoReporte reporte={reporte} categoria={categoria} />
      </div>
      <div className="tarjeta-reporte__cuerpo">
        <div className="tarjeta-reporte__linea">
          <span>{reporte.codigo}</span>
          <Insignia tono={estado.tono}>{estado.nombre}</Insignia>
        </div>
        <h2>
          <button type="button" onClick={onAbrir}>
            {reporte.descripcion}
          </button>
        </h2>
        <p>
          <IconPin width={16} height={16} /> {zona}
        </p>
        <p>
          <IconCalendario width={16} height={16} /> {formatearFecha(reporte.fecha)}
        </p>
      </div>
    </li>
  );
}
