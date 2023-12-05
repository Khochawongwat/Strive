const express = require('express');
const {
    createTask,
    fetchTasksById,
    deleteTaskById,
    deleteTasksByColumn,
    createSubtask
} = require('../utils/db.function');

const DBRouter = express.Router();

// Create a task
DBRouter.post("/tasks", async (req, res) => {
    try {
        const task = req.body;
        const newTask = await createTask(task);
        res.status(201).json(newTask); // 201 Created for successful creation
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

DBRouter.post("/tasks/:taskId", async (req, res) => {
    try{
        const subtask = req.body
        const taskId = req.params.taskId
        const updated = await createSubtask(taskId, subtask)
        res.status(201).json(updated)
    }catch(error){
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error'})
    }
})

// Delete a task by ID
DBRouter.delete("/tasks/:taskId", async (req, res) => {
    const taskId = req.params.taskId;
    try {
        const deletedTask = await deleteTaskById(taskId);
        if (deletedTask) {
            res.json(deletedTask);
        } else {
            res.status(404).json({ error: 'Task not found' }); // 404 Not Found for non-existent resource
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete tasks by column
DBRouter.delete("/tasks", async (req, res) => {
    const { author, status } = req.body;
    try {
        const deletedCount = await deleteTasksByColumn(author, status);
        res.status(200).json({ message: `${deletedCount} tasks deleted successfully.` });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Get tasks by user ID
DBRouter.get("/tasks/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const tasks = await fetchTasksById(userId);
        if (tasks) {
            res.json(tasks);
        } else {
            res.status(404).json({ error: 'Tasks not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = {
    DBRouter
};
