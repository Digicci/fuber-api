const express = require('express');
const router = express.Router();    // Create a router
const { createUser, connectUser, getUser, logoutUser, updateUser} = require('../../controllers/userController/index');
const { addCard } = require('../../controllers/cardController/index')
const verifyToken  = require('../../framework/jwtMiddleware');


router.post('/login', connectUser)

router.post('/signup', createUser)

router.get('/get', verifyToken, getUser)

router.get('/logout', verifyToken, logoutUser)

router.post('/addCard', verifyToken, addCard)

router.put('/update', verifyToken, updateUser)

module.exports = router
