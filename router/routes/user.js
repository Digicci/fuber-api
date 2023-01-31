const express = require('express');
const router = express.Router();    // Create a router
const { createUser, connectUser, getUser, logoutUser, updateUser} = require('../../controllers/userController/index');
const { addCardIntent, getCards, saveIntent } = require('../../controllers/cardController/index')
const verifyToken  = require('../../framework/jwtMiddleware');


router.post('/login', connectUser)

router.post('/signup', createUser)

router.get('/get', verifyToken, getUser)

router.get('/logout', logoutUser)

router.get('/addCardIntent', verifyToken, addCardIntent)

router.get('/saveCardIntent', verifyToken, saveIntent)

router.get('/cards', verifyToken, getCards)

router.put('/update', verifyToken, updateUser)

module.exports = router
