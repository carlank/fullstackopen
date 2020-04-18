const { MONGODB_URI } = require('./utils/config.js');

const express = require('express');
const app = express();
require('express-async-errors');
const cors = require('cors');
const mongoose = require('mongoose');

const blogsRouter = require('./controllers/blogs.js');
const usersRouter = require('./controllers/users.js');
const loginRouter = require('./controllers/login.js');
const middleware = require('./utils/middleware.js');
const logger = require('./utils/logger.js');

logger.log('connecting to', MONGODB_URI);

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
};

mongoose.connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    logger.log('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;