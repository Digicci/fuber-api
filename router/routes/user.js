const express = require('express');
const router = express.Router();    // Create a router
const { createUser, connectUser, getUser } = require('../../controllers/userController/index');
const checkToken  = require('../../framework/jwtMiddleware');


router.post('/login', connectUser)

router.post('/signup', createUser)

router.get('/get', checkToken, getUser)

module.exports = router
