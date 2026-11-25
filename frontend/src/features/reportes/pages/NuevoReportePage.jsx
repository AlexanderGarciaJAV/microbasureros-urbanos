import { useNavigate } from 'react-router-dom';
import EncabezadoPagina from '@/components/ui/EncabezadoPagina.jsx';
import { useAviso } from '@/context/AvisoContext.jsx';
import { useDatos } from '@/context/DatosContext.jsx';
import { RUTAS } from '@/routes/rutas.js';
import { aNumero } from '@/utils/formatos.js';
import ReporteForm from '../components/ReporteForm.jsx';

export default function NuevoReportePage() {
  const { zonas, categorias, crearReporte } = useDatos();
  const { notificar } = useAviso();
  const navegar = useNavigate();

  const guardar = async ({ archivo, latitud, longitud, categoriaId, zonaId, descripcion }) => {
    const reporte = await crearReporte({
      descripcion: descripcion.trim(),
      latitud: aNumero(latitud),
      longitud: aNumero(longitud),
      categoriaId: Number(categoriaId),
      zonaId: Number(zonaId),
      foto: URL.createObjectURL(archivo),
    });
    notificar(`Recibimos tu reporte ${reporte.codigo}. Aquí puedes seguirlo.`);
    navegar(RUTAS.misReportes);
  };

  return (
    <div className="pagina-angosta">
      <EncabezadoPagina
        titulo="Reportar un microbasurero"
        descripcion="Tres pasos: foto, ubicación y detalles. Todos los campos son obligatorios."
      />
      <ReporteForm zonas={zonas} categorias={categorias} onGuardar={guardar} />
    </div>
  );
}
