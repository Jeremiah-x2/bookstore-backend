const express = require('express');
const router = express.Router();
const bookControllers = require('../controllers/books');
const protect = require('../middleware/authMiddleware');

router.get('/', bookControllers.get_books);
router.get('/auth', protect, bookControllers.get_books_for_authenticated);
router.get('/orders', protect, bookControllers.get_orders);

router.get('/:bookId', bookControllers.get_book_by_id);

router.post('/order/:orderId', protect, bookControllers.create_order);
router.patch('/order/:orderId', protect, bookControllers.update_order);

module.exports = router;
