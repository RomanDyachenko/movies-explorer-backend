const express = require('express');

const { Joi, celebrate } = require('celebrate');

const router = express.Router();

const {
  getUserInfo,
  updateUserInfo,
} = require('../controllers/users');

router.get('/me', express.json(), getUserInfo);

router.patch('/me', express.json(), celebrate({
  body: {
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  },
}), updateUserInfo);

module.exports = router;
