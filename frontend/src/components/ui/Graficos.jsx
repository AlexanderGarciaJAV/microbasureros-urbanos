// Barras horizontales: los nombres largos se leen completos en cualquier pantalla.
export function GraficoBarras({ titulo, datos }) {
  const maximo = Math.max(1, ...datos.map((dato) => dato.valor));
  return (
    <ul className="barras" aria-label={titulo}>
      {datos.map((dato) => (
        <li key={dato.etiqueta}>
          <span className="barras__nombre">{dato.etiqueta}</span>
          <span className="barras__pista" aria-hidden="true">
            <span style={{ width: `${(dato.valor / maximo) * 100}%` }} />
          </span>
          <strong>{dato.valor}</strong>
        </li>
      ))}
    </ul>
  );
}

export function GraficoProporcion({ titulo, datos }) {
  const total = datos.reduce((suma, dato) => suma + dato.valor, 0) || 1;
  return (
    <figure className="proporcion">
      <div className="proporcion__barra" aria-hidden="true">
        {datos.map((dato) => (
          <span
            key={dato.etiqueta}
            className={`proporcion__parte proporcion__parte--${dato.tono}`}
            style={{ width: `${(dato.valor / total) * 100}%` }}
          />
        ))}
      </div>
      <figcaption className="sr-only">{titulo}</figcaption>
      <ul className="proporcion__leyenda">
        {datos.map((dato) => (
          <li key={dato.etiqueta}>
            <span className={`proporcion__parte--${dato.tono}`} aria-hidden="true" />
            {dato.etiqueta}: <strong>{dato.valor}</strong> ({Math.round((dato.valor / total) * 100)}{' '}
            %)
          </li>
        ))}
      </ul>
    </figure>
  );
}
