const express = require('express');
const router = express.Router();    // Create a router
const { createUser, connectUser, getUser, logoutUser } = require('../../controllers/userController/index');
const verifyToken  = require('../../framework/jwtMiddleware');


router.post('/login', connectUser)

router.post('/signup', createUser)

router.get('/get', verifyToken, getUser)

router.get('/logout', verifyToken, logoutUser)

module.exports = router
