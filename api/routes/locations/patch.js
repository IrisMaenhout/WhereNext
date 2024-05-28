import express from "express";
import { ObjectId } from "mongodb";

import { db } from "../../db/mongo.js";

// import { updateTripSchema } from "../../validators/tripValidator.js";
import { isValidObjectId } from "../../validators/idValidator.js";
import { loggedInMiddleware } from "../../middleware/loggedInMiddleware.js";
import { addIntrestScoreForLoggedInUser, addNote, updateAccomodationLocationSchema, updateLocationSchema } from "../../validators/locationValidator.js";

const patchLocationsRouter = express.Router();


async function updateLocationData(location, req, res) {
    
    // if the location is saved in the db, update the data
    if (location) {
        const { _id, ...data } = req.body;

        const newData = { ...location, ...data };

        await db.collection("locations").replaceOne({ _id: new ObjectId(location._id) }, newData);

        return res.json(newData);
    } else {
        return res.status(404).json({ error: "Location not found." });
    }
}



// update location from a given trip and check if user is part of the participans for this trip
patchLocationsRouter.patch("/:googleLocationId/edit/:tripId", loggedInMiddleware,  async (req, res) => {
    const tripId = req.params.tripId;
    const googleLocationId = req.params.googleLocationId;

    // check if the location has already been saved in the db.
    const location = await db.collection("locations").findOne({ tripId: new ObjectId(tripId), googleLocationId });

    if(location){
        const locationType = req.body.type ? req.body.type : location.type;

        console.log(locationType);
        const { error, value } = locationType === "restaurant" || locationType === "activity" ? updateLocationSchema.validate(req.body, { abortEarly: false }) : updateAccomodationLocationSchema.validate(req.body, { abortEarly: false });

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


        await updateLocationData(location, req, res);
    }else{
        return res.status(401).json({
            error: "This location has not been added to this trip.",
        });
    }
    
  
});


// update location from a given trip and check if user is part of the participans for this trip
patchLocationsRouter.patch("/:googleLocationId/addIndividualRating/:tripId", loggedInMiddleware,  async (req, res) => {
    const tripId = req.params.tripId;
    const googleLocationId = req.params.googleLocationId;

    if(!isValidObjectId(tripId)){
        return res.status(400).json({ error: "The given trip id is invalid." });
    }

    // check if the location has been saved in the db.
    const location = await db.collection("locations").findOne({ tripId: new ObjectId(tripId), googleLocationId });

    if(location){
        
        const { error, value } = addIntrestScoreForLoggedInUser.validate(req.body, { abortEarly: false });

        if (error) {
            const errorArray = [];
            error.details.map((err)=>{
                errorArray.push(err.message);
            })
            return res.status(400).json({ error: errorArray });
        }

        

        // Add score to array of scores in the db and check if the user has not left an score on this location, if they did they should still be able to update their own score

        
        const newRating = {
            ...value,
            user: req.user._id.toString()
        }  

        const i = location.interest.findIndex(e => e.user === req.user._id.toString());
        if (i > -1) {
 
            location.interest.splice(i, 1, newRating);
            await db.collection("locations").replaceOne({ _id: new ObjectId(location._id) }, location);

            return res.json(location); 
        }else{
                
            const membersInterest = location.interest;

            membersInterest.push(newRating);
                        
            const newData = { 
                ...location, 
                interest: membersInterest
            };


            await db.collection("locations").replaceOne({ _id: new ObjectId(location._id) }, newData);

            return res.json(newData); 
                    
        }
        
    }else{
        return res.status(401).json({
            error: "This location has not been added to this trip.",
        });
    }

    
  
});



patchLocationsRouter.patch("/:googleLocationId/addNote/:tripId", loggedInMiddleware,  async (req, res) => {
    const tripId = req.params.tripId;
    const googleLocationId = req.params.googleLocationId;

    if(!isValidObjectId(tripId)){
        return res.status(400).json({ error: "The given trip id is invalid." });
    }

    // check if the location has been saved in the db.
    const location = await db.collection("locations").findOne({ tripId: new ObjectId(tripId), googleLocationId });

    if(location){
        
        const { error, value } = addNote.validate(req.body, { abortEarly: false });

        if (error) {
            const errorArray = [];
            error.details.map((err)=>{
                errorArray.push(err.message);
            })
            return res.status(400).json({ error: errorArray });
        }


        const newData = {
            ...location,
            note: {
                content: value.content,
                editedBy: {
                    user: req.user._id.toString(),
                    date: Date()
                }
            }
         };

        await db.collection("locations").replaceOne({ _id: new ObjectId(location._id) }, newData);

        return res.json(newData);
        
    }else{
        return res.status(401).json({
            error: "This location has not been added to this trip.",
        });
    } 
  
});
  






export { patchLocationsRouter };