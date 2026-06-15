const productService = require('./productService');

const VALID_PAYMENT_METHODS = ['cash', 'credit_card'];
const CASH_DISCOUNT_RATE = 0.1;

function checkout({ items, paymentMethod }) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    const error = new Error('Items array is required and must not be empty');
    error.statusCode = 400;
    throw error;
  }

  if (!paymentMethod) {
    const error = new Error('Payment method is required');
    error.statusCode = 400;
    throw error;
  }

  if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    const error = new Error('Payment method must be "cash" or "credit_card"');
    error.statusCode = 400;
    throw error;
  }

  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const { productId, quantity } = item;

    if (!productId || !quantity || quantity < 1) {
      const error = new Error('Each item must have a valid productId and quantity >= 1');
      error.statusCode = 400;
      throw error;
    }

    const product = productService.findById(productId);
    if (!product) {
      const error = new Error(`Product with id ${productId} not found`);
      error.statusCode = 404;
      throw error;
    }

    if (product.stock < quantity) {
      const error = new Error(`Insufficient stock for product "${product.name}"`);
      error.statusCode = 400;
      throw error;
    }

    const lineTotal = product.price * quantity;
    subtotal += lineTotal;

    orderItems.push({
      productId: product.id,
      name: product.name,
      quantity,
      unitPrice: product.price,
      lineTotal,
    });
  }

  for (const item of items) {
    productService.reduceStock(item.productId, item.quantity);
  }

  const discount = paymentMethod === 'cash' ? subtotal * CASH_DISCOUNT_RATE : 0;
  const total = subtotal - discount;

  return {
    items: orderItems,
    paymentMethod,
    subtotal: roundCurrency(subtotal),
    discount: roundCurrency(discount),
    total: roundCurrency(total),
  };
}

function roundCurrency(value) {
  return Math.round(value * 100) / 100;
}

module.exports = { checkout };
