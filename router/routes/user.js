const express = require('express');
const router = express.Router();    // Create a router
const { createUser, connectUser, getUser, logoutUser, updateUser} = require('../../controllers/userController/index');
const { addCardIntent, getCards, saveIntent, setDefault, getDefault,  deleteCard } = require('../../controllers/cardController/index')
const verifyToken  = require('../../framework/jwtMiddleware');


router.post('/login', connectUser)

router.post('/signup', createUser)

router.get('/get', verifyToken, getUser)

router.get('/logout', logoutUser)

router.get('/addCardIntent', verifyToken, addCardIntent)

router.get('/saveCardIntent', verifyToken, saveIntent)

router.post('/card/delete', verifyToken, deleteCard)

router.get('/cards', verifyToken, getCards)

router.post('/setDefault', verifyToken, setDefault)

router.get('/getDefault', verifyToken, getDefault)

router.put('/update', verifyToken, updateUser)

module.exports = router
