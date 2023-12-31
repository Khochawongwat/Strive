const express = require('express');
const {
    createTask,
    fetchTasksById,
    deleteTaskById,
    deleteTasksByColumn,
    deleteAllSubtasks,
    createSubtask,
    updateSubtask,
    deleteSubtask,
    updateTask,
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

//Update a task
DBRouter.put("/tasks/:taskId", async (req, res) => {
    try {
        const taskId = req.params.taskId
        const updatedTask = req.body
        console.log(updatedTask)
        const updated = await updateTask(taskId, updatedTask)
        res.status(201).json(updated)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

DBRouter.delete("/tasks/:taskId/all-subtasks", async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const result = await deleteAllSubtasks(taskId);
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        console.error("Error deleting all subtasks in MongoDB: ", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

DBRouter.delete("/tasks/:taskId/:subtaskId", async (req, res) => {
    try {
        const taskId = req.params.taskId
        const subtaskId = req.params.subtaskId
        const result = await deleteSubtask(taskId, subtaskId)
        if (result) {
            res.json(result)
        } else {
            res.status(404).json({ error: 'Subtask not found' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

DBRouter.put("/tasks/:taskId/:subtaskId", async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const subtaskId = req.params.subtaskId;
        const updatedSubtask = req.body;
        const result = await updateSubtask(taskId, subtaskId, updatedSubtask)
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: 'Subtask not found' });
        }
    } catch (error) {
        console.error("Error updating subtask in MongoDB: ", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

DBRouter.post("/tasks/:taskId", async (req, res) => {
    try {
        const subtask = req.body
        const taskId = req.params.taskId
        const updated = await createSubtask(taskId, subtask)
        res.status(201).json(updated)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
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
