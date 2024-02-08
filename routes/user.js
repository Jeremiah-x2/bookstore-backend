const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const protect = require('../middleware/authMiddleware');

router.route('/').post(userController.create_user);
router.post('/login', userController.login);
router.get('/:userId', protect, userController.get_user);

module.exports = router;
