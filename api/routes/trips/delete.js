import express from "express";
import { ObjectId } from "mongodb";
import { db } from "../../db/mongo.js";
import { idSchema, isValidObjectId } from "../../validators/idValidator.js";

const deleteTripsRouter = express.Router();

async function deleteTripData(tripId, req, res) {
    try{
        await db.collection("trips").deleteOne({
            _id: new ObjectId(tripId),
          });
    }catch(err){
        return (res.status(400).json({error: err}))
    }
    
    // Remove the user from the participating friends in a trip

    return res.json({message: 'Trip is succesfully deleted.'})
}


// Remove user by id
deleteTripsRouter.delete("/:tripId", async (req, res) => {
  const tripId = req.params.tripId;

  // Validation
  const { error } = idSchema.validate(tripId);

  if (error) {
    const errorArray = error.details.map((err) => err.message);
    return res.status(400).json({ errors: errorArray });
  }

  const trip = await db.collection("trips").findOne({
    _id: new ObjectId(tripId),
  });

  if(trip){
    deleteTripData(tripId, req, res);
  }else{
    return res.status(404).json({message: 'Trip not found.'})
  }

  
});




export {deleteTripsRouter};