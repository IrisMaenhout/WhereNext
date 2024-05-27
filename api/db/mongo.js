// Import the required modules from the 'mongodb' package
import { MongoClient, ServerApiVersion } from "mongodb";

// Define an async function to initialize a MongoDB client
const initClient = async () => {
    // Retrieve the MongoDB connection string from the environment variables
    const uri = process.env.MONGODB_CONNECTION;

    // Create a new MongoDB client instance with the given options
    const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
    });

    try {
        // Attempt to connect to the MongoDB server using the client instance
        await client.connect();
        console.log("Database connected");
    } catch (error) {
        // If an error occurs during the connection attempt, close the client instance
        await client.close();
        console.log("Failed connecting to MongoDB");
    }

    // Return the client instance
    return client;
};

const client = await initClient();
const db = await client.db(process.env.MONGODB_DBNAME);

// Export the 'initClient' function for use in other modules
export { db };