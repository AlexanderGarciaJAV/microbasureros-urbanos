import EstadoVacio from './EstadoVacio.jsx';

/**
 * Tabla genérica: no conoce zonas, categorías ni reportes.
 * @param {{clave: string, titulo: string, render?: (fila: object) => any}[]} columnas
 * @param {(fila: object) => any} [acciones] botones de cada fila
 */
export default function TablaDatos({ titulo, columnas, filas, acciones, vacio, pie }) {
  if (filas.length === 0) return <EstadoVacio {...vacio} />;
  const [principal, ...resto] = columnas;
  const contenido = (columna, fila) =>
    columna.render ? columna.render(fila) : fila[columna.clave];
  return (
    <div className="tabla-contenedor">
      <table className="tabla">
        <caption className="sr-only">{titulo}</caption>
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th key={columna.clave} scope="col">
                {columna.titulo}
              </th>
            ))}
            {acciones && (
              <th scope="col" className="tabla__acciones">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila.id}>
              <th scope="row" data-etiqueta={principal.titulo}>
                {contenido(principal, fila)}
              </th>
              {resto.map((columna) => (
                <td key={columna.clave} data-etiqueta={columna.titulo}>
                  {contenido(columna, fila)}
                </td>
              ))}
              {acciones && <td className="tabla__acciones">{acciones(fila)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {pie}
    </div>
  );
}
