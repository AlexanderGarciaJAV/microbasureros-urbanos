// Botón que solo muestra un ícono: la etiqueta es obligatoria para el lector de pantalla.
export default function BotonIcono({ icono: Icono, etiqueta, tono = 'neutro', ...props }) {
  return (
    <button type="button" className={`btn-icono btn-icono--${tono}`} title={etiqueta} {...props}>
      <Icono />
      <span className="sr-only">{etiqueta}</span>
    </button>
  );
}
