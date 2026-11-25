// Reserva el espacio del contenido para que la página no salte al terminar la carga.
export default function Cargando({ bloques = 3 }) {
  return (
    <div className="cargando" role="status">
      <span className="sr-only">Cargando información…</span>
      {Array.from({ length: bloques }, (_, indice) => (
        <span key={indice} className="cargando__bloque" aria-hidden="true" />
      ))}
    </div>
  );
}
