import express from "express";
import { ObjectId } from "mongodb";

// Bcript to hash passwords
import bcrypt from 'bcrypt';
import { db } from "../../db/mongo.js";
import { addLoggedInUserToTripSchema, createTripSchema } from "../../validators/tripValidator.js";
import { isValidObjectId } from "../../validators/idValidator.js";
import { loggedInMiddleware } from "../../middleware/loggedInMiddleware.js";


const postTripsRouter = express.Router();


postTripsRouter.post("/add", loggedInMiddleware, async (req, res) => {
    // Check if the user is logged in
  
    const loggedInUserId = req.user._id;
    const { error, value } = createTripSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorArray = [];
        error.details.map((err)=>{
            errorArray.push(err.message);
        });

        return res.status(400).json({ error: errorArray });
    }

    const { tripName, startDate, endDate, password, country, cities } = value;
    // const salt = await bcrypt.genSalt(10);
    
    // //   Hash given password
    // const hashPassword = await bcrypt.hash(password, salt);
    
    const tripPost = await db.collection("trips").insertOne({ 
        tripName: tripName,
        startDate: startDate,
        endDate: endDate,
        country: country,
        cities: cities,
        members: [loggedInUserId.toString()],
        password: password,
        createdOn: Date.now()
    });

    console.log(tripPost);
    // search for the new created trip
    let trip = await db.collection("trips").findOne(tripPost.insertedId);


    // delete trip.password;
    return res.json(trip);
    
  
});


// add the logged in user that has been invited to the trip
postTripsRouter.post("/:tripId/addLoggedInUserToTrip", loggedInMiddleware, async (req, res) => {
    const tripId = req.params.tripId;
   
    const loggedInUserId = req.user._id;

    // Check if the password and trip id are correct
    const { error, value } = addLoggedInUserToTripSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorArray = [];
        error.details.map((err)=>{
            errorArray.push(err.message);
        });

        return res.status(400).json({ error: errorArray });
    }

    if(!isValidObjectId(tripId)){
        return res.status(400).json({ error: 'The given trip id is invalid.' });
    }
    
  
    // check if the trip exists in the database
    let trip = await db.collection("trips").findOne({
         _id: new ObjectId(tripId),
    });
    
  
    if (!trip) {
        return res.status(401).json({
            error: "There is no trip for this trip id.",
        });
    }else{

        // Check if the user already has been added to this trip
        if(trip.members.includes(loggedInUserId.toString())){
            return res.status(401).json({error: 'This user has aready been added to this trip.'})
        }else{
            //   const validPassword = await bcrypt.compare(value.password, trip.password);
            const validPassword = (value.password === trip.password);

            if (!validPassword){
                return res.status(401).json({error: 'Incorrect Password'});

            }else{
                        

                const membersArray = trip.members;

                membersArray.push(loggedInUserId.toString());
                        
                const newData = { 
                    ...trip, 
                    members: membersArray
                };


                await db.collection("trips").replaceOne({ _id: new ObjectId(tripId) }, newData);

                return res.json(newData); 
                    
            }
        }
        
    }
   
});
  
  

  

export { postTripsRouter };