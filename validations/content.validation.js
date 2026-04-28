const Joi = require("joi");

const contentSchema = Joi.object({
  title: Joi.string().required(),

  subject: Joi.string()
    .valid("maths", "science", "english", "social", "other")
    .required(),

  description: Joi.string().allow("").optional(),

  start_time: Joi.date().iso().required(),

  end_time: Joi.date().iso().greater(Joi.ref("start_time")).required(),
});

module.exports = { contentSchema };
