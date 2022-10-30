/* eslint-disable max-len */
const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const getUserMovies = (req, res, next) => {
  Movie.find({
    owner: req.user._id,
  })
    .then((movies) => {
      if (!movies) {
        next(new NotFoundError('Фильмов, добавленных пользователем, не найдено'));
      }
      res.send(movies);
    })
    .catch((err) => {
      next(err);
    });
};

const postNewMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailer, nameRU, nameEN, movieId,
  } = req.body;
  Movie.create({
    country, director, duration, year, description, image, trailer, nameRU, nameEN, movieId, owner: req.user._id,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неверно заполнены данные фильма'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      throw new NotFoundError('Пользователь с данным _id не найден');
    }
    if ((movie.owner.equals(req.user._id))) {
      const id = await Movie.findByIdAndRemove(req.params.id);
      res.send(id);
      return;
    }
    throw new ForbiddenError('Нет прав для удаления фильма');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserMovies,
  postNewMovie,
  deleteMovie,
};
