const express = require('express')
const router = express.Router();

const usersRoute = require('./user.route');
const aiRoutes = require('./ai.route');
const recipesRoutes = require('./recipes.route');
const healthRoute = require('./health.route');

// Add user routing
router.use('/users', usersRoute);

// Add ai routing
router.use('/ai', aiRoutes);

// Add recipes routing
router.use('/recipes', recipesRoutes);

// Add health routing for CI
router.use('/', healthRoute);

module.exports = router