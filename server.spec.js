const server = require('./server.js');
const request = require('supertest');

describe('GET /', () => {
  it('has process.env.DB_ENV as "development"', () => {
    expect(process.env.DB_ENV).toBe('development');
  });
});

it('returns 200 OK', () => {
  return request(server)
    .get('/')
    .expect(200)
    .expect('Content-Type', /json/)
    .expect('Content-Length', '85')
    .then(res => {
      expect(res.body.message).toBe(
        `Welcome to the API of sprint 13 lecture 4 daily challenge about testing`,
      );
    });
});
