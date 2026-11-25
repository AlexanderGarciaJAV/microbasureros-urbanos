import assert from 'node:assert/strict';
import { test } from 'node:test';
import { crearServiciosMemoria } from '../src/api/crearServicios.js';
import { ESTADO, obtenerTransiciones } from '../src/constants/estados.js';

const CIUDADANO = { rol: 'ciudadano', nombre: 'Laura', ciudadanoId: 1 };
const OPERARIO = { rol: 'operario', nombre: 'Jorge', operarioId: 1 };
const ADMIN = { rol: 'administrador', nombre: 'Admin' };
const REPORTE = {
  descripcion: 'Prueba',
  latitud: 1,
  longitud: 1,
  zonaId: 1,
  categoriaId: 1,
  foto: null,
};

test('iniciar sesión no devuelve la contraseña', async () => {
  const { auth } = crearServiciosMemoria();
  const usuario = await auth.iniciarSesion({
    correo: 'LAURA.martinez@example.com ',
    contrasena: 'Ciudadano123',
  });
  assert.equal(usuario.nombre, 'Laura Martínez');
  assert.equal('contrasena' in usuario, false);
  await assert.rejects(
    auth.iniciarSesion({ correo: 'laura.martinez@example.com', contrasena: 'x' }),
    {
      codigo: 401,
    }
  );
});

test('no se registra dos veces el mismo correo', async () => {
  const { auth } = crearServiciosMemoria();
  const datos = {
    nombre: 'A',
    apellido: 'B',
    correo: 'laura.martinez@example.com',
    contrasena: 'x',
  };
  await assert.rejects(auth.registrarCiudadano(datos), { codigo: 409, campo: 'correo' });
});

test('el ciudadano solo ve sus reportes y el nuevo queda Pendiente con historial', async () => {
  const { reportes } = crearServiciosMemoria();
  const nuevo = await reportes.crear(REPORTE, CIUDADANO);
  assert.equal(nuevo.estadoId, ESTADO.PENDIENTE);
  assert.equal(nuevo.codigo, 'REP-013');
  const propios = await reportes.listar(CIUDADANO);
  assert.ok(propios.every((reporte) => reporte.ciudadanoId === 1));
  const historial = await reportes.listarHistorial();
  assert.equal(historial.filter((registro) => registro.reporteId === nuevo.id).length, 1);
});

test('un reporte no pasa a Resuelto sin acción de limpieza', async () => {
  const { reportes, acciones } = crearServiciosMemoria();
  const { id } = await reportes.crear(REPORTE, CIUDADANO);
  await reportes.cambiarEstado(id, ESTADO.EN_PROCESO, OPERARIO);
  await assert.rejects(reportes.cambiarEstado(id, ESTADO.RESUELTO, OPERARIO), { codigo: 409 });
  await acciones.registrar(
    { reporteId: id, resultado: 'Limpieza_total', descripcion: 'Listo' },
    OPERARIO
  );
  const resuelto = await reportes.cambiarEstado(id, ESTADO.RESUELTO, OPERARIO);
  assert.equal(resuelto.estadoId, ESTADO.RESUELTO);
});

test('solo el administrador rechaza y reabre', () => {
  assert.deepEqual(obtenerTransiciones('operario', ESTADO.PENDIENTE), [ESTADO.EN_PROCESO]);
  assert.ok(obtenerTransiciones('administrador', ESTADO.PENDIENTE).includes(ESTADO.RECHAZADO));
  assert.deepEqual(obtenerTransiciones('administrador', ESTADO.RECHAZADO), []);
  assert.deepEqual(obtenerTransiciones('ciudadano', ESTADO.PENDIENTE), []);
});

test('solo el operario registra acciones de limpieza', async () => {
  const { acciones } = crearServiciosMemoria();
  await assert.rejects(
    acciones.registrar({ reporteId: 5, resultado: 'Limpieza_total', descripcion: 'x' }, ADMIN),
    { codigo: 403 }
  );
});

test('una zona con reportes no se elimina; una sin reportes sí', async () => {
  const { zonas } = crearServiciosMemoria();
  await assert.rejects(zonas.eliminar(1), { codigo: 409 });
  const nueva = await zonas.guardar({
    nombre: 'Nueva',
    barrio: 'Uno',
    municipioId: 1,
    activo: true,
  });
  await zonas.eliminar(nueva.id);
  assert.equal(
    (await zonas.listar()).some((zona) => zona.id === nueva.id),
    false
  );
});

test('el nombre de categoría no se repite aunque cambien mayúsculas o tildes', async () => {
  const { categorias } = crearServiciosMemoria();
  await assert.rejects(
    categorias.guardar({ nombre: ' residuos ORGANICOS ', descripcion: 'x', activo: true }),
    { codigo: 409, campo: 'nombre' }
  );
});

test('las colecciones devuelven copias', async () => {
  const { zonas } = crearServiciosMemoria();
  const [primera] = await zonas.listar();
  primera.nombre = 'Cambiada por fuera';
  assert.equal((await zonas.listar())[0].nombre, 'Zona Centro');
});
