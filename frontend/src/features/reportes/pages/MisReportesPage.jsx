import { useState } from 'react';
import { Link } from 'react-router-dom';
import Boton from '@/components/ui/Boton.jsx';
import Buscador from '@/components/ui/Buscador.jsx';
import EncabezadoPagina from '@/components/ui/EncabezadoPagina.jsx';
import EstadoVacio from '@/components/ui/EstadoVacio.jsx';
import Filtros from '@/components/ui/Filtros.jsx';
import { IconCamara, IconLupa, IconMas } from '@/components/ui/Iconos.jsx';
import Paginacion from '@/components/ui/Paginacion.jsx';
import { useCatalogos } from '@/hooks/useCatalogos.js';
import { usePaginacion } from '@/hooks/usePaginacion.js';
import { RUTAS } from '@/routes/rutas.js';
import DetalleReporte from '../components/DetalleReporte.jsx';
import TarjetaReporte from '../components/TarjetaReporte.jsx';
import { useReportes } from '../hooks/useReportes.js';

const POR_PAGINA = 6;

export default function MisReportesPage() {
  const { filtrados, tieneReportes, opciones, estadoId, setEstadoId, busqueda, setBusqueda } =
    useReportes();
  const { nombreCategoria, nombreZona } = useCatalogos();
  const { visibles, ...paginacion } = usePaginacion(filtrados, POR_PAGINA);
  const [abierto, setAbierto] = useState(null);

  const enlaceReportar = (
    <Link to={RUTAS.nuevoReporte} className="btn btn--primario">
      <IconMas /> <span>Reportar</span>
    </Link>
  );
  const limpiar = () => {
    setEstadoId(0);
    setBusqueda('');
  };

  return (
    <>
      <EncabezadoPagina
        titulo="Mis reportes"
        descripcion="Abre un reporte para ver su seguimiento."
        acciones={enlaceReportar}
      />
      {!tieneReportes ? (
        <EstadoVacio
          icono={IconCamara}
          titulo="Aún no has reportado"
          mensaje="Cuando envíes tu primer reporte podrás seguirlo desde aquí."
          accion={enlaceReportar}
        />
      ) : (
        <>
          <div className="herramientas">
            <Buscador etiqueta="Buscar en mis reportes" valor={busqueda} onCambiar={setBusqueda} />
            <Filtros
              etiqueta="Filtrar por estado"
              opciones={opciones}
              valor={estadoId}
              onCambiar={setEstadoId}
            />
          </div>
          {visibles.length === 0 ? (
            <EstadoVacio
              icono={IconLupa}
              titulo="No hay coincidencias"
              mensaje="Prueba con otra palabra o con otro estado."
              accion={
                <Boton variante="secundario" onClick={limpiar}>
                  Quitar filtros
                </Boton>
              }
            />
          ) : (
            <>
              <ul className="rejilla-tarjetas">
                {visibles.map((reporte) => (
                  <TarjetaReporte
                    key={reporte.id}
                    reporte={reporte}
                    categoria={nombreCategoria(reporte.categoriaId)}
                    zona={nombreZona(reporte.zonaId)}
                    onAbrir={() => setAbierto(reporte)}
                  />
                ))}
              </ul>
              <Paginacion {...paginacion} />
            </>
          )}
        </>
      )}
      {abierto && <DetalleReporte reporte={abierto} onCerrar={() => setAbierto(null)} />}
    </>
  );
}
