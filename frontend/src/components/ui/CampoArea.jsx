import Campo from './Campo.jsx';

export default function CampoArea({
  etiqueta,
  ayuda,
  error,
  esRequerido = true,
  maximo,
  ...props
}) {
  return (
    <Campo
      etiqueta={etiqueta}
      ayuda={ayuda}
      error={error}
      esRequerido={esRequerido}
      maximo={maximo}
      largo={props.value.length}
    >
      {(control) => (
        <textarea className="control" rows={4} maxLength={maximo} {...props} {...control} />
      )}
    </Campo>
  );
}
