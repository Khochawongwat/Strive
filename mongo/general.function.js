const { MongoClient} = require('mongodb');

const client = new MongoClient(MONGO_URI, MONGO_OPTIONS);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
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
