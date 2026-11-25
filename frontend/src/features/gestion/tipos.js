import ZonaForm from './components/ZonaForm.jsx';
import CategoriaForm from './components/CategoriaForm.jsx';
import { obtenerMunicipio } from '@/constants/catalogos.js';

// Configuración de cada catálogo. Agregar otro es añadir un elemento; la página no cambia.
export const TIPOS = {
  zonas: {
    id: 'zonas',
    texto: 'Zonas',
    singular: 'zona',
    Formulario: ZonaForm,
    columna: {
      clave: 'municipioId',
      titulo: 'Municipio',
      render: ({ municipioId }) => {
        const municipio = obtenerMunicipio(municipioId);
        return `${municipio.nombre}, ${municipio.departamento}`;
      },
    },
    detalle: ({ barrio }) => `Barrio ${barrio}`,
  },
  categorias: {
    id: 'categorias',
    texto: 'Categorías de residuo',
    singular: 'categoría',
    Formulario: CategoriaForm,
    columna: { clave: 'descripcion', titulo: 'Descripción' },
    detalle: () => null,
  },
};
