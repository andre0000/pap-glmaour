const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart");

router.get("/bought", cartController.getBoughtItems);
router.get("/:user_id", cartController.getCartItems);
router.post("/", cartController.addToCart);
router.put("/:id", cartController.updateCartItem);
router.put("/:id/remove", cartController.removeFromCart);
router.put("/:user_id/clear", cartController.clearCart);
router.put("/:user_id/checkout", cartController.markCartAsBought);

module.exports = router;
