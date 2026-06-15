# Load Testing - K6 Scripts

This folder contains K6 load testing scripts for the e-commerce API endpoints.

## Available Tests

### login-load-test.js
Load test for the `/api/login` endpoint with the following configuration:

**Performance Thresholds:**
- 95th percentile response time: **500ms**
- HTTP failure rate: below 10%

**Load Profile (30 seconds total):**
- **Stage 1 (0-5s):** Ramp up to 10 virtual users
- **Stage 2 (5-25s):** Ramp up to 30 virtual users
- **Stage 3 (25-30s):** Ramp down to 0 users

**Test Data:**
Uses valid credentials from README.md:
- alice@example.com / password123
- bob@example.com / password123
- carol@example.com / password123

## Prerequisites

- K6 is installed globally or available in the project
- The API server is running on `http://localhost:3030`

## Running the Load Test

Start the API server (if not already running):
```bash
npm start
```

In a separate terminal, run the load test:
```bash
k6 run test/loadTesting/login-load-test.js
```

### With Custom VU and Duration
```bash
k6 run --vus 30 --duration 30s test/loadTesting/login-load-test.js
```

### Generate JSON Report
```bash
k6 run --out json=test-reports/load-test-results.json test/loadTesting/login-load-test.js
```

## Expected Results

The test will output:
- Response time statistics (min, max, avg, p50, p95, p99)
- Error counts and rates
- Success/failure of threshold checks
- Request count and throughput

## Troubleshooting

If the test fails with connection errors:
1. Ensure the API server is running: `npm start`
2. Verify the base URL in the script matches your server address
3. Check that port 3030 is accessible
