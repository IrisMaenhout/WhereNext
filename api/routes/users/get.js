import express from "express";
import { ObjectId } from "mongodb";
import { db } from "../../db/mongo.js";
// import { adminMiddleware } from "../../middleware/adminMiddleware.js";
// import { realEstateAgentMiddleware } from "../../middleware/realEstateAgentMiddleware.js";
import { idSchema, isValidObjectId} from "../../validators/idValidator.js";
import { loggedInMiddleware } from "../../middleware/loggedInMiddleware.js";

const getUsersRouter = express.Router();

// Get all users 
getUsersRouter.get("/", async (req, res) => {
  const users = await db.collection("users").find().toArray();
  res.json(users);
});

// Get logged in user data
getUsersRouter.get("/loggedInUser", loggedInMiddleware, async (req, res) => {
  const user = req.user;
  delete user.password;
  return res.json(user);
});

// Get user by id 
getUsersRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  
  // Validation
  const { error, value } = idSchema.validate(id);
  console.log(value, error);


  if (error) {
       const errorArray = error.details.map((err) => err.message);
       return res.status(400).json({ errors: errorArray });
  }

  if(!isValidObjectId(id)){
    return res.status(400).json({ error: "The provided id is not valid" });
  }



  const user = await db.collection("users").findOne({
    _id: new ObjectId(id),
  });

  if (user) {
    delete user.password;
    return res.json(user);
  } else {
    return res.status(404).json({ error: "User not found" });
  }
});



export {getUsersRouter};