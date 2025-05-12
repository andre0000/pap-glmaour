const express = require('express');
const router = express.Router();
const { createSale, editSale } = require('../controller/sales');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.post('/sales', verifyToken, verifyAdmin, createSale);
router.put('/sales/:id', verifyToken, verifyAdmin, editSale);

module.exports = router;
