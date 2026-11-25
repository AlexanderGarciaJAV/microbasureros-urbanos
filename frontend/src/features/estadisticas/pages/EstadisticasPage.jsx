import Boton from '@/components/ui/Boton.jsx';
import EncabezadoPagina from '@/components/ui/EncabezadoPagina.jsx';
import { GraficoBarras, GraficoProporcion } from '@/components/ui/Graficos.jsx';
import { IconDescargar } from '@/components/ui/Iconos.jsx';
import Indicador from '@/components/ui/Indicador.jsx';
import Insignia from '@/components/ui/Insignia.jsx';
import TablaDatos from '@/components/ui/TablaDatos.jsx';
import { obtenerEstado } from '@/constants/estados.js';
import { useAviso } from '@/context/AvisoContext.jsx';
import { useCatalogos } from '@/hooks/useCatalogos.js';
import { descargarCsv } from '@/utils/exportarCsv.js';
import { formatearFecha } from '@/utils/formatos.js';
import { useEstadisticas } from '../hooks/useEstadisticas.js';

const ARCHIVO = 'reportes_microbasureros.csv';

export default function EstadisticasPage() {
  const datos = useEstadisticas();
  const { nombreCategoria, nombreZona } = useCatalogos();
  const { notificar } = useAviso();

  const exportar = () => {
    descargarCsv(ARCHIVO, datos.filasCsv);
    notificar(`Descargamos ${ARCHIVO}.`);
  };

  const columnas = [
    { clave: 'codigo', titulo: 'Código' },
    { clave: 'fecha', titulo: 'Fecha', render: ({ fecha }) => formatearFecha(fecha) },
    { clave: 'zonaId', titulo: 'Zona', render: ({ zonaId }) => nombreZona(zonaId) },
    {
      clave: 'categoriaId',
      titulo: 'Residuo',
      render: ({ categoriaId }) => nombreCategoria(categoriaId),
    },
    {
      clave: 'estadoId',
      titulo: 'Estado',
      render: ({ estadoId }) => {
        const estado = obtenerEstado(estadoId);
        return <Insignia tono={estado.tono}>{estado.nombre}</Insignia>;
      },
    },
  ];

  return (
    <>
      <EncabezadoPagina
        titulo="Estadísticas"
        descripcion="Los totales se actualizan con cada cambio de los demás módulos."
        acciones={
          <Boton variante="secundario" icono={IconDescargar} onClick={exportar}>
            Descargar CSV
          </Boton>
        }
      />
      <ul className="indicadores">
        <Indicador titulo="Reportes" valor={datos.total} />
        <Indicador
          titulo="Pendientes"
          valor={datos.pendientes}
          detalle="sin atender"
          tono="alerta"
        />
        <Indicador
          titulo="En proceso"
          valor={datos.enProceso}
          detalle="con cuadrilla"
          tono="info"
        />
        <Indicador
          titulo="Resueltos"
          valor={datos.resueltos}
          detalle={`${datos.porcentajeResuelto} % del total`}
          tono="exito"
        />
      </ul>
      <section className="tarjeta" aria-label="Reportes por estado">
        <h2>Por estado</h2>
        <GraficoProporcion titulo="Reportes por estado" datos={datos.porEstado} />
      </section>
      <div className="rejilla-2">
        <section className="tarjeta" aria-label="Reportes por zona">
          <h2>Por zona</h2>
          <GraficoBarras titulo="Reportes por zona" datos={datos.porZona} />
        </section>
        <section className="tarjeta" aria-label="Reportes por tipo de residuo">
          <h2>Por tipo de residuo</h2>
          <GraficoBarras titulo="Reportes por tipo de residuo" datos={datos.porCategoria} />
        </section>
      </div>
      <h2 className="titulo-seccion">Más recientes</h2>
      <TablaDatos
        titulo="Cinco reportes más recientes"
        columnas={columnas}
        filas={datos.recientes}
        vacio={{
          titulo: 'Aún no hay reportes',
          mensaje: 'Aparecerán cuando un ciudadano envíe el primero.',
        }}
      />
    </>
  );
}
