import express from "express";
import { ObjectId } from "mongodb";

import { db } from "../../db/mongo.js";

import { updateTripSchema } from "../../validators/tripValidator.js";
import { isValidObjectId } from "../../validators/idValidator.js";

const patchTripsRouter = express.Router();


async function updateTrip(trip, req, res) {
    
    // if trip exists, update the data
    if (trip) {
        const { _id, ...data } = req.body;

        const newData = { ...trip, ...data };

        await db.collection("trips").replaceOne({ _id: new ObjectId(trip._id) }, newData);

        return res.json(newData);
    } else {
        return res.status(404).json({ error: "Trip not found." });
    }
}



// update given trip by id 
patchTripsRouter.patch("/:id", async (req, res) => {

    const id = req.params.id;

    // Validation
    const { error, value } = updateTripSchema.validate({ ...req.body }, { abortEarly: false });

    if (error) {
      const errorArray = error.details.map((err) => err.message);
      return res.status(400).json({ errors: errorArray });
    }

    if(!isValidObjectId(id)){
        return res.status(400).json({ error: "The given id is invalid"});
    }

    // check if trip exists
    const trip = await db
    .collection("trips")
    .findOne({ _id: new ObjectId(id) });

    await updateTrip(trip, req, res);
});

// remove user from trip
patchTripsRouter.patch("/:tripId/:userId", async (req, res) => {

    const tripId = req.params.tripId;
    const userId = req.params.userId;

    // Validation
    const { error, value } = updateTripSchema.validate({ ...req.body }, { abortEarly: false });

    if (error) {
      const errorArray = error.details.map((err) => err.message);
      return res.status(400).json({ errors: errorArray });
    }

    if(!isValidObjectId(tripId) || !isValidObjectId(userId)){
        return res.status(400).json({ error: "One or more of the given id's is invalid"});
    }

    // check if trip exists
    const trip = await db
    .collection("trips")
    .findOne({ _id: new ObjectId(tripId) });

    // updateTrip(trip, req, res);


    if(trip){

        const membersArray = trip.members;

        const index = membersArray.indexOf(userId);
        if (index > -1) { // only splice array when item is found
            membersArray.splice(index, 1); // 2nd parameter means remove one item only
        }


        const newData = { 
            ...trip, 
            members: membersArray
        };


        await db.collection("trips").replaceOne({ _id: new ObjectId(trip._id) }, newData);

        return res.json(newData);
    }else{
        return res.status(404).json({ error: "Trip not found." });
    }


});








export { patchTripsRouter };