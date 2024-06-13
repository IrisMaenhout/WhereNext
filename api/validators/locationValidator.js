import Joi from 'joi';

export const createLocationSchema = Joi.object({
    type: Joi.string().required(),
	savedLocation: Joi.object({
        bucketList: Joi.bool().required(),
        itinerary: Joi.bool().required(),
        accomodations: Joi.bool().required()
    }).required(),
	date:  Joi.any(),
	startTime: Joi.any(),
	endTime: Joi.any(),
    isBooked: Joi.bool().required()
});

export const createAccomodationLocationSchema = Joi.object({
    type: Joi.string().required(),
	savedLocation: Joi.object({
        bucketList: Joi.bool().required(),
        itinerary: Joi.bool().required(),
        accomodations: Joi.bool().required()
    }).required(),
	startDate: Joi.date().greater('now'),
	endDate: Joi.date().greater(Joi.ref('startDate')),
	startTime: Joi.any(),
	endTime: Joi.any(),
    isBooked: Joi.bool().required()
});

// Update
export const addIntrestScoreForLoggedInUser = Joi.object({
	// user: Joi.string().required(),
	rating: Joi.number().required(),
	status: Joi.string().required()
});

export const addNote = Joi.object({
	content: Joi.string().required()
});





export const updateLocationSchema = Joi.object({
    type: Joi.string(),
	savedLocation: Joi.object({
        bucketList: Joi.bool().required(),
        itinerary: Joi.bool().required(),
        accomodations: Joi.bool().required()
    }),
	date:  Joi.any(),
	startTime: Joi.any(),
	endTime: Joi.any(),
    isBooked: Joi.bool(),
	order: Joi.number()
});

export const updateAccomodationLocationSchema = Joi.object({
    type: Joi.string(),
	savedLocation: Joi.object({
        bucketList: Joi.bool(),
        itinerary: Joi.bool(),
        accomodations: Joi.bool()
    }),
	startDate: Joi.date().greater('now'),
	endDate: Joi.date().greater(Joi.ref('startDate')),
	startTime: Joi.any(),
	endTime: Joi.any(),
    isBooked: Joi.bool(),
	order: Joi.number()
});

