const celda = (valor) => `"${String(valor).replaceAll('"', '""')}"`;

/** Construye el texto CSV. El BOM inicial permite que Excel lea bien las tildes. */
export const construirCsv = (filas) =>
  '﻿' + filas.map((fila) => fila.map(celda).join(';')).join('\n');

export function descargarCsv(nombre, filas) {
  const url = URL.createObjectURL(
    new Blob([construirCsv(filas)], { type: 'text/csv;charset=utf-8' })
  );
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombre;
  enlace.click();
  URL.revokeObjectURL(url);
}
