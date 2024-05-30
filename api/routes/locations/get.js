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



// Get all saved locations in a trip 
getLocationsRouter.get("/inTrip/:tripId", loggedInMiddleware, async (req, res) => {
  const tripId = req.params.tripId;
  
  // Validation
  
  if(!isValidObjectId(tripId)){
    return res.status(400).json({ error: "The provided trip id is not valid" });
  }

  const location = await db.collection("locations").find({
    tripId: new ObjectId(tripId)
  }).toArray();

  if (location) {
    return res.json(location);
  } else {
    return res.status(404).json({ error: "There are no locations saved for this trip" });
  }
});


// Get all saved locations in a trip that are saved in the bucketlist
getLocationsRouter.get("/getBucketList/inTrip/:tripId", loggedInMiddleware, async (req, res) => {
  const tripId = req.params.tripId;
  
  // Validation
  
  if(!isValidObjectId(tripId)){
    return res.status(400).json({ error: "The provided trip id is not valid" });
  }

  const bucketListLocations = await db.collection("locations").find({
    tripId: new ObjectId(tripId),
    "savedLocation.bucketList": true
  }).toArray();

  if (bucketListLocations) {
    return res.json(bucketListLocations);
  } else {
    return res.status(404).json({ error: "There are no locations saved in the bucketlist for this trip" });
  }
});


// Get all saved locations in a trip that are saved as accomodations
getLocationsRouter.get("/getAccomodations/inTrip/:tripId", loggedInMiddleware, async (req, res) => {
  const tripId = req.params.tripId;
  
  // Validation
  
  if(!isValidObjectId(tripId)){
    return res.status(400).json({ error: "The provided trip id is not valid" });
  }

  const accomodationLocations = await db.collection("locations").find({
    tripId: new ObjectId(tripId),
    "savedLocation.accomodations": true
  }).toArray();

  if (accomodationLocations) {
    return res.json(accomodationLocations);
  } else {
    return res.status(404).json({ error: "There are no accommodations saved for this trip." });
  }
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
    tripId: new ObjectId(tripId),
    googleLocationId: googleLocationId
  });

  if (location) {
    return res.json(location);
  } else {
    return res.status(404).json({ error: "Location not found" });
  }
});




export {getLocationsRouter};