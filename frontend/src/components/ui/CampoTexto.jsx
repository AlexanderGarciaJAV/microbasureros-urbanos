import Campo from './Campo.jsx';

export default function CampoTexto({ etiqueta, ayuda, error, esRequerido = true, ...props }) {
  return (
    <Campo etiqueta={etiqueta} ayuda={ayuda} error={error} esRequerido={esRequerido}>
      {(control) => <input type="text" className="control" {...props} {...control} />}
    </Campo>
  );
}
