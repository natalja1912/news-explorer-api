const validator = require('validator');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле name должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля name - 2 символа'],
    maxlength: [30, 'Максимальная длина поля name - 30 символов'],
  },
  email: {
    type: String,
    required: [true, 'Поле email должно быть заполнено'],
    unique: [true, 'Введенный email уже существует'],
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Поле "email" должно содержать валидный адрес почты',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле password должно быть заполнено'],
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
