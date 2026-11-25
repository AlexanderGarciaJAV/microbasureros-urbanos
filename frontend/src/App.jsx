import Encabezado from '@/components/layout/Encabezado.jsx';
import PieDePagina from '@/components/layout/PieDePagina.jsx';
import Aviso from '@/components/ui/Aviso.jsx';
import { AuthProvider } from '@/context/AuthContext.jsx';
import { AvisoProvider } from '@/context/AvisoContext.jsx';
import { DatosProvider } from '@/context/DatosContext.jsx';
import AppRouter from '@/routes/AppRouter.jsx';

export default function App({ servicios }) {
  return (
    <AvisoProvider>
      <AuthProvider servicio={servicios.auth}>
        <DatosProvider servicios={servicios}>
          <a className="saltar" href="#contenido" onClick={saltarAlContenido}>
            Saltar al contenido
          </a>
          <Encabezado />
          <main id="contenido" className="principal" tabIndex={-1}>
            <AppRouter />
          </main>
          <Aviso />
          <PieDePagina />
        </DatosProvider>
      </AuthProvider>
    </AvisoProvider>
  );
}

// HashRouter usa el # de la dirección; se evita que el enlace cambie de ruta.
function saltarAlContenido(evento) {
  evento.preventDefault();
  document.getElementById('contenido').focus();
}
