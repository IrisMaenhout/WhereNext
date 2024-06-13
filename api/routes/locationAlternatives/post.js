import express from "express";
import { ObjectId } from "mongodb";

import { db } from "../../db/mongo.js";
import { isValidObjectId } from "../../validators/idValidator.js";
import { createAccomodationLocationSchema, createLocationSchema } from "../../validators/locationValidator.js";
import { loggedInMiddleware } from "../../middleware/loggedInMiddleware.js";


const postLocationAlternativeRouter = express.Router();

// Add locations to an alternativegroup
postLocationAlternativeRouter.post("/", loggedInMiddleware,  async (req, res) => {
    
});


export { postLocationAlternativeRouter };
