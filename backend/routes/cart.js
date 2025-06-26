const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart");

// Coloque rotas específicas ANTES das rotas dinâmicas
router.get("/bought", cartController.getBoughtItems);
router.get("/:user_id", cartController.getCartItems);
router.post("/", cartController.addToCart);
router.put("/:id", cartController.updateCartItem);
router.delete("/:id", cartController.removeFromCart);

module.exports = router;
