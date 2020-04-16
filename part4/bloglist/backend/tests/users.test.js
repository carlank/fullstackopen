const bcrypt = require('bcryptjs');

const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app.js');
const api = supertest(app);

const helper = require('./test_helper.js');

const User = require('../models/user.js');

describe('initial state: multiple users', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Promise.all(
      helper
        .initialUsers
        .map(async ({ password, ...user }) => {
          await (new User({ ...user, passwordHash: await bcrypt.hash(password, 10) }))
            .save();
        })
    );
  });

  test('returns as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await User.find({});
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with too short password', async () => {
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'pa',
    };

    const result = await api
      .post('/api/users')
      .send(newUser);

    expect(result.body).toEqual({error: 'password must be at least 3 characters'});
  });

  test('creation fails with missing username', async () => {
    const newUser = {
      name: 'Matti Luukkainen',
      password: 'password',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });

  test('creation fails with missing password', async () => {
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });

  afterAll(() => {
    mongoose.connection.close();
  });

});