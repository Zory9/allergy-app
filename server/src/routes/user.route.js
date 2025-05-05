const express = require('express');
const { registerUser, loginUser, updateUser, getUserById } = require('../controllers/user.controller');

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route for user update
router.post('/update', updateUser);

// Route for obtaining user by id
router.get('/', getUserById);

module.exports = router;