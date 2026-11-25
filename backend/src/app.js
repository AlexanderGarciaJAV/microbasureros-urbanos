const express = require('express');
const cors = require('cors');
const AppError = require('./shared/errors/AppError');
const manejarErrores = require('./shared/middlewares/manejarErrores');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/v1/salud', (req, res) => {
  res.json({ exito: true, mensaje: 'API de microbasureros en funcionamiento' });
});

app.use((req, res, next) => next(new AppError('La ruta no existe', 404)));
app.use(manejarErrores);

module.exports = app;
