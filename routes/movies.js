const express = require('express');

const { Joi, celebrate } = require('celebrate');

const validator = require('validator');

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
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('поле image заполнено не корректно');
    }),
    trailerLink: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('поле trailerLink заполнено не корректно');
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('поле thumbnail заполнено не корректно');
    }),
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
