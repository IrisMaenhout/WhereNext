import express from "express";
import { ObjectId } from "mongodb";
import { db } from "../../db/mongo.js";
import { isValidObjectId } from "../../validators/idValidator.js";
import { loggedInMiddleware } from "../../middleware/loggedInMiddleware.js";

const getLocationsRouter = express.Router();

// Get all locations
getLocationsRouter.get("/", async (req, res) => {
  const locations = await db.collection("locations").find().toArray();
  res.json(locations);
});

// Get a specific saved location in a trip 
getLocationsRouter.get("/:locationId/inTrip/:tripId", loggedInMiddleware, async (req, res) => {
  const tripId = req.params.tripId;
  const googleLocationId = req.params.locationId;
  
  // Validation
  
  if(!isValidObjectId(tripId)){
    return res.status(400).json({ error: "The provided trip id is not valid" });
  }

  const location = await db.collection("locations").findOne({
    tripId: tripId,
    googleLocationId: googleLocationId
  });

  if (location) {
    return res.json(location);
  } else {
    return res.status(404).json({ error: "Location not found" });
  }
});


export {getLocationsRouter};