import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Field from '../components/Field.jsx';
import { IconLeaf } from '../components/Icons.jsx';
import { useApp } from '../context/AppContext.jsx';
import { USUARIOS_DEMO } from '../data/seed.js';
import * as v from '../utils/validators.js';

export const inicioPorRol = (rol) => (rol === 'operario' ? '/tareas' : rol === 'administrador' ? '/estadisticas' : '/reportar');

export default function Auth() {
  const { sesion, iniciarSesion, registrarCiudadano, notificar } = useApp();
  const navegar = useNavigate();
  const [modo, setModo] = useState('registro'); // 'registro' | 'login'
  const [form, setForm] = useState({ nombre: '', apellido: '', correo: '', clave: '', confirmar: '' });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');

  if (sesion) return <Navigate to={inicioPorRol(sesion.rol)} replace />;

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errores[name]) setErrores((er) => ({ ...er, [name]: '' }));
  };

  const validar = () => {
    const e = {
      correo: v.correo(form.correo),
      clave: modo === 'login' ? v.required(form.clave) : v.clave(form.clave),
    };
    if (modo === 'registro') {
      e.nombre = v.nombre(form.nombre, 'El nombre');
      e.apellido = v.nombre(form.apellido, 'El apellido');
      e.confirmar = v.confirmar(form.confirmar, form.clave);
    }
    return e;
  };

  const enviar = (ev) => {
    ev.preventDefault();
    setErrorGeneral('');
    const e = validar();
    setErrores(e);
    if (v.hayErrores(e)) return;
    const r = modo === 'login' ? iniciarSesion(form.correo, form.clave) : registrarCiudadano(form);
    if (!r.ok) return setErrorGeneral(r.error);
    notificar(modo === 'login' ? `Bienvenido(a), ${r.usuario.nombre}.` : 'Cuenta creada correctamente.');
    navegar(inicioPorRol(r.usuario.rol));
  };

  const cambiarModo = (m) => {
    setModo(m);
    setErrores({});
    setErrorGeneral('');
  };

  return (
    <div className="auth">
      <div className="auth__marca">
        <span className="auth__logo">
          <IconLeaf width={34} height={34} />
        </span>
        <h1>Limpieza Urbana</h1>
        <p>Sistema Ciudadano de Reporte</p>
      </div>

      <section className="tarjeta auth__tarjeta" aria-labelledby="auth-titulo">
        <div className="pestanas" role="tablist" aria-label="Acceso">
          <button type="button" role="tab" aria-selected={modo === 'registro'} onClick={() => cambiarModo('registro')}>
            Crear cuenta
          </button>
          <button type="button" role="tab" aria-selected={modo === 'login'} onClick={() => cambiarModo('login')}>
            Iniciar sesión
          </button>
        </div>

        <h2 id="auth-titulo">{modo === 'registro' ? 'Crear una cuenta' : 'Bienvenido de nuevo'}</h2>

        <form onSubmit={enviar} noValidate>
          {errorGeneral && (
            <div className="alerta alerta--error" role="alert">
              {errorGeneral}
            </div>
          )}

          {modo === 'registro' && (
            <div className="fila">
              <Field label="Nombre" name="nombre" value={form.nombre} onChange={cambiar} error={errores.nombre} placeholder="Tu nombre" autoComplete="given-name" maxLength={80} required />
              <Field label="Apellido" name="apellido" value={form.apellido} onChange={cambiar} error={errores.apellido} placeholder="Tu apellido" autoComplete="family-name" maxLength={80} required />
            </div>
          )}

          <Field label="Correo electrónico" type="email" name="correo" value={form.correo} onChange={cambiar} error={errores.correo} placeholder="ejemplo@correo.com" autoComplete="email" maxLength={120} required />
          <Field label="Contraseña" type="password" name="clave" value={form.clave} onChange={cambiar} error={errores.clave} placeholder={modo === 'registro' ? 'Mínimo 8 caracteres' : 'Tu contraseña'} hint={modo === 'registro' ? 'Combina letras y números.' : undefined} autoComplete={modo === 'registro' ? 'new-password' : 'current-password'} maxLength={64} required />
          {modo === 'registro' && (
            <Field label="Confirmar contraseña" type="password" name="confirmar" value={form.confirmar} onChange={cambiar} error={errores.confirmar} placeholder="Repite tu contraseña" autoComplete="new-password" maxLength={64} required />
          )}

          <button type="submit" className="btn btn--primario btn--bloque">
            {modo === 'registro' ? 'Registrarme' : 'Ingresar'}
          </button>
        </form>

        <p className="auth__cambio">
          {modo === 'registro' ? '¿Ya tienes cuenta?' : '¿Aún no tienes cuenta?'}{' '}
          <button type="button" className="enlace" onClick={() => cambiarModo(modo === 'registro' ? 'login' : 'registro')}>
            {modo === 'registro' ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </p>
      </section>

      <aside className="demo" aria-label="Cuentas de demostración">
        <h2>Cuentas de demostración</h2>
        <p>Todavía no hay conexión con el servidor; usa estas cuentas para recorrer cada rol:</p>
        <ul>
          {USUARIOS_DEMO.map((u) => (
            <li key={u.correo}>
              <strong>{u.rol}</strong>: <code>{u.correo}</code> / <code>{u.clave}</code>
              <button type="button" className="enlace" onClick={() => { setModo('login'); setForm((f) => ({ ...f, correo: u.correo, clave: u.clave })); setErrores({}); }}>
                Usar
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <p className="auth__pie">Al registrarte, contribuyes al mantenimiento y limpieza de los espacios públicos de nuestra ciudad.</p>
    </div>
  );
}
