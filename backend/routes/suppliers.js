const express = require("express");
const router = express.Router();
const suppliersController = require("../controller/suppliers");

// Rotas para fornecedores
router.post("/", suppliersController.addSupplier);
router.get("/", suppliersController.getAllSuppliers);
router.get("/:id", suppliersController.getSupplierById);
router.put("/:id", suppliersController.updateSupplier);
router.put("/delete/:id", suppliersController.softDeleteSupplier);

module.exports = router;
