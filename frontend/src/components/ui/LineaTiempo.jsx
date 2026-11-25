import { formatearFechaHora } from '@/utils/formatos.js';

// Seguimiento en orden cronológico. Recibe eventos ya armados por cada módulo.
export default function LineaTiempo({ eventos }) {
  return (
    <ol className="linea-tiempo">
      {eventos.map((evento) => (
        <li key={evento.id} className={`linea-tiempo__evento linea-tiempo__evento--${evento.tono}`}>
          <strong>{evento.titulo}</strong>
          <span>
            <time dateTime={evento.fecha}>{formatearFechaHora(evento.fecha)}</time>
            {evento.autor && `, por ${evento.autor}`}
          </span>
          {evento.detalle && <p>{evento.detalle}</p>}
        </li>
      ))}
    </ol>
  );
}
