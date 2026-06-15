const { expect } = require('chai');
const request = require('supertest');
const baseURL = 'http://localhost:3030';

describe('GET /api/swagger', () => {
  it('should return swagger UI with redirect (301)', (done) => {
    request(baseURL)
      .get('/api/swagger')
      .expect(301)
      .end((err, res) => {
        if (err) return done(err);
        
        expect(res.headers.location).to.include('/api/swagger/');
        
        done();
      });
  });

  it('should return swagger UI at correct endpoint (200)', (done) => {
    request(baseURL)
      .get('/api/swagger/')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        
        expect(res.text).to.include('swagger-ui');
        
        done();
      });
  });
});
