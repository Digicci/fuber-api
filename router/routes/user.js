const express = require('express');
const router = express.Router();    // Create a router
const utilisateur = require('../../models/utilisateur');

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
    const { email, mdp, nom, prenom, tel } = req.body
    if (email === '' || mdp === '' || nom === '' || prenom === '' || tel === '') {
        res.status(400).send('Bad request.')
    }   else {
        utilisateur.findAll({
            attributes: ['mail'],
        }).then((users) => {
            users.forEach((user) => {
                if (user.mail === email) {
                    res.status(400).send('Already exists.')
                }
            })
        })
        const user = utilisateur.create({
            email : email,
            password : mdp,
            nom : nom,
            prenom : prenom,
            num : tel,
            adresse : '',
            ville : '',
            cp : '',
            pays : '',
            code_recup : '',
            createdAt : new Date(),
            updatedAt : new Date()
        }).then((user) => {
            if (user) {
                res.status(201).send('true')
            }  else {
                res.status(400).send('false')
            }
        })
    }
})

module.exports = router
