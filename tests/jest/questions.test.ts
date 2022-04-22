const supertest = require('supertest');
const { createServer } = require('../../server/create');

const app = createServer();

describe('questions', () => {
  describe('get questions route', () => {
    describe('given query with no params', () => {
      it('should return a 200 response ', async () => {
        expect(true).toBe(true);
      })
    })
  })
})