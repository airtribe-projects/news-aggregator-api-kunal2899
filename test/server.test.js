const tap = require('tap');
const supertest = require('supertest');
const app = require('../app');
const { omit, pick } = require('lodash');
const { preferences } = require('joi');
const server = supertest(app);

const randomiseId = Math.random(100) * 100;
const mockUser = {
  name: "John Doe",
  email: `john.new+${randomiseId}@abc.co.uk`,
  password: "Abc1234@"
};

let token = '';
const baseUrl = '/v1/users';

// Auth tests
tap.test(`POST ${baseUrl}/signup`, async (t) => {
  const response = await server.post(`${baseUrl}/signup`).send(mockUser);
  t.equal(response.status, 200);
  t.end();
});

tap.test(`POST ${baseUrl}/signup with missing email`, async (t) => {
  const response = await server
    .post(`${baseUrl}/signup`)
    .send(omit(mockUser, 'email'));
  t.equal(response.status, 400);
  t.end();
});

tap.test(`POST ${baseUrl}/signup with existing email`, async (t) => {
  const response = await server.post(`${baseUrl}/signup`).send({
    name: 'Test new',
    email: 'kunalj@xyz.com',
    password: 'Qwerty123@',
  });
  t.equal(response.status, 400);
  t.end();
});

tap.test(`POST ${baseUrl}/login`, async (t) => {
  const response = await server
    .post(`${baseUrl}/login`)
    .send({ email: "john@abc.co.in", password: "Abc1234@" });
  t.equal(response.status, 200);
  t.hasOwnProp(response.body, "token");
  console.log({token})
  token = response.body.token;
  t.end();
});

tap.test(`POST ${baseUrl}/login with non-existing user`, async (t) => {
    const response = await server
      .post(`${baseUrl}/login`)
      .send({
        email: 'random@abc.com',
        ...pick(mockUser, 'password')
      });
    t.equal(response.status, 400);
    t.end();
  });

tap.test(`POST ${baseUrl}/login with wrong password`, async (t) => {
    const response = await server.post(`${baseUrl}/login`).send({
      email: "john@abc.co.in",
      password: "wrongpassword",
    });
    t.equal(response.status, 401);
    t.end();
});

// Preferences tests

tap.test(`GET ${baseUrl}/preferences`, async (t) => {
    const response = await server.get(`${baseUrl}/preferences`).set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.hasOwnProp(response.body, 'preferences');
    t.same(response.body.preferences, ['movies', 'comics', 'games']);
    t.end();
});

tap.test(`GET ${baseUrl}/preferences without token`, async (t) => {
    const response = await server.get(`${baseUrl}/preferences`);
    t.equal(response.status, 401);
    t.end();
});

tap.test(`PUT ${baseUrl}/preferences`, async (t) => {
    const response = await server.put(`${baseUrl}/preferences`).set('Authorization', `Bearer ${token}`).send({
        preferences: ['movies', 'comics', 'games']
    });
    t.equal(response.status, 200);
});

tap.test(`Check PUT ${baseUrl}/preferences`, async (t) => {
    const response = await server.get(`${baseUrl}/preferences`).set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.same(response.body.preferences, ['movies', 'comics', 'games']);
    t.end();
});

// News tests

tap.test('GET /v1/news', async (t) => {
    const response = await server.get('/v1/news').set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.hasOwnProp(response.body, 'news');
    t.end();
});

tap.test('GET /v1/news without token', async (t) => {
    const response = await server.get('/v1/news');
    t.equal(response.status, 401);
    t.end();
});



tap.teardown(() => {
    process.exit(0);
});