const { expect } = require('chai');
const request = require('supertest');
const baseURL = 'http://localhost:3030';

describe('POST /api/checkout', () => {
  let authToken;

  before((done) => {
    // Login to get a valid token
    request(baseURL)
      .post('/api/login')
      .send({
        email: 'alice@example.com',
        password: 'password123'
      })
      .end((err, res) => {
        if (err) return done(err);
        authToken = res.body.token;
        done();
      });
  });

  it('should complete checkout successfully with valid token (200)', (done) => {
    const checkoutData = {
      items: [
        { productId: 1, quantity: 2 },
        { productId: 3, quantity: 1 }
      ],
      paymentMethod: 'cash'
    };

    request(baseURL)
      .post('/api/checkout')
      .set('Authorization', `Bearer ${authToken}`)
      .send(checkoutData)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('order');
        expect(res.body.order).to.have.property('items');
        expect(res.body.order).to.have.property('paymentMethod');
        expect(res.body.order).to.have.property('subtotal');
        expect(res.body.order).to.have.property('discount');
        expect(res.body.order).to.have.property('total');
        expect(res.body.order.paymentMethod).to.equal('cash');
        expect(res.body.order.items).to.be.an('array');
        expect(res.body.order.items.length).to.equal(2);
        
        done();
      });
  });

  it('should return 401 when missing authentication token', (done) => {
    const checkoutData = {
      items: [
        { productId: 1, quantity: 2 }
      ],
      paymentMethod: 'cash'
    };

    request(baseURL)
      .post('/api/checkout')
      .send(checkoutData)
      .expect('Content-Type', /json/)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        
        expect(res.body).to.have.property('error');
        
        done();
      });
  });

  it('should return 400 when missing required fields', (done) => {
    const invalidCheckoutData = {
      items: [
        { productId: 1, quantity: 2 }
      ]
      // missing paymentMethod
    };

    request(baseURL)
      .post('/api/checkout')
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidCheckoutData)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        
        expect(res.body).to.have.property('error');
        
        done();
      });
  });

  it('should return 404 when product not found', (done) => {
    const checkoutData = {
      items: [
        { productId: 999, quantity: 1 }
      ],
      paymentMethod: 'cash'
    };

    request(baseURL)
      .post('/api/checkout')
      .set('Authorization', `Bearer ${authToken}`)
      .send(checkoutData)
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        
        expect(res.body).to.have.property('error');
        
        done();
      });
  });

  it('should apply 10% discount for cash payment', (done) => {
    const checkoutData = {
      items: [
        { productId: 2, quantity: 1 }
      ],
      paymentMethod: 'cash'
    };

    request(baseURL)
      .post('/api/checkout')
      .set('Authorization', `Bearer ${authToken}`)
      .send(checkoutData)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        
        const order = res.body.order;
        const expectedSubtotal = 149.99;
        const expectedDiscount = expectedSubtotal * 0.1;
        const expectedTotal = expectedSubtotal - expectedDiscount;
        
        expect(order.subtotal).to.be.closeTo(expectedSubtotal, 0.01);
        expect(order.discount).to.be.closeTo(expectedDiscount, 0.01);
        expect(order.total).to.be.closeTo(expectedTotal, 0.01);
        
        done();
      });
  });

  it('should not apply discount for credit card payment', (done) => {
    const checkoutData = {
      items: [
        { productId: 2, quantity: 1 }
      ],
      paymentMethod: 'credit_card'
    };

    request(baseURL)
      .post('/api/checkout')
      .set('Authorization', `Bearer ${authToken}`)
      .send(checkoutData)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        
        const order = res.body.order;
        expect(order.discount).to.equal(0);
        expect(order.total).to.equal(order.subtotal);
        
        done();
      });
  });
});
