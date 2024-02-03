const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.route('/').post(userController.create_user);
router.post('/login', userController.login);

module.exports = router;
