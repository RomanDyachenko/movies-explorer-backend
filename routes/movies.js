const express = require('express');

const { Joi, celebrate } = require('celebrate');

const {
  getUserMovies,
  postNewMovie,
  deleteMovie,
} = require('../controllers/movies');

const router = express.Router();

router.get('/', getUserMovies);

router.post('/', express.json(), celebrate({
  country: Joi.string().required(),
  director: Joi.string().required(),
  duration: Joi.number().required(),
  year: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.required().string().uri(),
  trailerLink: Joi.required().string().uri(),
  thumbnail: Joi.required().string().uri(),
  owner: Joi.string().length(24).hex().required(),
  movieId: Joi.number().required(),
  nameRU: Joi.string().pattern(/\W/gi).required(),
  nameEN: Joi.string().pattern(/\w/gi).required(),
}), postNewMovie);

router.delete('/:id', express.json(), deleteMovie);
