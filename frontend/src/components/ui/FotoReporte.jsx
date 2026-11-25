import Ilustracion from './Ilustracion.jsx';

export default function FotoReporte({ reporte, categoria }) {
  return reporte.foto ? (
    <img src={reporte.foto} alt={`Fotografía del reporte ${reporte.codigo}`} />
  ) : (
    <Ilustracion
      categoriaId={reporte.categoriaId}
      titulo={`Imagen ilustrativa de la categoría ${categoria}`}
    />
  );
}
