const { expect } = require('chai');
const request = require('supertest');
const baseURL = 'http://localhost:3030';

describe('POST /api/login', () => {
  it('should login an existing user successfully (200)', (done) => {
    const credentials = {
      email: 'alice@example.com',
      password: 'password123'
    };

    request(baseURL)
      .post('/api/login')
      .send(credentials)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        
        expect(res.body).to.have.property('token');
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.have.property('id');
        expect(res.body.user).to.have.property('username');
        expect(res.body.user).to.have.property('email');
        expect(res.body.user.email).to.equal(credentials.email);
        expect(res.body.user.username).to.equal('alice');
        
        done();
      });
  });

  it('should return 400 when missing required fields', (done) => {
    const incompleteCredentials = {
      email: 'alice@example.com'
    };

    request(baseURL)
      .post('/api/login')
      .send(incompleteCredentials)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        
        expect(res.body).to.have.property('error');
        
        done();
      });
  });

  it('should return 401 when credentials are invalid', (done) => {
    const wrongCredentials = {
      email: 'alice@example.com',
      password: 'wrongpassword'
    };

    request(baseURL)
      .post('/api/login')
      .send(wrongCredentials)
      .expect('Content-Type', /json/)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        
        expect(res.body).to.have.property('error');
        
        done();
      });
  });
});
