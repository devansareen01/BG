const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');


beforeAll(async () => {

  mongoose.connection.readyState = 1; 
});

afterAll(async () => {

  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  } catch (error) {
    console.error('Error closing mongoose connection:', error);
  }
  
  
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});

describe('Server Tests', () => {
  test('GET / should return welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Blue-Green Deployment App');
  });

  test('GET /health should return health status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('database');
    expect(response.body.status).toBe('OK');
    expect(response.body.database).toBe('connected');
  });

  test('GET /api/users should return users endpoint', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Users endpoint working');
  });

  test('GET /nonexistent should return 404', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });
});

describe('Health Check Tests', () => {
  test('Health check should include all required fields', async () => {
    const response = await request(app).get('/health');
    const healthData = response.body;
    
    expect(healthData).toHaveProperty('status');
    expect(healthData).toHaveProperty('timestamp');
    expect(healthData).toHaveProperty('uptime');
    expect(healthData).toHaveProperty('environment');
    expect(healthData).toHaveProperty('database');
    expect(healthData).toHaveProperty('version');
  });
});
