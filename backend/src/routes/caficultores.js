const express = require('express');
const router = express.Router();
const caficultoresController = require('../controllers/caficultoresController');

router.get('/', caficultoresController.getCaficultores);
router.post('/', caficultoresController.createCaficultor);

module.exports = router;
