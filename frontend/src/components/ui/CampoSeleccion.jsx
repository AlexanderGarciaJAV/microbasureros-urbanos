import Campo from './Campo.jsx';

export default function CampoSeleccion({
  etiqueta,
  ayuda,
  error,
  esRequerido = true,
  opciones,
  vacio = 'Selecciona una opción',
  ...props
}) {
  return (
    <Campo etiqueta={etiqueta} ayuda={ayuda} error={error} esRequerido={esRequerido}>
      {(control) => (
        <select className="control" {...props} {...control}>
          {vacio && <option value="">{vacio}</option>}
          {opciones.map(({ valor, texto }) => (
            <option key={valor} value={valor}>
              {texto}
            </option>
          ))}
        </select>
      )}
    </Campo>
  );
}
