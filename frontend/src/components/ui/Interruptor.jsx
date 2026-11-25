export default function Interruptor({ etiqueta, ayuda, name, checked, onChange }) {
  return (
    <label className="interruptor">
      <input type="checkbox" role="switch" name={name} checked={checked} onChange={onChange} />
      <span className="interruptor__pista" aria-hidden="true" />
      <span>
        {etiqueta}
        {ayuda && <small>{ayuda}</small>}
      </span>
    </label>
  );
}
