const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { ObjectId } = require('mongoose').Types;

const validateArticleId = celebrate({
  params: Joi.object().keys({
    artileId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id');
    }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .message(
        'Поле email должно быть валидным email адресом',
      )
      .messages({
        'any.required': 'Поле email должно быть заполнено',
      }),
    password: Joi.string().required().min(8)
      .messages({
        'any.required': 'Поле password должно быть заполнено',
      }),
  }),
});

const validateRegistration = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .message(
        'Поле email должно быть валидным email адресом',
      )
      .messages({
        'any.required': 'Поле email должно быть заполнено',
      }),
    password: Joi.string().required().min(8)
      .messages({
        'any.required': 'Поле password должно быть заполнено',
      }),
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Поле password должно содержать не менее 2 символов',
        'string.max': 'Поле password должно содержать не более 30 символов',
        'any.required': 'Поле password должно быть заполнено',
      }),
  }),
});

const validateArticleBody = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required()
      .messages({
        'any.required': 'Поле keyword должно быть заполнено',
      }),
    title: Joi.string().required()
      .messages({
        'any.required': 'Поле title должно быть заполнено',
      }),
    text: Joi.string().required()
      .messages({
        'any.required': 'Поле text должно быть заполнено',
      }),
    date: Joi.string().required()
      .messages({
        'any.required': 'Поле date должно быть заполнено',
      }),
    source: Joi.string().required()
      .messages({
        'any.required': 'Поле source должно быть заполнено',
      }),
    link: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле link должно быть валидным Url адресом');
    })
      .messages({
        'any.required': 'Поле link должно быть заполнено',
      }),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле image должно быть валидным Url адресом');
    })
      .messages({
        'any.required': 'Поле image должно быть заполнено',
      }),
  }),
});

module.exports = {
  validateLogin,
  validateRegistration,
  validateArticleBody,
  validateArticleId,
};
