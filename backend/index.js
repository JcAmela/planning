const express = require('express');
const cors = require('cors');
const planningRoutes = require('./routes/planningRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Ruta para planificación
app.use('/api/planning', planningRoutes);

// Nueva ruta para obtener la fecha actual del servidor
app.get('/api/date', (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Eliminamos la hora para devolver solo fecha de hoy
  res.json({ today: today.toISOString() });
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor backend activo en http://localhost:${PORT}`);
});
