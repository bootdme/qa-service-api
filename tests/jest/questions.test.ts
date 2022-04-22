const supertest = require('supertest');
const { createServer } = require('../../server/create');

const app = createServer();

describe('questions', () => {
  describe('get questions route', () => {
    describe('given query with no params', () => {
      it('should return a 404 response for /questions', async () => {
        const { statusCode } = await supertest(app).get('/questions');
        expect(statusCode).toBe(404);
      });
    })
  })
})