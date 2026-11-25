import FotoReporte from '@/components/ui/FotoReporte.jsx';
import LineaTiempo from '@/components/ui/LineaTiempo.jsx';
import Modal from '@/components/ui/Modal.jsx';
import { useCatalogos } from '@/hooks/useCatalogos.js';
import { useSeguimiento } from '@/hooks/useSeguimiento.js';

export default function DetalleReporte({ reporte, onCerrar }) {
  const { nombreCategoria, nombreZona } = useCatalogos();
  const eventos = useSeguimiento(reporte.id);
  const categoria = nombreCategoria(reporte.categoriaId);
  return (
    <Modal titulo={`Seguimiento de ${reporte.codigo}`} onCerrar={onCerrar}>
      <div className="detalle-foto">
        <FotoReporte reporte={reporte} categoria={categoria} />
      </div>
      <p className="detalle-texto">{reporte.descripcion}</p>
      <p className="campo__ayuda">
        {categoria}. {nombreZona(reporte.zonaId)}.
      </p>
      <LineaTiempo eventos={eventos} />
    </Modal>
  );
}
