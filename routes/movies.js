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
  body: {
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().uri().required(),
    trailerLink: Joi.string().uri().required(),
    thumbnail: Joi.string().uri().required(),
    owner: Joi.string().length(24).hex().required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().pattern(/\W/i).required(),
    nameEN: Joi.string().pattern(/\w/i).required(),
  },
}), postNewMovie);

router.delete('/:id', celebrate({
  params: {
    id: Joi.string().length(24).hex().required(),
  },
}), deleteMovie);

module.exports = router;
