const mongoose = require('mongoose');
require('mongoose-type-url');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: mongoose.SchemaTypes.Url,
      required: true,
    },
    trailerLink: {
      type: mongoose.SchemaTypes.Url,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: {
      type: Number,
      ref: 'MoviesExplorer',
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return /\W/gi.test(v);
        },
        message: (props) => `${props.value} не прошла валидацию`,
      },
    },
    nameEN: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return /\w/gi.test(v);
        },
        message: (props) => `${props.value} не прошла валидацию`,
      },
    },
  },
);

module.exports = mongoose.model('movie', movieSchema);
