const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');

router.post('/', campaignController.create);
router.get('/', campaignController.getAll);
router.get('/:id', campaignController.getById);
router.post('/:id/execute', campaignController.execute);

module.exports = router;