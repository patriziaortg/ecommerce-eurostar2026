const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const checkoutController = require('../controllers/checkoutController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/checkout', authenticate, checkoutController.checkout);

module.exports = router;
