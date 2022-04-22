const supertest = require('supertest');
const { createServer } = require('../../server/create');

const app = createServer();

describe('questions', () => {
  describe('get questions route', () => {
    describe('given questions with no params', () => {
      it('should return a 404 response for /questions', async () => {
        const response = await supertest(app).get('/questions');
        expect(response.status).toBe(404);
      });
      it('should return \'Error: invalid product id provided\'', async () => {
        const response = await supertest(app).get('/questions');
        expect(response.text).toEqual('Error: invalid product id provided');
      });
    })
    describe('given questions with a product id param', () => {
      it('should return a 200 response for a product id in bounds /questions?product_id=[numInBounds]', async () => {
        const response = await supertest(app).get('/questions?product_id=963063');
        expect(response.status).toBe(200);
      });
      it('should return a 404 response for product id greater than database', async () => {
        const response = await supertest(app).get('/questions?product_id=9999999999');
        expect(response.status).toEqual(404);
      });
    })
  })
})