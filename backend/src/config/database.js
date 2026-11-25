const mysql = require('mysql2/promise');
const env = require('./env');

const pool = mysql.createPool({ ...env.db, connectionLimit: 10, charset: 'utf8mb4' });

/**
 * Ejecuta una operación dentro de una transacción.
 * @param {Function} operacion - Recibe la conexión y devuelve una promesa.
 * @returns {Promise<*>} Resultado de la operación.
 */
async function ejecutarTransaccion(operacion) {
  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();
    const resultado = await operacion(conexion);
    await conexion.commit();
    return resultado;
  } catch (error) {
    await conexion.rollback(); // ni el estado ni el historial se guardan
    throw error;
  } finally {
    conexion.release();
  }
}

module.exports = { pool, ejecutarTransaccion };
