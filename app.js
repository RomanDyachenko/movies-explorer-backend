require('dotenv').config();
const helmet = require('helmet');
const express = require('express');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const { limiter } = require('./middlewares/rateLimiter');
const auth = require('./middlewares/auth');
const users = require('./routes/users');
const movies = require('./routes/movies');
const authentications = require('./routes/authentications');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { handleCors } = require('./middlewares/handlerCors');

const { PORT = 3000, NODE_ENV, MONGODB_ADDRESS } = process.env;

const app = express();

async function connect() {
  await mongoose.connect(NODE_ENV === 'production' ? MONGODB_ADDRESS : 'mongodb://localhost:27017/dev-bitfilmsdb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });
  await app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

connect();

app.use(limiter);

app.use(helmet());

app.use(handleCors);

app.use(requestLogger);

app.use('/', authentications);

app.use(auth);

app.use('/users', users);

app.use('/movies', movies);

app.use(((req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
}));

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});
