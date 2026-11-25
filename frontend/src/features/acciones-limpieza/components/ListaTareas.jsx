import { Link } from 'react-router-dom';
import { IconPin } from '@/components/ui/Iconos.jsx';
import Insignia from '@/components/ui/Insignia.jsx';
import { obtenerEstado } from '@/constants/estados.js';
import { RUTAS } from '@/routes/rutas.js';

export default function ListaTareas({ tareas, idActivo, nombreZona }) {
  return (
    <ul className="lista-tareas">
      {tareas.map((tarea) => {
        const estado = obtenerEstado(tarea.estadoId);
        return (
          <li key={tarea.id}>
            <Link
              to={`${RUTAS.tareas}/${tarea.id}`}
              className="tarea"
              aria-current={tarea.id === idActivo ? 'true' : undefined}
            >
              <span className="tarea__linea">
                <span>{tarea.codigo}</span>
                <Insignia tono={estado.tono}>{estado.nombre}</Insignia>
              </span>
              <strong>{tarea.descripcion}</strong>
              <span className="tarea__zona">
                <IconPin width={16} height={16} /> {nombreZona(tarea.zonaId)}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
