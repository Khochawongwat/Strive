const { ObjectId } = require('mongodb');
const { DATABASE_NAME } = require("../config/server.config")
const { client } = require("../utils/general.function")

async function createTask(taskData) {
    try {
        const database = client.db(DATABASE_NAME);
        const collection = database.collection('Tasks');
        const result = await collection.insertOne(taskData);
        return { ...result, task: taskData };
    } catch (error) {
        console.error('Error creating task in MongoDB:', error);
        throw error;
    }
}

async function updateTask(taskId, updatedTask) {
    try {
        const database = client.db(DATABASE_NAME);
        const collection = database.collection('Tasks');

        const { _id, ...updatedTaskWithoutId } = updatedTask;
        
        const toBeUpdatedTask = {
            ...updatedTaskWithoutId,
            subtasks: updatedTaskWithoutId.subtasks.map(subtask => ({
                ...subtask,
                _id: new ObjectId(subtask._id),
            })),
        };

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(taskId) },
            { $set: { ...toBeUpdatedTask } },
            { returnDocument: 'after' }
        );

        return result;
    } catch (error) {
        console.error("Error updating task in MongoDB: ", error);
        throw error;
    }
}

async function updateSubtask(taskId, subtaskId, updatedSubtask) {
    try {
        if (!ObjectId.isValid(updatedSubtask._id)) {
            throw new Error('Invalid ObjectId for subtask._id');
        }

        const objectedSubtask = {
            ...updatedSubtask,
            _id: new ObjectId(subtaskId)
        }

        const database = client.db(DATABASE_NAME);
        const collection = database.collection('Tasks');
        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(taskId), 'subtasks._id': new ObjectId(subtaskId)},
            { $set: { 'subtasks.$': objectedSubtask } },
            { returnDocument: 'after' }
        );

        return result;
    } catch (error) {
        console.error("Error updating subtask in MongoDB: ", error);
        throw error;
    }
}

async function createSubtask(taskId, subtask) {
    try {
        const database = client.db(DATABASE_NAME);
        const collection = database.collection('Tasks');
        const existingTask = await collection.findOne({ _id: new ObjectId(taskId) });

        if (existingTask) {
            const updatedTask = await collection.findOneAndUpdate(
                { _id: new ObjectId(taskId) },
                { $push: { subtasks: {
                    _id: new ObjectId(),
                    ...subtask,
                } } },
                { returnDocument: 'after' }
            );
            return updatedTask;
        } else {
            console.error('Task not found.');
            return null;
        }
    } catch (error) {
        console.error("Error creating subtask in MongoDB: ", error)
        throw error
    }
}

async function deleteSubtask(taskId, subtaskId) {
    try {
        const database = client.db(DATABASE_NAME);
        const collection = database.collection('Tasks');

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(taskId) },
            { $pull: { subtasks: { _id: new ObjectId(subtaskId) } } },
            { returnDocument: 'after' }
        );

        return result;
    } catch (error) {
        console.error("Error deleting subtask in MongoDB: ", error);
        throw error;
    }
}

async function deleteAllSubtasks(taskId) {
    try {
        const database = client.db(DATABASE_NAME);
        const collection = database.collection('Tasks');

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(taskId) },
            { $set: { subtasks: [] } },
            { returnDocument: 'after' }
        );

        return result;
    } catch (error) {
        console.error("Error deleting all subtasks in MongoDB: ", error);
        throw error;
    }
}

async function deleteTaskById(taskId) {
    try {
        const database = client.db(DATABASE_NAME);
        const collection = database.collection('Tasks');
        const result = await collection.findOneAndDelete({ _id: taskId })
        return { ...result, task: taskId }
    } catch (error) {
        console.error("Error deleting task in MongoDB: ", error)
        throw error
    }
}

async function deleteTasksByColumn(author, status) {
    try {
        const database = client.db(DATABASE_NAME);
        const collection = database.collection('Tasks');
        console.log(author, status)
        const result = await collection.deleteMany({ author: author, status: status });
        return result.deletedCount;
    } catch (error) {
        console.error("Error deleting tasks in MongoDB: ", error);
        throw error;
    }
}

async function fetchTasksById(userId) {
    try {
        const database = client.db(DATABASE_NAME);
        const collection = database.collection('Tasks');
        const tasks = await collection.find({ author: userId }).toArray();
        return tasks;
    } catch (error) {
        console.error('Error fetching tasks by ID from MongoDB:', error);
        throw error;
    }
}

module.exports = {
    createTask,
    createSubtask,
    fetchTasksById,
    updateSubtask,
    deleteTaskById,
    deleteTasksByColumn,
    updateTask,
    deleteSubtask,
    deleteAllSubtasks
}