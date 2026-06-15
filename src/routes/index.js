const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const checkoutController = require('../controllers/checkoutController');
const swaggerController = require('../controllers/swaggerController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/checkout', authenticate, checkoutController.checkout);
router.get('/swagger', swaggerController.getSwaggerSpec);

module.exports = router;
