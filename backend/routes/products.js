const express = require("express");
const router = express.Router();
const {
  addProduct,
  editProduct,
  getProduct,
  softDeleteProduct,
  getTypesAndSubTypes,
} = require("../controller/products");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.post("/products", addProduct);
router.put("/products/:id", verifyToken, verifyAdmin, editProduct);
router.get("/products", getProduct);
router.get("/products/types", getTypesAndSubTypes);
router.put("/products/delete/:id", verifyToken, verifyAdmin, softDeleteProduct);

module.exports = router;
