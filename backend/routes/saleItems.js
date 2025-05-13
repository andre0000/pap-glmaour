const express = require('express');
const router = express.Router();
const saleItemsController = require('../controller/saleItems');

// Adicionar item comprado (sem sale_id)
router.post('/', saleItemsController.addSaleItem);

// Atualizar item específico da venda
router.put('/:id', saleItemsController.updateSaleItem);

// Obter todos os itens de venda
router.get('/', saleItemsController.getSaleItems);

// Obter um item específico de venda
router.get('/:id', saleItemsController.getSaleItemById);

// Remover item específico da venda
router.delete('/:id', saleItemsController.deleteSaleItem);

module.exports = router;
