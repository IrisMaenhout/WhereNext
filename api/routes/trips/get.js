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

// Get all members of a trip by trip id
getTripsRouter.get("/:id/members", async (req, res) => {
  const tripId = req.params.id;
  
  // Validate the trip ID
  if (!isValidObjectId(tripId)) {
    return res.status(400).json({ error: "The provided trip id is not valid" });
  }

  try {
    // Fetch the trip by ID to get member IDs
    const trip = await db.collection("trips").findOne({ _id: new ObjectId(tripId) });
    
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    const memberIds = trip.members.map(id => new ObjectId(id));

    // Fetch user details using member IDs
    const members = await db.collection("users").find({ _id: { $in: memberIds } }).toArray();

    if (members) {
      return res.json(members);
    } else {
      return res.status(404).json({ error: "No members found for this trip" });
    }
  } catch (error) {
    console.error("Error fetching members: ", error);
    return res.status(500).json({ error: "An error occurred while fetching members" });
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