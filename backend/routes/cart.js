const express = require('express');
const router = express.Router();
const cartController = require('../controller/cart');

// Adicionar item ao carrinho
router.post('/', cartController.addToCart);

// Obter todos os itens do carrinho de um usuário
router.get('/:user_id', cartController.getCartItems);

// Atualizar quantidade de um item no carrinho
router.put('/:id', cartController.updateCartItem);

// Remover um item do carrinho
router.delete('/:id', cartController.removeFromCart);

module.exports = router;
