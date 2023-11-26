const express = require('express');
const generalRouter = express.Router();

const { isConnected } = require("../utils/general.function")

generalRouter.get('/', async (req, res) => {
    try {
        const response = await isConnected()
        res.json(response)
    } catch (error) {
        console.error('Error fetching status of Mongo:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = {
    generalRouter
}