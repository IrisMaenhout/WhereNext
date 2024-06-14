import "dotenv/config";

import express from "express";
import { ObjectId } from "mongodb";
import { db } from "./db/mongo.js";

import { registerMiddleware } from "./middleware/index.js";

// import { getUsersRouter } from "./routes/users/get.js";
import { postUsersRouter } from "./routes/users/post.js";
import { getUsersRouter } from "./routes/users/get.js";
import { patchUsersRouter } from "./routes/users/patch.js";
// import { patchUsersRouter } from "./routes/users/patch.js";
// import { deleteUsersRouter } from "./routes/users/delete.js";

// import { postAgenciesRouter } from "./routes/realEstateAgencies/post.js";
// import { patchAgenciesRouter } from "./routes/realEstateAgencies/patch.js";
// import { getAgenciesRouter } from "./routes/realEstateAgencies/get.js";
// import { deleteRealEstateAgenciesRouter } from "./routes/realEstateAgencies/delete.js";
// import { postRealEstatesRouter } from "./routes/realEstate/post.js";
// import { patchRealEstatesRouter } from "./routes/realEstate/patch.js";
// import { getRealEstatesRouter } from "./routes/realEstate/get.js";
// import { deleteRealEstatesRouter } from "./routes/realEstate/delete.js";
// import { postFavoritesRouter } from "./routes/favorites/post.js";
// import { getFavoritesRouter } from "./routes/favorites/get.js";
// import { deleteFavoritesRouter } from "./routes/favorites/delete.js";
// import { postMessagesRouter } from "./routes/messages/post.js";
// import { patchMessagesRouter } from "./routes/messages/patch.js";
// import { getMessagesRouter } from "./routes/messages/get.js";
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