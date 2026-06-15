const store = require('../models/data');

function findById(id) {
  return store.products.find((p) => p.id === id);
}

function getAll() {
  return store.products;
}

function reduceStock(productId, quantity) {
  const product = findById(productId);
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

  product.stock -= quantity;
  return product;
}

module.exports = { findById, getAll, reduceStock };
