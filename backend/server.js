const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');
const saleItemsRoutes = require('./routes/saleItems');
const cartRoutes = require('./routes/cart');
const suppliersRoutes = require('./routes/suppliers');

dotenv.config();

app.use(express.json());

app.use(bodyParser.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api', productRoutes);
app.use('/api/sale_items', saleItemsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/suppliers', suppliersRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
