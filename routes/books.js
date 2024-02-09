const express = require('express');
const router = express.Router();
const bookControllers = require('../controllers/books');
const protect = require('../middleware/authMiddleware');

router.get('/', protect, bookControllers.get_books);
router.get('/:bookId', protect, bookControllers.get_book_by_id);


module.exports = router;
