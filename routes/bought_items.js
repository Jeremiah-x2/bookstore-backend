const boughtItemController = require('../controllers/bought_items');
const express = require('express');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, boughtItemController.buy_items);

module.exports = router;
