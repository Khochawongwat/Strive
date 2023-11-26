const express = require('express');
const router = express.Router();

const { fetchDataFromMongoDB } = require("../strive/mongo/general.function"); 
const { fetchUserById, createUser, updateUser, deleteUser } = require("../strive/mongo/users.function")

router.get('/users', async (req, res) => {
  try {
    const users = await fetchDataFromMongoDB("users");
    res.json(users)
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await fetchUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/users', async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await createUser(userData);
    res.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const updatedUserData = req.body;
    const updatedUser = await updateUser(userId, updatedUserData);
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const deletedUser = await deleteUser(userId);
    if (deletedUser) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
