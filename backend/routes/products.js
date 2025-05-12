const express = require('express');
const router = express.Router();
const { addProduct, editProduct } = require('../controller/products');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.post('/products', verifyToken, verifyAdmin, addProduct);
router.put('/products/:id', verifyToken, verifyAdmin, editProduct);
module.exports = router;
