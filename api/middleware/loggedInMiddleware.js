import { ObjectId } from "mongodb";
import { db } from "../db/mongo.js";
import { isValidObjectId } from "../validators/idValidator.js";

export async function loggedInMiddleware(req, res, next) {
    if (req.headers.authorization) {
    
        if (!isValidObjectId(req.headers.authorization)) {
          return res.status(400).json({ error: "the provided id in header authorization is invalid" });
        }
    
        // check if user with id exists
        const user = await db.collection("users").findOne({ _id: new ObjectId(req.headers.authorization) });
        console.log(user);
    
        if (user) {
          req.user = user;
          return next();
        } else {
          return res.status(401).json({
            error: "Unauthorized",
          });
        }
    
    } else {
        req.user = undefined;
        return res.status(401).json({error: "You are not logged in."});
    }
}