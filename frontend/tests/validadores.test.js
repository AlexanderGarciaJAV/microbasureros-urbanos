import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as v from '../src/utils/validadores.js';
import { validarRegistro } from '../src/features/auth/validarAcceso.js';
import { validarReporte } from '../src/features/reportes/validarReporte.js';
import { validarAccion } from '../src/features/acciones-limpieza/validarAccion.js';

test('requerido rechaza vacío y espacios', () => {
  assert.notEqual(v.requerido()(''), '');
  assert.notEqual(v.requerido()('   '), '');
  assert.equal(v.requerido()('dato'), '');
});

test('longitud informa cuántos caracteres lleva el usuario', () => {
  assert.match(v.longitud(10, 20)('hola'), /llevas 4/);
  assert.match(v.longitud(1, 3)('demasiado'), /máximo 3/);
});

test('formatoCorreo acepta correos válidos y rechaza incompletos', () => {
  assert.equal(v.formatoCorreo()('ana@correo.com'), '');
  ['ana', 'ana@', 'ana@correo', 'a na@correo.com'].forEach((correo) =>
    assert.notEqual(v.formatoCorreo()(correo), '')
  );
});

test('numeroEntre no confunde espacios con cero', () => {
  assert.notEqual(v.numeroEntre(-90, 90)('   '), '');
  assert.notEqual(v.numeroEntre(-90, 90)('91'), '');
  assert.notEqual(v.numeroEntre(-90, 90)('abc'), '');
  assert.equal(v.numeroEntre(-90, 90)('0'), '');
  assert.equal(v.numeroEntre(-90, 90)('7,76'), '');
});

test('fotografia valida presencia, tipo y tamaño', () => {
  assert.notEqual(v.fotografia()(null), '');
  assert.notEqual(v.fotografia()({ type: 'application/pdf', size: 10 }), '');
  assert.notEqual(v.fotografia()({ type: 'image/png', size: 6 * 1024 * 1024 }), '');
  assert.equal(v.fotografia()({ type: 'image/jpeg', size: 1024 }), '');
});

test('el registro exige contraseñas iguales y seguras', () => {
  const base = { nombre: 'Ana', apellido: 'Ruiz', correo: 'ana@correo.com' };
  assert.deepEqual(
    validarRegistro({ ...base, contrasena: 'Segura123', confirmacion: 'Segura123' }),
    {}
  );
  assert.ok(
    validarRegistro({ ...base, contrasena: 'Segura123', confirmacion: 'otra' }).confirmacion
  );
  assert.ok(
    validarRegistro({ ...base, contrasena: 'sinnumeros', confirmacion: 'sinnumeros' }).contrasena
  );
});

test('un reporte vacío marca todos sus campos obligatorios', () => {
  const errores = validarReporte({
    archivo: null,
    latitud: '',
    longitud: '',
    categoriaId: '',
    zonaId: '',
    descripcion: '',
  });
  assert.equal(Object.keys(errores).length, 6);
});

test('no se marca Resuelto si el resultado fue que no se pudo limpiar', () => {
  const accion = { resultado: 'Sin_accion', descripcion: 'La vía estaba cerrada.', estadoId: '3' };
  assert.ok(validarAccion(accion).estadoId);
  assert.deepEqual(validarAccion({ ...accion, resultado: 'Limpieza_total' }), {});
});
