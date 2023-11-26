const { MongoClient} = require('mongodb');
const {MONGO_URI, MONGO_OPTIONS, DATABASE_NAME} = require("../config/server.config")

const client = new MongoClient(MONGO_URI, MONGO_OPTIONS);

async function connectToMongoDB() {
  const maxAttempts = 5;
  let currentAttempt = 0;
  
  while (currentAttempt < maxAttempts) {
    try {
      console.log("Attempting to connect to MongoDB..")
      await client.connect();
      console.log('Connected to MongoDB..');
      break;
    } catch (error) {
      currentAttempt++;
      console.error(`Error connecting to MongoDB (Attempt ${currentAttempt}):`, error);

      const delay = 5000;
      console.log(`Retrying connection in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  if (currentAttempt === maxAttempts) {
    console.error(`Failed to connect to MongoDB after ${maxAttempts} attempts.`);
    throw new Error('Failed to connect to MongoDB');
  }
}


async function closeMongoDBConnection() {
  try {
    await client.close();
    console.log('Closed MongoDB connection');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
}

async function fetchDataFromMongoDB(COLLECTION_NAME) {
  try {
    const database = client.db(DATABASE_NAME); 
    const collection = database.collection(COLLECTION_NAME);

    const data = await collection.find({}).toArray();
    return data;
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    throw error;
  }
}

module.exports = {
  client,
  connectToMongoDB,
  closeMongoDBConnection,
  fetchDataFromMongoDB,
};
