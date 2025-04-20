const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const limitChecker = require('../middlewares/limitChecker'); // pastikan file ini ada dan valid

router.post('/', limitChecker, foodController.scanFood);
router.get('/:userId', foodController.getUserFoods);

module.exports = router;
