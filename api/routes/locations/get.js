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


// // Get all saved locations in a trip that are saved as itinerary
// getLocationsRouter.get("/getItinerary/inTrip/:tripId/:date", loggedInMiddleware, async (req, res) => {
//   const tripId = req.params.tripId;
//   const date = req.params.date;

//   // Validate tripId
//   if (!isValidObjectId(tripId)) {
//     return res.status(400).json({ error: "The provided trip id is not valid" });
//   }

//   // Convert date string to Date object
//   const dateObj = new Date(date);
//   if (isNaN(dateObj)) {
//     return res.status(400).json({ error: "The provided date is not valid" });
//   }

//   const dbQuery = {
//     tripId: new ObjectId(tripId),
//     "savedLocation.itinerary": true, 
//     date: dateObj
//   };

//   const options = {
//     sort: { order: 1 }
//   };

//   try {
//     const itineraryLocations = await db.collection("locations").find(dbQuery, options).toArray();
    
//     if (itineraryLocations.length > 0) {
//       return res.json(itineraryLocations);
//     } else {
//       return res.status(404).json({ error: "There are no locations saved for this trip on the specified date." });
//     }
//   } catch (error) {
//     console.error("Error fetching itinerary locations:", error);
//     return res.status(500).json({ error: "An error occurred while fetching the itinerary locations." });
//   }
// });


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