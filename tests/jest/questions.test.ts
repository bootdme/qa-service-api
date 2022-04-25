const supertest = require('supertest');
const { createServer } = require('../../server/create');

const app = createServer();

describe('questions', () => {
  describe('get questions route', () => {
    describe('given questions with no params', () => {
      it('should return a 404 response for /questions', async () => {
        const response = await supertest(app).get('/qa/questions');
        expect(response.status).toBe(404);
      });
      it('should return \'Error: invalid product id provided\'', async () => {
        const response = await supertest(app).get('/qa/questions');
        expect(response.text).toEqual('Error: invalid product id provided');
      });
    })
    describe('given questions with a product id param', () => {
      it('should return a 200 response for a product id in bounds /questions?product_id=[numInBounds]', async () => {
        const response = await supertest(app).get('/qa/questions?product_id=963063');
        expect(response.status).toBe(200);
      });
      it('should return a 404 response for product id greater than database', async () => {
        const response = await supertest(app).get('/qa/questions?product_id=9999999999');
        expect(response.status).toEqual(404);
      });
      it('should expect an object for a product id', async () => {
        const response = await supertest(app).get('/qa/questions?product_id=963066');
        expect(typeof response.body).toEqual('object');
      });
      it('should have a product_id key as a string and results as an array', async () => {
        const response = await supertest(app).get('/qa/questions?product_id=2366345');
        expect(response.body.product_id).toBeDefined();
        expect(response.body.results).toBeDefined();
        expect(typeof response.body.product_id).toEqual('string');
        expect(typeof response.body.results).toEqual('object');
      });
    })
  })
})