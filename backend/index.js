const express = require('express');
const cors = require('cors');
const planningRoutes = require('./routes/planningRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/api/planning', planningRoutes);

app.listen(PORT, () => {
  console.log(`Servidor backend activo en http://localhost:${PORT}`);
});