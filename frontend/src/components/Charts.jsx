// Gráficos SVG propios (sin librerías) con alternativa textual accesible.
const COLORES = ['#9A3412', '#1B5E20', '#0B57B0', '#4C8DF6', '#7A5A00'];

export function BarChart({ datos, titulo }) {
  const max = Math.max(1, ...datos.map((d) => d.valor));
  const alto = 220;
  const ancho = Math.max(360, datos.length * 80);
  const paso = (ancho - 28) / datos.length;
  const descripcion = `${titulo}: ${datos.map((d) => `${d.etiqueta} ${d.valor}`).join(', ')}`;
  return (
    <figure className="grafico">
      <svg viewBox={`0 0 ${ancho} ${alto + 46}`} role="img" aria-label={descripcion}>
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line x1="24" x2={ancho} y1={alto - (alto - 14) * f + 6} y2={alto - (alto - 14) * f + 6} className="grafico__guia" />
            <text x="0" y={alto - (alto - 14) * f + 10} className="grafico__eje">
              {Math.round(max * f)}
            </text>
          </g>
        ))}
        {datos.map((d, i) => {
          const h = (d.valor / max) * (alto - 14);
          const x = 28 + i * paso;
          return (
            <g key={d.etiqueta}>
              <rect x={x + paso * 0.2} y={alto + 6 - h} width={paso * 0.6} height={h} rx="3" className="grafico__barra" />
              <text x={x + paso * 0.5} y={alto + 1 - h} textAnchor="middle" className="grafico__valor">
                {d.valor}
              </text>
              <text x={x + paso * 0.5} y={alto + 26} textAnchor="middle" className="grafico__etiqueta">
                {d.etiqueta}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

export function DonutChart({ datos, titulo }) {
  const total = datos.reduce((s, d) => s + d.valor, 0) || 1;
  const r = 70;
  const c = 2 * Math.PI * r;
  let acumulado = 0;
  const descripcion = `${titulo}: ${datos.map((d) => `${d.etiqueta} ${d.valor}`).join(', ')}`;
  return (
    <figure className="grafico grafico--donut">
      <svg viewBox="0 0 200 200" role="img" aria-label={descripcion}>
        <g transform="rotate(-90 100 100)">
          {datos.map((d, i) => {
            const largo = (d.valor / total) * c;
            const seg = (
              <circle
                key={d.etiqueta}
                cx="100"
                cy="100"
                r={r}
                fill="none"
                stroke={COLORES[i % COLORES.length]}
                strokeWidth="32"
                strokeDasharray={`${largo} ${c - largo}`}
                strokeDashoffset={-acumulado}
              />
            );
            acumulado += largo;
            return seg;
          })}
        </g>
        <text x="100" y="100" textAnchor="middle" className="grafico__total">
          {total}
        </text>
        <text x="100" y="120" textAnchor="middle" className="grafico__etiqueta">
          reportes
        </text>
      </svg>
      <ul className="leyenda">
        {datos.map((d, i) => (
          <li key={d.etiqueta}>
            <span style={{ background: COLORES[i % COLORES.length] }} aria-hidden="true" />
            {d.etiqueta} <strong>{d.valor}</strong>
          </li>
        ))}
      </ul>
    </figure>
  );
}
