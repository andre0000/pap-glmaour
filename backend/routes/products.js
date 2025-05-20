const express = require('express');
const router = express.Router();
const {
  addProduct,
  editProduct,
  getProduct,
} = require('../controller/products');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.post('/products', verifyToken, verifyAdmin, addProduct);
router.put('/products/:id', verifyToken, verifyAdmin, editProduct);
router.get('/products', getProduct);
module.exports = router;
