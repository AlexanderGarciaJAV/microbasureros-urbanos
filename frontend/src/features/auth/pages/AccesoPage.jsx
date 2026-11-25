import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Boton from '@/components/ui/Boton.jsx';
import { IconCamara, IconCorrecto, IconEscoba } from '@/components/ui/Iconos.jsx';
import Pestanas from '@/components/ui/Pestanas.jsx';
import { useAuth } from '@/context/AuthContext.jsx';
import { useAviso } from '@/context/AvisoContext.jsx';
import { useTituloPagina } from '@/hooks/useTituloPagina.js';
import { inicioDe } from '@/routes/rutas.js';
import IngresoForm from '../components/IngresoForm.jsx';
import RegistroForm from '../components/RegistroForm.jsx';
import { CUENTAS_DEMO } from '../cuentasDemo.js';

const PESTANAS = [
  { id: 'ingreso', texto: 'Iniciar sesión' },
  { id: 'registro', texto: 'Crear cuenta' },
];
const PASOS = [
  { icono: IconCamara, texto: 'Reporta el punto con una foto y su ubicación.' },
  { icono: IconEscoba, texto: 'Una cuadrilla de aseo lo atiende.' },
  { icono: IconCorrecto, texto: 'Sigue cada avance hasta que quede limpio.' },
];
const VACIO = { correo: '', contrasena: '' };

export default function AccesoPage() {
  const { sesion, iniciarSesion, registrarCiudadano } = useAuth();
  const { notificar } = useAviso();
  const [pestana, setPestana] = useState('ingreso');
  const [credenciales, setCredenciales] = useState(VACIO);
  useTituloPagina('Acceso');

  if (sesion) return <Navigate to={inicioDe(sesion.rol)} replace />;

  const ingresar = async (datos) => {
    await iniciarSesion(datos);
    notificar('Iniciaste sesión.');
  };
  const registrar = async (datos) => {
    await registrarCiudadano(datos);
    notificar('Tu cuenta está lista. Ya puedes reportar.');
  };

  return (
    <div className="acceso">
      <section className="acceso__presentacion">
        <h1>Un punto limpio empieza con un reporte</h1>
        <ol>
          {PASOS.map(({ icono: Icono, texto }) => (
            <li key={texto}>
              <span>
                <Icono />
              </span>
              {texto}
            </li>
          ))}
        </ol>
      </section>

      <section className="tarjeta acceso__tarjeta" aria-label="Acceso al sistema">
        <Pestanas etiqueta="Acceso" pestanas={PESTANAS} activa={pestana} onCambiar={setPestana}>
          {pestana === 'ingreso' ? (
            <IngresoForm key={credenciales.correo} inicial={credenciales} onIngresar={ingresar} />
          ) : (
            <RegistroForm onRegistrar={registrar} />
          )}
        </Pestanas>

        {pestana === 'ingreso' && (
          <div className="demo">
            <p>Cuentas de demostración (datos ficticios):</p>
            <div className="demo__botones">
              {CUENTAS_DEMO.map((cuenta) => (
                <Boton
                  key={cuenta.rol}
                  variante="secundario"
                  onClick={() => setCredenciales(cuenta.credenciales)}
                >
                  {cuenta.rol}
                </Boton>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
