import express from "express";
import { ObjectId } from "mongodb";

import { db } from "../../db/mongo.js";
import { isValidObjectId } from "../../validators/idValidator.js";
import { createAccomodationLocationSchema, createLocationSchema } from "../../validators/locationValidator.js";
import { loggedInMiddleware } from "../../middleware/loggedInMiddleware.js";


const postLocationsRouter = express.Router();

// Add location to trip and check if user is part of the participans for this trip
postLocationsRouter.post("/:googleLocationId/addToTrip/:tripId", loggedInMiddleware,  async (req, res) => {
    // Check if the user is logged in
    const tripId = req.params.tripId;
    const googleLocationId = req.params.googleLocationId;


   
    const loggedInUserId = req.user._id;

    // Check if there is a type
    if(req.body.type){
            
        // Validate different fields depending on the type of the location
        const { error, value } = req.body.type === "restaurant" || req.body.type === "activity" ? createLocationSchema.validate(req.body, { abortEarly: false }) : createAccomodationLocationSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const errorArray = [];
            error.details.map((err)=>{
                errorArray.push(err.message);
            })
            return res.status(400).json({ error: errorArray });
        }

            
        if(!isValidObjectId(tripId)){
            return res.status(400).json({ error: "The given trip id is invalid." });
        }


        // Check if the user is part of the trip and if the trip exists in the database
        let trip = await db.collection("trips").findOne({
            _id: new ObjectId(tripId),
        });
   
 
        if (!trip) {
            return res.status(400).json({
                error: "There is no trip for this trip id.",
            });
        }else{
            console.log(trip.members);
            console.log(loggedInUserId.toString());
            if((!trip.members.includes(loggedInUserId.toString()))){
                return res.status(401).json({
                    error: "This user has not been added to tis trip.",
                });
            }

            // check if the location has already been saved in the db.
            const isLocationSaved = await db.collection("locations").findOne({ tripId: new ObjectId(tripId), googleLocationId });

            if(isLocationSaved){
                return res.status(401).json({
                    error: "This location has aready been added to this trip.",
                });
            }

            // Add the new location to the db.
            const locationPost = await db.collection("locations").insertOne({
                tripId: new ObjectId(tripId),
                googleLocationId: googleLocationId,
                ...value,
                interest: []
            });
    
            // search for the new created location
            let location = await db.collection("locations").findOne(locationPost.insertedId);
    
    
            return res.json(location);
             
        }

    }else{
        return res.status(400).json({error: "Provide a type. The type value needs to be an array with at least one of these types: restaurant, activity or accomodation."})
    }
    
  
});
  
  

  

export { postLocationsRouter };