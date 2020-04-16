const blogsRouter = require('express').Router();
const Blog = require('../models/blog.js');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs.map(blog => blog.toJSON()));
});

blogsRouter.post('/', async (req, res) => {
  const body = req.body;
  if(!body.title && !body.url){
      return res.status(400).end();
  }

  const blog = new Blog({
      author: body.author,
      title: body.title,
      url: body.url || '',
      likes: body.like || 0
  });
  const savedBlog = await blog.save();
  res.status(201).json(savedBlog.toJSON());
});

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if(blog){
      res.json(blog.toJSON());
  } else {
      res.status(404).end();
  }
})

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

module.exports = blogsRouter;