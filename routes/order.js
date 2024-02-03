const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
const protect = require('../middleware/authMiddleware');

router
    .route('/')
    .post(protect, orderController.create_order)
    .get(protect, orderController.get_orders);

router.get('/:orderId', protect, orderController.get_order_by_id);

module.exports = router;
