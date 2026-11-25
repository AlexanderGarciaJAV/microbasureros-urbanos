import { useState } from 'react';
import EncabezadoPagina from '@/components/ui/EncabezadoPagina.jsx';
import Pestanas from '@/components/ui/Pestanas.jsx';
import CatalogoPanel from '../components/CatalogoPanel.jsx';
import { TIPOS } from '../tipos.js';

const PESTANAS = Object.values(TIPOS).map(({ id, texto }) => ({ id, texto }));

export default function GestionPage() {
  const [activa, setActiva] = useState('zonas');
  return (
    <>
      <EncabezadoPagina
        titulo="Zonas y categorías"
        descripcion="Lo que está activo aparece en el formulario de reporte."
      />
      <Pestanas etiqueta="Catálogos" pestanas={PESTANAS} activa={activa} onCambiar={setActiva}>
        <CatalogoPanel key={activa} tipo={TIPOS[activa]} />
      </Pestanas>
    </>
  );
}
