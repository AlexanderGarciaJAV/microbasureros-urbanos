import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  CATEGORIAS_INICIALES,
  REPORTES_INICIALES,
  USUARIOS_DEMO,
  ZONAS_INICIALES,
} from '../data/seed.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [usuarios, setUsuarios] = useState(USUARIOS_DEMO);
  const [sesion, setSesion] = useState(null);
  const [reportes, setReportes] = useState(REPORTES_INICIALES);
  const [zonas, setZonas] = useState(ZONAS_INICIALES);
  const [categorias, setCategorias] = useState(CATEGORIAS_INICIALES);
  const [aviso, setAviso] = useState(null);

  const notificar = useCallback((mensaje, tipo = 'ok') => {
    setAviso({ mensaje, tipo, id: Date.now() });
    window.setTimeout(() => setAviso((a) => (a && Date.now() - a.id >= 3900 ? null : a)), 4000);
  }, []);

  const iniciarSesion = (correo, claveIngresada) => {
    const u = usuarios.find(
      (x) => x.correo.toLowerCase() === correo.trim().toLowerCase() && x.clave === claveIngresada,
    );
    if (!u) return { ok: false, error: 'Correo o contraseña incorrectos.' };
    setSesion(u);
    return { ok: true, usuario: u };
  };

  const registrarCiudadano = ({ nombre, apellido, correo, clave }) => {
    if (usuarios.some((x) => x.correo.toLowerCase() === correo.trim().toLowerCase())) {
      return { ok: false, error: 'Ya existe una cuenta con ese correo.' };
    }
    const nuevo = {
      correo: correo.trim(),
      clave,
      rol: 'ciudadano',
      nombre: `${nombre.trim()} ${apellido.trim()}`,
      ciudadanoId: 100 + usuarios.length,
    };
    setUsuarios((u) => [...u, nuevo]);
    setSesion(nuevo);
    return { ok: true, usuario: nuevo };
  };

  const cerrarSesion = () => setSesion(null);

  const agregarReporte = (datos) => {
    const id = Math.max(0, ...reportes.map((r) => r.id)) + 1;
    const nuevo = {
      id,
      codigo: `REP-${String(id).padStart(3, '0')}`,
      fecha: new Date().toLocaleDateString('en-CA'),
      estadoId: 1,
      observaciones: '',
      operarioId: null,
      ciudadanoId: sesion?.ciudadanoId ?? 0,
      ...datos,
    };
    setReportes((r) => [nuevo, ...r]);
    return nuevo;
  };

  const actualizarReporte = (id, cambios) =>
    setReportes((rs) => rs.map((r) => (r.id === id ? { ...r, ...cambios } : r)));

  const guardarZona = (z) =>
    setZonas((zs) =>
      z.id ? zs.map((x) => (x.id === z.id ? { ...x, ...z } : x)) : [...zs, { ...z, id: Math.max(0, ...zs.map((x) => x.id)) + 1 }],
    );

  const eliminarZona = (id) => {
    if (reportes.some((r) => r.zonaId === id)) {
      return { ok: false, error: 'No se puede eliminar: la zona tiene reportes asociados (ON DELETE RESTRICT). Desactívala en su lugar.' };
    }
    setZonas((zs) => zs.filter((x) => x.id !== id));
    return { ok: true };
  };

  const guardarCategoria = (c) =>
    setCategorias((cs) =>
      c.id ? cs.map((x) => (x.id === c.id ? { ...x, ...c } : x)) : [...cs, { ...c, id: Math.max(0, ...cs.map((x) => x.id)) + 1 }],
    );

  const eliminarCategoria = (id) => {
    if (reportes.some((r) => r.categoriaId === id)) {
      return { ok: false, error: 'No se puede eliminar: la categoría tiene reportes asociados (ON DELETE RESTRICT). Desactívala en su lugar.' };
    }
    setCategorias((cs) => cs.filter((x) => x.id !== id));
    return { ok: true };
  };

  const valor = useMemo(
    () => ({
      sesion, reportes, zonas, categorias, aviso,
      iniciarSesion, registrarCiudadano, cerrarSesion, agregarReporte, actualizarReporte,
      guardarZona, eliminarZona, guardarCategoria, eliminarCategoria, notificar,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sesion, reportes, zonas, categorias, aviso, usuarios],
  );

  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
