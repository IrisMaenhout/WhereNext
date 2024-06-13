import express from "express";
import { ObjectId } from "mongodb";

import { db } from "../../db/mongo.js";
import { isValidObjectId } from "../../validators/idValidator.js";
import { createAccomodationLocationSchema, createLocationSchema } from "../../validators/locationValidator.js";
import { loggedInMiddleware } from "../../middleware/loggedInMiddleware.js";


const postLocationsRouter = express.Router();

// Add location to trip and check if user is part of the participants for this trip
postLocationsRouter.post("/:googleLocationId/addToTrip/:tripId", loggedInMiddleware,  async (req, res) => {
    const tripId = req.params.tripId;
    const googleLocationId = req.params.googleLocationId;

    const loggedInUserId = req.user._id;

    // Check if there is a type
    if (req.body.type) {
        // Validate different fields depending on the type of the location
        const { error, value } = req.body.type === "restaurant" || req.body.type === "activity" ? createLocationSchema.validate(req.body, { abortEarly: false }) : createAccomodationLocationSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const errorArray = error.details.map(err => err.message);
            return res.status(400).json({ error: errorArray });
        }

        if (!isValidObjectId(tripId)) {
            return res.status(400).json({ error: "The given trip id is invalid." });
        }

        // Check if the user is part of the trip and if the trip exists in the database
        let trip = await db.collection("trips").findOne({
            _id: new ObjectId(tripId),
        });

        if (!trip) {
            return res.status(400).json({
                error: "There is no trip for this trip id.",
            });
        } else {
            console.log("Trip members:", trip.members);
            console.log("Logged in user ID (string):", loggedInUserId);
            console.log("Trip members (string):", trip.members.map(member => member.toString()));
            
            const loggedInUserObjectId = new ObjectId(loggedInUserId);
            const loggedInUserObjectIdStr = loggedInUserObjectId.toString();

            if (!trip.members.map(member => member.toString()).includes(loggedInUserObjectIdStr)) {
                return res.status(401).json({
                    error: "This user has not been added to this trip.",
                });
            }

            // Check if the location has already been saved in the db.
            const isLocationSaved = await db.collection("locations").findOne({ tripId: new ObjectId(tripId), googleLocationId });

            if (isLocationSaved) {
                return res.status(401).json({
                    error: "This location has already been added to this trip.",
                });
            }

            const {date} = value;
            const formatedDate = date ? new Date(date) : null;
            console.log(formatedDate, date);

            const newData = date ? 
            {
                tripId: new ObjectId(tripId),
                googleLocationId: googleLocationId, 
                ...value,
                interest: [],
                date: formatedDate

            } : { 
                tripId: new ObjectId(tripId),
                googleLocationId: googleLocationId,
                ...value,
                interest: []
            };


            // Add the new location to the db.
            const locationPost = await db.collection("locations").insertOne(newData);

            // Search for the newly created location
            let location = await db.collection("locations").findOne(locationPost.insertedId);

            return res.json(location);
        }

    } else {
        return res.status(400).json({ error: "Provide a type. The type value needs to be an array with at least one of these types: restaurant, activity, or accommodation." });
    }
});

// Get all saved locations in a trip that are saved as itinerary with the correct date
// postLocationsRouter.post("/getItinerary/inTrip/:tripId", loggedInMiddleware, async (req, res) => {
//     const tripId = req.params.tripId;
//     const dates = req.body.dates;

//     // Validate tripId
//     if (!isValidObjectId(tripId)) {
//         return res.status(400).json({ error: "The provided trip id is not valid" });
//     }

//     // Validate and convert date strings to Date objects
//     const dateObjs = dates.map(date => {
//         const dateObj = new Date(date);
//         if (isNaN(dateObj)) {
//             return null;
//         }
//         return dateObj;
//     }).filter(dateObj => dateObj !== null);

//     console.log(dateObjs)
//     console.log(dates)

//     if (dateObjs.length === 0) {
//         return res.status(400).json({ error: "The provided dates are not valid" });
//     }

//     const dbQuery = {
//         tripId: new ObjectId(tripId),
//         "savedLocation.itinerary": true,
//         date: { $in: dateObjs }
//     };

//     const options = {
//         sort: { order: 1 }
//     };

