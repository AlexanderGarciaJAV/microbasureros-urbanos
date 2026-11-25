const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/v1/salud', (req, res) => {
  res.json({ exito: true, mensaje: 'API de microbasureros en funcionamiento' });
});

module.exports = app;
