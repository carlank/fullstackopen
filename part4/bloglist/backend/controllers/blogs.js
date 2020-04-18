const jwt = require('jsonwebtoken');

const blogsRouter = require('express').Router();
const Blog = require('../models/blog.js');
const User = require('../models/user.js');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs.map(blog => blog.toJSON()));
});

blogsRouter.post('/', async (req, res) => {
  const body = req.body;
  if (!body.title && !body.url) {
    return res.status(400).end();
  }

  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }
  const creator = await User.findById(decodedToken.id);

  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url || '',
    likes: body.like || 0,
    user: creator._id
  });
  const savedBlog = await blog.save();
  creator.blogs = [...creator.blogs, savedBlog._id];
  await creator.save();

  res.status(201).json(savedBlog.toJSON());
});

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    res.json(blog.toJSON());
  } else {
    res.status(404).end();
  }
});

blogsRouter.delete('/:id', async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }
  const blog = await Blog.findById(req.params.id);

  if(blog.user.toString() !== decodedToken.id.toString()){
    return res.status(401).json({error: 'user not authorized'});
  }
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

blogsRouter.put('/:id', async (req, res) => {
  const { author, title, url, likes } = req.body;
  const updatedBlog = {
    author,
    title,
    url,
    likes
  };
  console.log(updatedBlog);
  const savedBlog = await Blog.findByIdAndUpdate(req.params.id, updatedBlog, { new: true, omitUndefined: true });
  console.log(savedBlog);
  res.send(savedBlog.toJSON());
});

module.exports = blogsRouter;