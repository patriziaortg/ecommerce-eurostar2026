const { expect } = require('chai');
const request = require('supertest');
const baseURL = 'http://localhost:3030';

describe('GET /healthcheck', () => {
  it('should return 200 with health status', (done) => {
    request(baseURL)
      .get('/healthcheck')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('ok');
        expect(res.body).to.have.property('timestamp');
        
        done();
      });
  });
});
