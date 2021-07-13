const Joi = require('joi');

const registerSchema = Joi.object({
  userId: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  username: Joi.string().required(),
  password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{4,30}$')),
  re_password: Joi.ref('pw'),
});

exports.registerSchema = registerSchema;
