import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * K6 Load Test for Login Endpoint
 * 
 * Performance Threshold:
 * - p95 response time: 500ms
 * - 30 Virtual Users
 * - 30s total duration
 * 
 * Stages Configuration:
 * - 0-5s: Ramp up to 10 users
 * - 5-25s: Ramp up to 30 users (20s duration)
 * - 25-30s: Ramp down to 0 users
 */

export const options = {
  stages: [
    { duration: '5s', target: 10 },    // Ramp-up to 10 users over 5s
    { duration: '20s', target: 30 },   // Ramp-up to 30 users over 20s
    { duration: '5s', target: 0 },     // Ramp-down to 0 users over 5s
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95th percentile response time below 500ms
    http_req_failed: ['rate<0.1'],     // HTTP failure rate below 10%
  },
};

// Test data from README.md
const users = [
  { email: 'alice@example.com', password: 'password123' },
  { email: 'bob@example.com', password: 'password123' },
  { email: 'carol@example.com', password: 'password123' },
];

const baseURL = 'http://localhost:3030';

export default function () {
  // Select a random user from the test data
  const user = users[Math.floor(Math.random() * users.length)];

  // Prepare login request payload
  const payload = JSON.stringify({
    email: user.email,
    password: user.password,
  });

  // Define request headers
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Execute login request
  const response = http.post(`${baseURL}/api/login`, payload, params);

  // Validate response
  check(response, {
    'Login successful (status 200)': (r) => r.status === 200,
    'Response contains token': (r) => r.body.includes('token'),
    'Response contains user': (r) => r.body.includes('user'),
    'Response is JSON': (r) => r.headers['Content-Type'].includes('application/json'),
    'Response time < 500ms': (r) => r.timings.duration < 500,
  });

  // Optional: Add small think time between requests
  sleep(1);
}
