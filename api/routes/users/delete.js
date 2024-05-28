import express from "express";
import { ObjectId } from "mongodb";
import { db } from "../../db/mongo.js";
import { idSchema, isValidObjectId } from "../../validators/idValidator.js";
import { loggedInMiddleware } from "../../middleware/loggedInMiddleware.js";

const deleteUsersRouter = express.Router();

async function deleteUserData(userId, req, res) {
    try{
        await db.collection("users").deleteOne({
            _id: new ObjectId(userId),
          });
    }catch(err){
        return (res.status(400).json({error: err}))
    }
    
    // Remove the user from the participating friends in a trip

    return res.json({message: 'User is succesfully deleted.'})
}


deleteUsersRouter.delete("/loggedInUser", loggedInMiddleware, async (req, res) => {
  const loggedInUser = req.user;

  deleteUserData(loggedInUser._id, req, res);
});

// Remove user by id
deleteUsersRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;

  // Validation
  const { error } = idSchema.validate(id);

  if (error) {
       const errorArray = error.details.map((err) => err.message);
       return res.status(400).json({ errors: errorArray });
  }

  const user = await db.collection("users").findOne({
    _id: new ObjectId(id),
  });

  if(user){
    deleteUserData(id, req, res);
  }else{
    return res.status(404).json({message: 'User not found.'})
  }

  
});




export {deleteUsersRouter};