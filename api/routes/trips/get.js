import express from "express";
import { ObjectId } from "mongodb";
import { db } from "../../db/mongo.js";
// import { adminMiddleware } from "../../middleware/adminMiddleware.js";
// import { realEstateAgentMiddleware } from "../../middleware/realEstateAgentMiddleware.js";
import { isValidObjectId } from "../../validators/idValidator.js";

const getTripsRouter = express.Router();

// Get all trips
getTripsRouter.get("/", async (req, res) => {
  const trips = await db.collection("trips").find().toArray();
  res.json(trips);
});

// Get trip by id 
getTripsRouter.get("/:id", async (req, res) => {
  const tripId = req.params.id;
  
  // Validation
  
  if(!isValidObjectId(tripId)){
    return res.status(400).json({ error: "The provided trip id is not valid" });
  }

  const trip = await db.collection("trips").findOne({
    _id: new ObjectId(tripId),
  });

  if (trip) {
    return res.json(trip);
  } else {
    return res.status(404).json({ error: "Trip not found" });
  }
});


export {getTripsRouter};