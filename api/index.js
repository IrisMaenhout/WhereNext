import "dotenv/config";


import express from "express";
import { ObjectId } from "mongodb";
import { db } from "./db/mongo.js";

import { registerMiddleware } from "./middleware/index.js";

import { postUsersRouter } from "./routes/users/post.js";
import { getUsersRouter } from "./routes/users/get.js";
import { patchUsersRouter } from "./routes/users/patch.js";

import { idSchema, isValidObjectId } from "./validators/idValidator.js";
import { deleteUsersRouter } from "./routes/users/delete.js";
import { postTripsRouter } from "./routes/trips/post.js";
import { getTripsRouter } from "./routes/trips/get.js";
import { deleteTripsRouter } from "./routes/trips/delete.js";
import { patchTripsRouter } from "./routes/trips/patch.js";
import { postLocationsRouter } from "./routes/locations/post.js";
import { patchLocationsRouter } from "./routes/locations/patch.js";
import { getLocationsRouter } from "./routes/locations/get.js";
import { deleteLocationsRouter } from "./routes/locations/delete.js";


// create an Express app
const app = express();

// set the port for the server to listen on
const port = process.env.PORT;

// register middleware
registerMiddleware(app);

// Routes to create, delete, update or get users
app.use('/users', postUsersRouter, getUsersRouter, patchUsersRouter, deleteUsersRouter);

app.use('/trips', postTripsRouter, getTripsRouter, patchTripsRouter, deleteTripsRouter);


app.use('/locations', postLocationsRouter, getLocationsRouter, patchLocationsRouter, deleteLocationsRouter);


// app.use('/myFavorites', postFavoritesRouter, getFavoritesRouter, deleteFavoritesRouter);

// app.use('/myMessages', postMessagesRouter, patchMessagesRouter, getMessagesRouter);



app.listen(port, () => {
  console.log(`App listening http://localhost:${port}`);
});

// make sure database is closed when server crashes
const closeServer = () => {
  process.exit();
};

process.on("SIGINT", () => closeServer());
process.on("SIGTERM", () => closeServer());