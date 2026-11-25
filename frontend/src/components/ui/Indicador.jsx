export default function Indicador({ titulo, valor, detalle, tono = 'neutro' }) {
  return (
    <li className={`indicador indicador--${tono}`}>
      <span className="indicador__titulo">{titulo}</span>
      <strong className="indicador__valor">{valor}</strong>
      {detalle && <span className="indicador__detalle">{detalle}</span>}
    </li>
  );
}
