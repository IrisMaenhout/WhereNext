import express from "express";
import { ObjectId } from "mongodb";

import { db } from "../../db/mongo.js";

// Bcript to hash passwords
import bcrypt from 'bcrypt';
import { updateUserSchema } from "../../validators/userValidator.js";
import { isValidObjectId } from "../../validators/idValidator.js";
import { loggedInMiddleware } from "../../middleware/loggedInMiddleware.js";

const patchUsersRouter = express.Router();


async function updateUser(user, req, res) {
    
    // if user exists, update the data
    if (user) {
        const { _id, password, registeredOn , ...data } = req.body;

        // If there is a password given, it hashes the password.
        let hashPassword;
        const salt = await bcrypt.genSalt(10);
        if (password !== undefined) hashPassword = await bcrypt.hash(req.body.password, salt);
         

        const newData = { ...user, ...data };

        // Add the hashed password if the password is defined.
        if (hashPassword !== undefined) newData.password = hashPassword;

        await db.collection("users").replaceOne({ _id: user._id }, newData);

        return res.json(newData);
    } else {
        return res.status(404).json({ error: "User not found." });
    }
}

// update data from the user that's logged in
patchUsersRouter.patch("/loggedInUser", loggedInMiddleware , async (req, res) => {

    // Validation
    const { error, value } = updateUserSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorArray = error.details.map((err) => err.message);
        return res.status(400).json({ errors: errorArray });
    }
    
    const loggedInUser = req.user;
    console.log('user',loggedInUser);
    
    updateUser(loggedInUser, req, res)
    
});

// update given user by id 
patchUsersRouter.patch("/:id", async (req, res) => {

    const id = req.params.id;

    // Validation
    const { error, value } = updateUserSchema.validate({ id, ...req.body }, { abortEarly: false });

    if (error) {
      const errorArray = error.details.map((err) => err.message);
      return res.status(400).json({ errors: errorArray });
    }

    if(!isValidObjectId(id)){
        return res.status(400).json({ error: "The given id is invalid"});
    }

    // check if user exists
    const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(id) });

    updateUser(user, req, res);
});






export { patchUsersRouter };