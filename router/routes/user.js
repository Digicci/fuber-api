const express = require('express');
const router = express.Router();    // Create a router
const { createUser, connectUser, getUser } = require('../../controllers/userController/index');
const checkToken  = require('../../framework/jwtMiddleware');
const csrf = require('csurf');

let csrfProtection = csrf({ cookie: true });

router.post('/login', csrfProtection, connectUser)

router.post('/signup', csrfProtection, createUser)

router.get('/get', csrfProtection, checkToken, getUser)

module.exports = router
