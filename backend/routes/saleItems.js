const express = require('express');
const router = express.Router();
const saleItemsController = require('../controller/saleItems');

// Criar itens para uma venda
router.post('/', saleItemsController.addSaleItems);

// Atualizar item específico da venda
router.put('/:id', saleItemsController.updateSaleItem);

// Remover item específico da venda
router.delete('/:id', saleItemsController.deleteSaleItem);

module.exports = router;
