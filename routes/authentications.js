const express = require('express');

const { Joi, celebrate } = require('celebrate');

const {
  registerNewUser,
  loginUser,
} = require('../controllers/users');

const router = express.Router();

router.post('/signup', express.json(), celebrate({
  body: {
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
}), registerNewUser);

router.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), loginUser);

module.exports = router;
