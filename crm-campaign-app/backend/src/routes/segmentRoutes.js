const express = require('express');
const router = express.Router();
const segmentController = require('../controllers/segmentController');

router.post('/', segmentController.create);
router.get('/', segmentController.getAll);
router.get('/:id', segmentController.getById);
router.get('/:id/customers', segmentController.getCustomersInSegment);

module.exports = router;