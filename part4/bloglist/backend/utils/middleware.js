const logger = require('./logger');

const requestLogger = (req, res, next) => {
  logger.log('Method:', req.method);
  logger.log('Path:  ', req.path);
  logger.log('Body:  ', req.body);
  logger.log('---');
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    req.token = auth.substring(7);
  }
  next();
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({error: 'invalid token' });
  }

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  tokenExtractor,
  errorHandler
};