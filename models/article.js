const validator = require('validator');
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: [true, 'Поле keyword должно быть заполнено'],
  },
  title: {
    type: String,
    required: [true, 'Поле title должно быть заполнено'],
  },
  description: {
    type: String,
    required: [true, 'Поле description должно быть заполнено'],
  },
  date: {
    type: String,
    required: [true, 'Поле date должно быть заполнено'],
  },
  source: {
    type: String,
    required: [true, 'Поле source должно быть заполнено'],
  },
  link: {
    type: String,
    required: [true, 'Поле link должно быть заполнено'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Поле link должно содержать валидный url-адрес',
    },
  },
  image: {
    type: String,
    required: [true, 'Поле image должно быть заполнено'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Поле image должно содержать валидный url-адрес',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле owner должно быть заполнено'],
    select: false,
  },
});

module.exports = mongoose.model('article', articleSchema);
