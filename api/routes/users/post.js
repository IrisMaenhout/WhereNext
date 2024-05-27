import express from "express";
import { ObjectId } from "mongodb";

// Bcript to hash passwords
import bcrypt from 'bcrypt';
import { db } from "../../db/mongo.js";
import { createUserSchema, loginSchema } from "../../validators/userValidator.js";


const postUsersRouter = express.Router();

// define a route to handle user login
postUsersRouter.post("/login", async (req, res) => {
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorArray = [];
      error.details.map((err)=>{
        errorArray.push(err.message);
      })
      return res.status(400).json({ error: errorArray });
    }

    const email = value.email;
    
  
    // check if user exists in the database
    let user = await db.collection("users").findOne({ email });
    
  
    if (!user) {
      return res.status(401).json({
          error: "User doesn't exist",
      });
    }else{
      const validPassword = await bcrypt.compare(value.password, user.password);

      if (!validPassword){
          return res.status(401).json({error: 'Incorrect Password'})
      }else{
          delete user.password;
          return res.status(200).json(user);
      }
      
    }
  
    // send back the user object
   
});
  
postUsersRouter.post("/add", async (req, res) => {
    const { error, value } = createUserSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorArray = [];
      error.details.map((err)=>{
        errorArray.push(err.message);
      })
      return res.status(400).json({ error: errorArray });
    }


    const {firstname, lastname, email, phoneNr, password} = value;
    const salt = await bcrypt.genSalt(10);
  
    //   Hash given password
    const hashPassword = await bcrypt.hash(password, salt);
  
  
    // check if user exists in the database
    let user = await db.collection("users").findOne({ email });
  
    // if not, add user to the database
    if (!user) {
      await db.collection("users").insertOne({ 
          firstname: firstname,
          lastname: lastname,
          email: email,
          phoneNr: phoneNr,
          password: hashPassword,
          registeredOn: Date.now()
      });

      // search for the new created user
      let user = await db.collection("users").findOne({ email });


      delete user.password;
      return res.json(user);
    }else{
      return res.status(400).json({
          error: 'User already exist with this email addres.',
      });
    }
  
  });
  

  

export { postUsersRouter };