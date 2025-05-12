const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

dotenv.config();

app.use(express.json());

app.use(bodyParser.json());

// Rotas
app.use('/api/auth', authRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
