const checkoutService = require('../services/checkoutService');

function checkout(req, res, next) {
  try {
    const result = checkoutService.checkout(req.body);
    res.status(200).json({
      message: 'Checkout completed successfully',
      order: result,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { checkout };
