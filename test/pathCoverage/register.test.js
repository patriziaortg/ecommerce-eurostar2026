const { expect } = require('chai');
const request = require('supertest');
const baseURL = 'http://localhost:3030';

describe('POST /api/register', () => {
  it('should register a new user successfully (201)', (done) => {
    const timestamp = Date.now();
    const newUser = {
      username: `testuser${timestamp}`,
      email: `testuser${timestamp}@example.com`,
      password: 'testpassword123'
    };

    request(baseURL)
      .post('/api/register')
      .send(newUser)
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        
        expect(res.body).to.have.property('token');
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.have.property('id');
        expect(res.body.user).to.have.property('username');
        expect(res.body.user).to.have.property('email');
        expect(res.body.user.username).to.equal(newUser.username);
        expect(res.body.user.email).to.equal(newUser.email);
        
        done();
      });
  });

  it('should return 400 when missing required fields', (done) => {
    const incompleteUser = {
      username: 'testuser2'
    };

    request(baseURL)
      .post('/api/register')
      .send(incompleteUser)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        
        expect(res.body).to.have.property('error');
        
        done();
      });
  });

  it('should return 409 when email already exists', (done) => {
    const duplicateUser = {
      username: 'newusername',
      email: 'alice@example.com',
      password: 'newpassword123'
    };

    request(baseURL)
      .post('/api/register')
      .send(duplicateUser)
      .expect('Content-Type', /json/)
      .expect(409)
      .end((err, res) => {
        if (err) return done(err);
        
        expect(res.body).to.have.property('error');
        
        done();
      });
  });
});
