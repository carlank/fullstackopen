const bcrypt = require('bcryptjs');
const usersRouter = require('express').Router();
const User = require('../models/user.js');

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', {author: 1, title: 1, url: 1, likes: 1});
  res.json(users.map(user=>user.toJSON()));
});

usersRouter.post('/', async (req, res) => {
  const body = req.body;
  if(!body.username || !body.password){
    return res.status(400).end();
  }

  if(body.password.length < 3){
    return res.status(400).send({error: 'password must be at least 3 characters'});
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
    blogs: body.blogs || [],
  });
  const savedUser = await user.save();
  res.status(201).json(savedUser.toJSON());
});

module.exports = usersRouter;