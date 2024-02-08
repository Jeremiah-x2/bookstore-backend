const express = require('express');
const router = express.Router();
const bookControllers = require('../controllers/books');
const protect = require('../middleware/authMiddleware');

router.get('/', protect, bookControllers.get_books);
router.get('/:bookId', protect, bookControllers.get_book_by_id);
// router.get('/auth', protect, bookControllers.get_books_for_authenticated);
// router.get('/orders', protect, bookControllers.get_orders);

// router.post('/order/:orderId', protect, bookControllers.create_order);
// router.patch('/order/:orderId', protect, bookControllers.update_order);

module.exports = router;
