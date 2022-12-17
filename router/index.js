const express = require('express');
const router = express.Router();    // Create a router
const userRoutes = require('./routes/user');

router.use('/user', userRoutes);

module.exports = router