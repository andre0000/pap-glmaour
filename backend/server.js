const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');
const saleItemsRoutes = require('./routes/saleItems');
const cartRoutes = require('./routes/cart');
const suppliersRoutes = require('./routes/suppliers');
const typesRoutes = require('./routes/types');
const subTypesRoutes = require('./routes/subTypes');

dotenv.config();

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api', productRoutes);
app.use('/api/sale_items', saleItemsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/products', productRoutes);
app.use('/api/types', typesRoutes);
app.use('/api/subTypes', subTypesRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
