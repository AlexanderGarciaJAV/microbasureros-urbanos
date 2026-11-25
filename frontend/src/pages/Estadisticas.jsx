import { useMemo } from 'react';
import Badge from '../components/Badge.jsx';
import { BarChart, DonutChart } from '../components/Charts.jsx';
import { IconDownload } from '../components/Icons.jsx';
import { useApp } from '../context/AppContext.jsx';
import { ESTADOS, MUNICIPIOS } from '../data/seed.js';

const fmt = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

export default function Estadisticas() {
  const { reportes, zonas, categorias, notificar } = useApp();

  const total = reportes.length;
  const resueltos = reportes.filter((r) => r.estadoId === 3).length;
  const pendientes = reportes.filter((r) => r.estadoId === 1).length;

  const porZona = useMemo(
    () =>
      zonas
        .map((z) => ({ etiqueta: z.barrio, valor: reportes.filter((r) => r.zonaId === z.id).length }))
        .filter((d) => d.valor > 0),
    [reportes, zonas],
  );
  const porCategoria = useMemo(
    () => categorias.map((c) => ({ etiqueta: c.nombre, valor: reportes.filter((r) => r.categoriaId === c.id).length })).filter((d) => d.valor > 0),
    [reportes, categorias],
  );
  const recientes = [...reportes].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id).slice(0, 5);

  const exportar = () => {
    const filas = [['codigo', 'fecha', 'zona', 'barrio', 'municipio', 'categoria', 'estado']];
    reportes.forEach((r) => {
      const z = zonas.find((x) => x.id === r.zonaId);
      filas.push([
        r.codigo,
        r.fecha,
        z?.nombre ?? '',
        z?.barrio ?? '',
        MUNICIPIOS.find((m) => m.id === z?.municipioId)?.nombre ?? '',
        categorias.find((c) => c.id === r.categoriaId)?.nombre ?? '',
        ESTADOS.find((e) => e.id === r.estadoId)?.nombre ?? '',
      ]);
    });
    const csv = '﻿' + filas.map((f) => f.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(';')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reportes_microbasureros.csv';
    a.click();
    URL.revokeObjectURL(url);
    notificar('Se exportó el archivo reportes_microbasureros.csv.');
  };

  return (
    <section aria-labelledby="titulo-estadisticas">
      <div className="encabezado-pagina">
        <div>
          <h1 id="titulo-estadisticas">Estadísticas y Reportes</h1>
          <p className="lead">Dashboard administrativo de gestión de residuos.</p>
        </div>
        <button type="button" className="btn btn--outline" onClick={exportar}>
          <IconDownload /> Exportar CSV
        </button>
      </div>

      <ul className="kpis">
        <li className="tarjeta kpi">
          <h2>Reportes totales</h2>
          <p className="kpi__valor">{total}</p>
        </li>
        <li className="tarjeta kpi kpi--ok">
          <h2>Resueltos</h2>
          <p className="kpi__valor">{resueltos}</p>
          <small>{Math.round((resueltos / (total || 1)) * 100)}% del total</small>
        </li>
        <li className="tarjeta kpi kpi--alerta">
          <h2>Pendientes</h2>
          <p className="kpi__valor">{pendientes}</p>
          <small>sin atender</small>
        </li>
      </ul>

      <div className="rejilla-2">
        <article className="tarjeta">
          <h2>Microbasureros por Zona</h2>
          <BarChart datos={porZona} titulo="Microbasureros por zona" />
        </article>
        <article className="tarjeta">
          <h2>Reportes por Categoría</h2>
          <DonutChart datos={porCategoria} titulo="Reportes por categoría" />
        </article>
      </div>

      <article className="tarjeta tabla-contenedor">
        <div className="tarjeta__cabecera">
          <h2>Reportes Recientes</h2>
        </div>
        <table className="tabla">
          <caption className="sr-only">Cinco reportes más recientes</caption>
          <thead>
            <tr>
              <th scope="col">ID Reporte</th>
              <th scope="col">Fecha</th>
              <th scope="col">Zona</th>
              <th scope="col">Categoría</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            {recientes.map((r) => (
              <tr key={r.id}>
                <th scope="row" data-etiqueta="ID Reporte">#{r.codigo}</th>
                <td data-etiqueta="Fecha">{fmt(r.fecha)}</td>
                <td data-etiqueta="Zona">{zonas.find((z) => z.id === r.zonaId)?.barrio}</td>
                <td data-etiqueta="Categoría">{categorias.find((c) => c.id === r.categoriaId)?.nombre}</td>
                <td data-etiqueta="Estado"><Badge estadoId={r.estadoId} nombre={ESTADOS.find((e) => e.id === r.estadoId).nombre} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
}
