const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');
const saleItemsRoutes = require('./routes/saleItems');

dotenv.config();

app.use(express.json());

app.use(bodyParser.json());

// Rotas
app.use('/api/auth', authRoutes, salesRoutes);
app.use('/api', productRoutes);
app.use('/api/sale-items', saleItemsRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
