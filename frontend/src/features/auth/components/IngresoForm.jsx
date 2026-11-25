import Alerta from '@/components/ui/Alerta.jsx';
import Boton from '@/components/ui/Boton.jsx';
import CampoContrasena from '@/components/ui/CampoContrasena.jsx';
import CampoTexto from '@/components/ui/CampoTexto.jsx';
import { useFormulario } from '@/hooks/useFormulario.js';
import { validarIngreso } from '../validarAcceso.js';

export default function IngresoForm({ inicial, onIngresar }) {
  const { errorGeneral, estaEnviando, formularioRef, campo, enviar } = useFormulario({
    inicial,
    validar: validarIngreso,
    onGuardar: onIngresar,
  });
  return (
    <form ref={formularioRef} onSubmit={enviar} noValidate>
      {errorGeneral && <Alerta>{errorGeneral}</Alerta>}
      <CampoTexto
        etiqueta="Correo electrónico"
        type="email"
        autoComplete="email"
        {...campo('correo')}
      />
      <CampoContrasena
        etiqueta="Contraseña"
        autoComplete="current-password"
        {...campo('contrasena')}
      />
      <Boton type="submit" ancho estaCargando={estaEnviando}>
        Ingresar
      </Boton>
    </form>
  );
}
