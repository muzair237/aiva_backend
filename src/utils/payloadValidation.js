import Joi from 'joi';

export const validateSignUpPayload = payload => {
  const schema = Joi.object({
    first_name: Joi.string().min(3).required().messages({
      'string.min': 'First name must be at least 3 characters long',
      'any.required': 'First name is required',
    }),
    last_name: Joi.string().min(3).required().messages({
      'string.min': 'Last name must be at least 3 characters long',
      'any.required': 'Last name is required',
    }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
      }),
    password: Joi.string()
      .pattern(new RegExp('^(?=.*[!@#$%^&*])(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$'))
      .required()
      .messages({
        'string.pattern.base':
          'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.',
        'any.required': 'Password is required',
      }),
    DOB: Joi.date().required().messages({
      'date.base': 'Date of Birth must be a valid date',
      'any.required': 'Date of Birth is required',
    }),
  });

  const { error } = schema.validate(payload);

  return { error };
};
