import supertest from 'supertest';
import server from './server';

describe('api /', () => {
  it('responds', async (done) => {
    expect.assertions(1);
    try {
      const response = await supertest(server).get('/');
      expect(response.statusCode).toStrictEqual(200);
      return done();
    } catch (error) {
      console.error(error);
      return done(error);
    }
  }, 10000);
  it('serves favicon', async (done) => {
    expect.assertions(1);
    try {
      const response = await supertest(server).get('/favicon.ico');
      expect(response.statusCode).toStrictEqual(200);
      return done();
    } catch (error) {
      console.error(error);
      return done(error);
    }
  }, 10000);
});
