const express = require('express');
const router = express.Router();
const lotesController = require('../controllers/lotesController');

router.get('/', lotesController.getLotes);
router.get('/:id', lotesController.getLoteById);
router.post('/', lotesController.createLote);
router.post('/procesos', lotesController.createProceso);

module.exports = router;
