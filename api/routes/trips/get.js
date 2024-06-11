import express from "express";
import { ObjectId } from "mongodb";
import { db } from "../../db/mongo.js";
// import { adminMiddleware } from "../../middleware/adminMiddleware.js";
// import { realEstateAgentMiddleware } from "../../middleware/realEstateAgentMiddleware.js";
import { isValidObjectId } from "../../validators/idValidator.js";
import { loggedInMiddleware } from "../../middleware/loggedInMiddleware.js";

const getTripsRouter = express.Router();

// Get all trips
getTripsRouter.get("/", async (req, res) => {
  const trips = await db.collection("trips").find().toArray();
  res.json(trips);
});

// Get all trips for the logged in user
getTripsRouter.get("/my-trips", loggedInMiddleware, async (req, res) => {
  const loggedInUserId = req.user._id;
  console.log(loggedInUserId);

  const trips = await db.collection("trips").find({
    members: { $all: [loggedInUserId] }
  }).toArray();

  if (trips) {
    const tripsWithFormattedDates = trips.map(trip => {
      return {
        ...trip,
        startDateString: new Date(trip.startDate).toLocaleDateString(),
        endDateString: new Date(trip.endDate).toLocaleDateString()
      };
    });

    return res.json(tripsWithFormattedDates);
  } else {
    return res.status(404).json({ error: "There are no trips found for this user." });
  }
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