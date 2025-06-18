const request = require('supertest');
const express = require('express');
const app = require('../server');

describe('API Endpoints', () => {
  // Test user authentication
  describe('User Authentication', () => {
    it('should sign up a new user', async () => {
      const res = await request(app)
        .post('/api/users/signup')
        .send({
          email: 'test@example.com',
          password: 'test123'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should sign in an existing user', async () => {
      const res = await request(app)
        .post('/api/users/signin')
        .send({
          email: 'test@example.com',
          password: 'test123'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });

  // Test search functionality
  describe('Search API', () => {
    it('should return search results', async () => {
      const res = await request(app)
        .get('/api/search')
        .query({ query: 'pizza' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('restaurants');
      expect(res.body).toHaveProperty('foods');
    });
  });

  // Test order functionality
  describe('Order API', () => {
    let authToken;

    beforeAll(async () => {
      // Get auth token for order tests
      const loginRes = await request(app)
        .post('/api/users/signin')
        .send({
          email: 'test@example.com',
          password: 'test123'
        });
      authToken = loginRes.body.token;
    });

    it('should create a new order', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [
            { foodId: 1, quantity: 2 }
          ],
          address: '123 Test St'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('orderId');
    });

    it('should get user orders', async () => {
      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
}); 