import express from "express";
import { ObjectId } from "mongodb";
import { db } from "../../db/mongo.js";
import { idSchema, isValidObjectId } from "../../validators/idValidator.js";

const deleteLocationsRouter = express.Router();

async function deleteLocationData(locationId, req, res) {
    try{
        await db.collection("locations").deleteOne({
            _id: new ObjectId(locationId),
          });
    }catch(err){
        return (res.status(400).json({error: err}))
    }

    return res.json({message: 'Location is succesfully deleted.'})
}


// Remove user by id
deleteLocationsRouter.delete("/:locationId", async (req, res) => {
  const locationId = req.params.locationId;

  // Validation
  const { error } = idSchema.validate(locationId);

  if (error) {
    const errorArray = error.details.map((err) => err.message);
    return res.status(400).json({ errors: errorArray });
  }

  const location = await db.collection("locations").findOne({
    _id: new ObjectId(locationId),
  });

  if(location){
    deleteLocationData(locationId, req, res);
  }else{
    return res.status(404).json({message: 'Location not found.'})
  }

  
});




export {deleteLocationsRouter};