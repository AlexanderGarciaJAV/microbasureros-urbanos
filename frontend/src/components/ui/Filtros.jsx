// Grupo de opciones excluyentes para filtrar listas.
export default function Filtros({ etiqueta, opciones, valor, onCambiar }) {
  return (
    <div className="filtros" role="group" aria-label={etiqueta}>
      {opciones.map((opcion) => (
        <button
          key={opcion.valor}
          type="button"
          className="filtros__opcion"
          aria-pressed={valor === opcion.valor}
          onClick={() => onCambiar(opcion.valor)}
        >
          {opcion.texto}
          {opcion.total !== undefined && <span className="filtros__total">{opcion.total}</span>}
        </button>
      ))}
    </div>
  );
}
