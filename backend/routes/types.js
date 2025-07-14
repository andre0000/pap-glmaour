const express = require("express");
const router = express.Router();
const typesController = require("../controller/types");

router.get("/", typesController.getAllTypes);
router.get("/:id", typesController.getTypeById);
router.post("/", typesController.createType);
router.put("/:id", typesController.updateType);
router.put("/delete/:id", typesController.softDeleteType);

module.exports = router;
