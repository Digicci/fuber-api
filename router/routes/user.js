const express = require('express');
const router = express.Router();    // Create a router

router.post('/login', function (req, res) {
    const { email, password } = req.body
    if (email === '' || password === '') {
        res.status(400).send('Bad request.')
    }   else {
        const response = {
            requestType : 'POST',
            email : email,
            password : password,
            path: req.path
        }
        res.send(response)
    }
})

router.get('/login', function (req, res) {
    const { email, password } = req.body
    if (email === '' || password === '') {
        res.status(400).send('Bad request.')
    }   else {
        const response = {
            requestType : 'GET',
            email : email,
            password : password,
            path: req.path
        }
        res.send(response)
    }
})

router.post('/signup', function (req, res) {
    const { email, password } = req.body
    if (email === '' || password === '') {
        res.status(400).send('Bad request.')
    }   else {
        const response = {
            requestType : 'POST',
            email : email,
            password : password,
            path : req.path
        }
        res.send(response)
    }
})

module.exports = router
