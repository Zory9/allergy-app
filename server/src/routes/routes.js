const express = require('express')
const router = express.Router();

const usersRoute = require('./user.route');
const aiRoutes = require('./ai.route')

// Add user routing
router.use('/users', usersRoute);

// Add ai routing
router.use('/ai', aiRoutes);

module.exports = router