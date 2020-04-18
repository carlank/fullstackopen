const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app.js');
const api = supertest(app);

const helper = require('./test_helper.js');

const Blog = require('../models/blog.js');
const User = require('../models/user.js');

describe('initial state: multiple blogs & multiple users', () => {
  beforeAll(async () => {

  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});

    await Promise.all(helper.initialUsers.map(user => (new User(user)).save()));

    await Promise.all(helper.initialBlogs.map(blog => (new Blog(blog)).save()));
  });

  describe('testing blogs: ', () => {

    test('returns as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });

    test('there are the correct number of blogs', async () => {
      const res = await api.get('/api/blogs');
      expect(res.body).toHaveLength(helper.initialBlogs.length);
    });

    test('a specific Blog exists within the response', async () => {
      const res = await api.get('/api/blogs');
      expect(res.body.map(r => r.author)).toContain('Franklin Roosevelt');
    });

    test('Blog objects have id property', async () => {
      const res = await api.get('/api/blogs');
      res.body.forEach(blog => expect(blog.id).toBeDefined());
    });

    describe('actions requiring auth', () => {
      let token;
      beforeEach(async () => {
        token = (await api.post('/login').send({ username: 'root', password: 'thefallofseveneves' })).body.token;
      });

      test('PORT \'/api/blogs\' without valid token returns 401', async () => {
        const newBlog = {
          author: 'Frankie Frankson',
          title: 'Eponymous Surnames of the World'
        };
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(401);
      });

      test('Blog objects have 0 likes if undefined', async () => {
        const newBlog = {
          author: 'Frankie Frankson',
          title: 'Eponymous Surnames of the World'
        };
        const savedBlog = await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog);

        expect(savedBlog.body.likes).toBe(0);

      });

      test('POST \'/api/blogs\' with valid Blog creates new Blog entry', async () => {
        const newBlog = {
          author: 'Frankie Frankson',
          title: 'Eponymous Surnames of the World'
        };
        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/);

        const updatedBlogs = await api.get('/api/blogs');
        expect(updatedBlogs.body).toHaveLength(helper.initialBlogs.length + 1);
      });

      test('POST \'/api/blogs\' with Blog missing title and url returns 400', async () => {
        const newBlog = {
          author: 'petrovich',
          likes: 9001
        };

        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(400);
      });
    });
  });

  describe('testing users: ', () => {

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

      expect(result.body).toEqual({ error: 'password must be at least 3 characters' });
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

  });

  afterAll(async ()=>{
    await Promise.all(mongoose.connections.map(con => con.close()))
  });

});