const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const store = require('../models/data');

const JWT_SECRET = process.env.JWT_SECRET || 'ecommerce-eurostar2026-secret';
const JWT_EXPIRES_IN = '1h';

function findByEmail(email) {
  return store.users.find((u) => u.email === email);
}

function findByUsername(username) {
  return store.users.find((u) => u.username === username);
}

function findById(id) {
  return store.users.find((u) => u.id === id);
}

function register({ username, email, password }) {
  if (!username || !email || !password) {
    const error = new Error('Username, email, and password are required');
    error.statusCode = 400;
    throw error;
  }

  if (findByEmail(email)) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  if (findByUsername(username)) {
    const error = new Error('Username already taken');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({
    id: store.nextUserId++,
    username,
    email,
    password: hashedPassword,
  });

  store.users.push(user);

  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    token,
    user: { id: user.id, username: user.username, email: user.email },
  };
}

function login({ email, password }) {
  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }

  const user = findByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    token,
    user: { id: user.id, username: user.username, email: user.email },
  };
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { register, login, verifyToken, findById };
