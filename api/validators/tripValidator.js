import Joi from 'joi';

export const addLoggedInUserToTripSchema = Joi.object({
	password: Joi.string().required()
});

export const createTripSchema = Joi.object({
    tripName: Joi.string().required(),
	startDate: Joi.date().greater('now').required(),
	endDate: Joi.date().greater(Joi.ref('startDate')).required(),
    country: Joi.object({
		name: Joi.string().required(),
		// image: Joi.string().required()
        location: Joi.object({
            lat: Joi.number().required(),
            lng: Joi.number().required()
        }).required()
	}).required(),
    cities: Joi.array().items(Joi.string()).required(),
    datesArray: Joi.array().items(Joi.date()).required()
	// budget: Joi.number().positive(),
	// password: Joi.string().required()
});



export const updateTripSchema = Joi.object({
    tripId: Joi.alternatives().try(
        Joi.string().length(12).hex(),
        Joi.string().length(24).hex(),
        Joi.number().integer().positive()
    ),
    tripName: Joi.string(),
	startDate: Joi.date().greater('now'),
	endDate: Joi.date().greater(Joi.ref('startDate')),
    datesArray: Joi.array().items(Joi.date()),
    country: Joi.object({
		name: Joi.string(),
		// image: Joi.string()
        location: Joi.object({
            lat: Joi.number().required(),
            lng: Joi.number().required()
        })
	}),
    cities: Joi.array().items(Joi.string()),
    members: Joi.array().items(Joi.string()),
	// budget: Joi.number().positive(),
	// password: Joi.string()
});
