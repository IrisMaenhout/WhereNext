import express from "express";
import { ObjectId } from "mongodb";
import { db } from "../../db/mongo.js";
import { idSchema, isValidObjectId } from "../../validators/idValidator.js";

const deleteTripsRouter = express.Router();

async function deleteData(dbId, dbName, req, res) {
    try{

      if(dbName === "locations"){
        await db.collection(dbName).deleteMany({
          tripId: dbId
        });
      }else{
        await db.collection(dbName).deleteOne({
          _id: new ObjectId(dbId),
        });
      }
        
    }catch(err){
        return (res.status(400).json({error: err}))
    }
    
    // Remove the user from the participating friends in a trip
}


// Remove trip and all locations that belonged to it
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
    // Remove all locations that are linked with this trip
    await deleteData(tripId, "locations", req, res);
    // Delete trip
    await deleteData(tripId, "trips", req, res);
    
    return res.json({message: 'Trip and al saved locations for this trip are succesfully deleted.'})
  }else{
    return res.status(404).json({message: 'Trip not found.'})
  }

  
});




export {deleteTripsRouter};