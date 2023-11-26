const { ObjectId } = require('mongodb');
const { DATABASE_NAME } = require("../config/server.config")
const {client} = require("../utils/general.function")

async function fetchUserById(userId) {
    try {
        const database = client.db(DATABASE_NAME);
        const collection = database.collection('Users');

        const user = await collection.findOne({ _id: ObjectId(userId) });
        return user;
    } catch (error) {
        console.error('Error fetching user by ID from MongoDB:', error);
        throw error;
    }
}

async function createUser(userData) {
    try {
        const database = client.db(DATABASE_NAME);
        const collection = database.collection('Users');
        const result = await collection.insertOne(userData);
        console.log(result)
        return result;
    } catch (error) {
        console.error('Error creating user in MongoDB:', error);
        throw error;
    }
}

async function updateUser(userId, updatedUserData) {
    try {
        const database = client.db(DATABASE_NAME);
        const collection = database.collection('Users');

        const result = await collection.findOneAndUpdate(
            { _id: ObjectId(userId) },
            { $set: updatedUserData },
            { returnDocument: 'after' }
        );

        return result.value;
    } catch (error) {
        console.error('Error updating user in MongoDB:', error);
        throw error;
    }
}

async function deleteUser(userId) {
    try {
        const database = client.db(DATABASE_NAME);
        const collection = database.collection('Users');

        const result = await collection.findOneAndDelete({ _id: ObjectId(userId) });

        return result.value;
    } catch (error) {
        console.error('Error deleting user in MongoDB:', error);
        throw error;
    }
}

module.exports = {
    fetchUserById,
    createUser,
    updateUser,
    deleteUser
}