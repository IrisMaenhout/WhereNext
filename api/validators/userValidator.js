import Joi from 'joi';

export const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required()
});

export const createUserSchema = Joi.object({
    firstname: Joi.string().required(),
	lastname: Joi.string().required(),
	email: Joi.string().email().required(),
	image: Joi.string().required(),
	password: Joi.string().required()
});



export const updateUserSchema = Joi.object({
    id: Joi.alternatives().try(
        Joi.string().length(12).hex(),
        Joi.string().length(24).hex(),
        Joi.number().integer().positive()
    ),
    firstname: Joi.string(),
	lastname: Joi.string(),
	email: Joi.string().email(),
	image: Joi.string(),
	password: Joi.string()
});
