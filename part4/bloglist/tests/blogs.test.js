const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app.js');
const api = supertest(app);

const helper = require('./test_helper.js');

const Blog = require('../models/blog.js');

beforeEach(async () => {
  await Blog.deleteMany({});

  await Promise.all(helper.initialBlogs.map(blog=> (new Blog(blog)).save()));
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('there are two blogs', async () => {
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

test('POST \'/api/blogs\' with valid Blog creates new Blog entry', async () => {
  const newBlog = {
    author: 'Frankie Frankson',
    title: 'Eponymous Surnames of the World'
  };
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const updatedBlogs = await api.get('/api/blogs');
  expect(updatedBlogs.body).toHaveLength(helper.initialBlogs.length + 1);
});

test('Blog objects have 0 likes if undefined', async () => {
  const newBlog = {
    author: 'Frankie Frankson',
    title: 'Eponymous Surnames of the World'
  };
  const savedBlog = await api
    .post('/api/blogs')
    .send(newBlog);

  expect(savedBlog.body.likes).toBe(0);

});

test('POST \'/api/blogs\' with Blog missing title and url returns 400', async () => {
  const newBlog = {
    author: 'pertrovich',
    likeS: 9001
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);
})

afterAll(() => {
  mongoose.connection.close();
});