//     try {
//         const itineraryLocations = await db.collection("locations").find(dbQuery, options).toArray();

//         if (itineraryLocations.length > 0) {
//             return res.json(itineraryLocations);
//         } else {
//             return res.status(404).json({ error: "There are no locations saved for this trip on the specified dates." });
//         }
//     } catch (error) {
//         console.error("Error fetching itinerary locations:", error);
//         return res.status(500).json({ error: "An error occurred while fetching the itinerary locations." });
//     }
// });


postLocationsRouter.post("/:locationId/addAlternative", loggedInMiddleware, async (req, res) => {
    const locationId = req.params.locationId;
    const { alternativeLocationId } = req.body;
  
    if (!isValidObjectId(locationId) || !isValidObjectId(alternativeLocationId)) {
      return res.status(400).json({ error: "The provided location id or alternative location id is not valid" });
    }
  
    try {
      const mainLocation = new ObjectId(locationId);
      const alternativeLocation = new ObjectId(alternativeLocationId);
  
      // Update the main location to include the new alternative
      await db.collection("locations").updateOne(
        { _id: mainLocation },
        { $addToSet: { alternativeLocationIds: alternativeLocation } }
      );
  
      // Update the alternative location to include the main location as an alternative
      await db.collection("locations").updateOne(
        { _id: alternativeLocation },
        { $addToSet: { alternativeLocationIds: mainLocation } }
      );
  
      // Fetch all alternatives of both locations to update their alternative arrays
      const mainLocationDoc = await db.collection("locations").findOne({ _id: mainLocation });
      const alternativeLocationDoc = await db.collection("locations").findOne({ _id: alternativeLocation });
  
      const allAlternatives = [...new Set([...mainLocationDoc.alternativeLocationIds, ...alternativeLocationDoc.alternativeLocationIds, mainLocation, alternativeLocation])];
  
      // Ensure each alternative location has all the other alternatives in their array
      for (const altId of allAlternatives) {
        await db.collection("locations").updateOne(
          { _id: altId },
          { $set: { alternativeLocationIds: allAlternatives.filter(id => id.toString() !== altId.toString()) } }
        );
      }
  
      res.json({ message: "Alternative added successfully and consistency maintained across all related locations" });
    } catch (error) {
      console.error("Error adding alternative:", error);
      res.status(500).json({ error: "An error occurred while adding the alternative." });
    }
  });

  
  postLocationsRouter.post("/getItinerary/inTrip/:tripId", loggedInMiddleware, async (req, res) => {
    const tripId = req.params.tripId;
    const dates = req.body.dates;
  
    if (!isValidObjectId(tripId)) {
      return res.status(400).json({ error: "The provided trip id is not valid" });
    }
  
    const dateObjs = dates.map(date => new Date(date)).filter(dateObj => !isNaN(dateObj));
  
    if (dateObjs.length === 0) {
      return res.status(400).json({ error: "The provided dates are not valid" });
    }
  
    const dbQuery = {
      tripId: new ObjectId(tripId),
      "savedLocation.itinerary": true,
      date: { $in: dateObjs }
    };
  
    const options = {
      sort: { startTime: 1, order: 1 }
    };
  
    try {
      const itineraryLocations = await db.collection("locations").find(dbQuery, options).toArray();
      const alternativeLocationIds = itineraryLocations.reduce((acc, loc) => acc.concat(loc.alternativeLocationIds || []), []);
      const alternativeLocations = await db.collection("locations").find({ _id: { $in: alternativeLocationIds.map(id => new ObjectId(id)) } }).toArray();
  
      const itineraryWithAlternatives = itineraryLocations.map(location => {
        const locationAlternatives = alternativeLocations.filter(alt => location.alternativeLocationIds.includes(alt._id.toString()));
        return { ...location, alternatives: locationAlternatives };
      });
  
      if (itineraryWithAlternatives.length > 0) {
        return res.json(itineraryWithAlternatives);
      } else {
        return res.status(404).json({ error: "There are no locations saved for this trip on the specified dates." });
      }
    } catch (error) {
      console.error("Error fetching itinerary locations:", error);
      return res.status(500).json({ error: "An error occurred while fetching the itinerary locations." });
    }
  });
  
  
  

export { postLocationsRouter };
