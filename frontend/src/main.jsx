import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import { crearServiciosMemoria } from './api/crearServicios.js';
import './styles/index.css';

// La espera simula la red para comprobar los estados de carga.
const servicios = crearServiciosMemoria({ espera: 120 });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App servicios={servicios} />
    </HashRouter>
  </StrictMode>
);
