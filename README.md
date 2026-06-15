# E-Commerce REST API

## Description

A lightweight REST API for an e-commerce platform built with **JavaScript** and **Express**. The API supports user registration, JWT-based authentication, and checkout with payment-method rules. All data is stored in memory — no database is required.

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ecommerce-eurostar2026
```

2. Install dependencies:

```bash
npm install
```

## How to Run

Start the server:

```bash
npm start
```

The API will be available at `http://localhost:3000`.

For development with auto-restart on file changes:

```bash
npm run dev
```

## Rules

- **Authentication**: Only authenticated users (with a valid JWT) can perform checkout.
- **Payment methods**: Checkout accepts only `cash` or `credit_card`.
- **Cash discount**: Paying with `cash` applies a **10% discount** on the order subtotal.
- **In-memory storage**: Users and products live in memory. Data resets when the server restarts.

## Existent Data

### Users (password for all: `password123`)

| ID | Username | Email              |
|----|----------|--------------------|
| 1  | alice    | alice@example.com  |
| 2  | bob      | bob@example.com    |
| 3  | carol    | carol@example.com  |

### Products

| ID | Name                 | Price   | Stock |
|----|----------------------|---------|-------|
| 1  | Wireless Headphones  | $79.99  | 50    |
| 2  | Smart Watch          | $149.99 | 30    |
| 3  | USB-C Hub            | $39.99  | 100   |

## How to Use the Rest API

Base URL: `http://localhost:3000`

### 1. Health Check

Verify the API is running.

```
GET /healthcheck
```

**Response (200):**

```json
{
  "status": "ok",
  "timestamp": "2026-06-15T12:00:00.000Z"
}
```

### 2. Register

Create a new user account and receive a JWT token.

```
POST /api/register
Content-Type: application/json
```

**Body:**

```json
{
  "username": "dave",
  "email": "dave@example.com",
  "password": "mypassword"
}
```

**Response (201):**

```json
{
  "token": "<jwt-token>",
  "user": {
    "id": 4,
    "username": "dave",
    "email": "dave@example.com"
  }
}
```

### 3. Login

Authenticate an existing user and receive a JWT token.

```
POST /api/login
Content-Type: application/json
```

**Body:**

```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "token": "<jwt-token>",
  "user": {
    "id": 1,
    "username": "alice",
    "email": "alice@example.com"
  }
}
```

### 4. Checkout

Place an order. Requires a valid JWT in the `Authorization` header.

```
POST /api/checkout
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body:**

```json
{
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1 }
  ],
  "paymentMethod": "cash"
}
```

**Response (200):**

```json
{
  "message": "Checkout completed successfully",
  "order": {
    "items": [
      {
        "productId": 1,
        "name": "Wireless Headphones",
        "quantity": 2,
        "unitPrice": 79.99,
        "lineTotal": 159.98
      },
      {
        "productId": 3,
        "name": "USB-C Hub",
        "quantity": 1,
        "unitPrice": 39.99,
        "lineTotal": 39.99
      }
    ],
    "paymentMethod": "cash",
    "subtotal": 199.97,
    "discount": 19.99,
    "total": 179.98
  }
}
```

## Project Structure

```
src/
├── controllers/    # Request handlers
├── middleware/     # Auth and error handling
├── models/         # User, Product, and seed data
├── routes/         # Route definitions
├── services/       # Business logic
├── app.js          # Express application setup
└── server.js       # Server entry point
```
