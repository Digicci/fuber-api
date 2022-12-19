const db = require('../../models/index');

function createUser(req, res) {
    const { email, mdp, nom, prenom, tel } = req.body
    if (email === '' || mdp === '' || nom === '' || prenom === '' || tel === '') {
        res.status(400).send('Bad request.')
    }   else {
        const utilisateur = db['utilisateur']
        utilisateur.findAll({
            attributes: ['mail'],
        }).then((users) => {
            users.forEach((user) => {
                if (user.mail === email) {
                    res.status(400).send('Already exists.')
                }
            })
        })
        utilisateur.create({
            mail : email,
            mdp : mdp,
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
}

module.exports = { createUser }