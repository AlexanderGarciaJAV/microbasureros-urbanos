// Botón único del sistema. Para agregar una variante basta con una clase nueva en estilos.
export default function Boton({
  variante = 'primario',
  tamano = 'md',
  icono: Icono,
  estaCargando = false,
  ancho = false,
  type = 'button',
  className = '',
  disabled = false,
  children,
  ...props
}) {
  const clases = ['btn', `btn--${variante}`, `btn--${tamano}`, ancho && 'btn--ancho', className];
  return (
    <button
      type={type}
      className={clases.filter(Boolean).join(' ')}
      aria-busy={estaCargando || undefined}
      disabled={disabled || estaCargando}
      {...props}
    >
      {estaCargando ? <span className="btn__giro" aria-hidden="true" /> : Icono && <Icono />}
      <span>{children}</span>
    </button>
  );
}
