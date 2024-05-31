import Joi from 'joi';

export const createLocationSchema = Joi.object({
    type: Joi.string().required(),
	savedLocation: Joi.object({
        bucketList: Joi.bool().required(),
        itinerary: Joi.bool().required(),
        accomodations: Joi.bool().required()
    }).required(),
	date:  Joi.date().greater('now'),
	time: Joi.object({
		start: Joi.date().timestamp(),
		end: Joi.date().timestamp(),
	}),
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
	time: Joi.object({
		checkIn: Joi.date().timestamp(),
		checkOut: Joi.date().timestamp(),
	}),
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
	date:  Joi.date().greater('now'),
	time: Joi.object({
		start: Joi.date().timestamp(),
		end: Joi.date().timestamp(),
	}),
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
	time: Joi.object({
		checkIn: Joi.date().timestamp(),
		checkOut: Joi.date().timestamp(),
	}),
    isBooked: Joi.bool(),
	order: Joi.number()
});

