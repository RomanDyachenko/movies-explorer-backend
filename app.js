const express = require('express');
const { Joi, celebrate, errors } = require('celebrate');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const users = require('./routes/users');
const movies = require('./routes/movies');
const {
  loginUser,
  registerNewUser,
} = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { handleCors } = require('./middlewares/handlerCors');
require('dotenv').config();

const { PORT = 3000 } = process.env;

const app = express();

async function connect() {
  await mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });
  await app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

connect();

app.use(handleCors);

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', express.json(), celebrate({
  body: {
    name: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
}), registerNewUser);

app.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), loginUser);

app.use('/users', auth, users);

app.use('/movies', auth, movies);

app.use(auth, ((req, res, next) => {
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
