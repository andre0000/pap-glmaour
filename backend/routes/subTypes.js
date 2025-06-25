const express = require('express');
const router = express.Router();
const subTypesController = require('../controller/subTypes');

router.get('/', subTypesController.getAllSubTypes);
router.get('/:id', subTypesController.getSubTypeById);
router.post('/', subTypesController.createSubType);
router.put('/:id', subTypesController.updateSubType);
router.delete('/:id', subTypesController.softDeleteSubType);

module.exports = router;
