const bcrypt = require('bcryptjs');
const User = require('./User');
const Product = require('./Product');

const hashedPassword = bcrypt.hashSync('password123', 10);

const store = {
  users: [
    new User({ id: 1, username: 'alice', email: 'alice@example.com', password: hashedPassword }),
    new User({ id: 2, username: 'bob', email: 'bob@example.com', password: hashedPassword }),
    new User({ id: 3, username: 'carol', email: 'carol@example.com', password: hashedPassword }),
  ],
  products: [
    new Product({ id: 1, name: 'Wireless Headphones', description: 'Noise-cancelling over-ear headphones', price: 79.99, stock: 50 }),
    new Product({ id: 2, name: 'Smart Watch', description: 'Fitness tracker with heart rate monitor', price: 149.99, stock: 30 }),
    new Product({ id: 3, name: 'USB-C Hub', description: '7-in-1 multiport adapter', price: 39.99, stock: 100 }),
  ],
  nextUserId: 4,
};

module.exports = store;
