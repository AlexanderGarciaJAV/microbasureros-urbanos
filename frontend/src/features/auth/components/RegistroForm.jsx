import Alerta from '@/components/ui/Alerta.jsx';
import Boton from '@/components/ui/Boton.jsx';
import CampoContrasena from '@/components/ui/CampoContrasena.jsx';
import CampoTexto from '@/components/ui/CampoTexto.jsx';
import { useFormulario } from '@/hooks/useFormulario.js';
import { validarRegistro } from '../validarAcceso.js';

const INICIAL = { nombre: '', apellido: '', correo: '', contrasena: '', confirmacion: '' };

export default function RegistroForm({ onRegistrar }) {
  const { errorGeneral, estaEnviando, formularioRef, campo, enviar } = useFormulario({
    inicial: INICIAL,
    validar: validarRegistro,
    onGuardar: onRegistrar,
  });
  return (
    <form ref={formularioRef} onSubmit={enviar} noValidate>
      {errorGeneral && <Alerta>{errorGeneral}</Alerta>}
      <div className="fila">
        <CampoTexto etiqueta="Nombre" autoComplete="given-name" {...campo('nombre')} />
        <CampoTexto etiqueta="Apellido" autoComplete="family-name" {...campo('apellido')} />
      </div>
      <CampoTexto
        etiqueta="Correo electrónico"
        type="email"
        autoComplete="email"
        {...campo('correo')}
      />
      <CampoContrasena
        etiqueta="Contraseña"
        ayuda="Mínimo 8 caracteres, con letras y números."
        autoComplete="new-password"
        {...campo('contrasena')}
      />
      <CampoContrasena
        etiqueta="Repite la contraseña"
        autoComplete="new-password"
        {...campo('confirmacion')}
      />
      <Boton type="submit" ancho estaCargando={estaEnviando}>
        Crear cuenta
      </Boton>
    </form>
  );
}
