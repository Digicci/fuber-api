const db = require('../../models/index');
const bcrypt = require('bcryptjs');  // Import bcryptjs
const jwt = require('jsonwebtoken');  // Import jwt
const HOTKEY = "secret"  // Create a secret key

function createUser(req, res) {
    const { email, mdp, nom, prenom, tel } = req.body
    if (!email || !mdp || !nom || !prenom || !tel) {
        res.status(400).send('Bad request.')
    } else {
        const salt = bcrypt.genSaltSync(10)  // Generate a salt
        const hash = bcrypt.hashSync(mdp, salt)  // Hash the password
        const utilisateur = db['utilisateur']
        utilisateur.findOne({
            where: {
                mail: email
            }
        }).then(
            (user) => {
                if (user) {
                    res.status(400).send('User already exists.')
                } else {
                    utilisateur.create({
                        mail: email,
                        mdp: hash,
                        nom: nom,
                        prenom: prenom,
                        num: tel,
                        adresse: null,
                        ville: null,
                        cp: null,
                        pays: null,
                        code_recup: null,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }).then((user) => {
                        if (user) {
                            res.status(201).send('true')
                        } else {
                            res.status(400).send('false')
                        }
                    }).catch((err) => {
                        res.status(400).send('Bad request.' + err)
                    })
                }
            }
        )
    }

}

function connectUser(req, res) {
    const { email, tel, mdp } = req.body
    if(!email && (tel && mdp))
    {
        const utilisateur = db['utilisateur']
        utilisateur.findOne({
            where: {
                num: tel
            }
        }).then(
            (userDB) => {
                if (userDB) {
                    bcrypt.compare(mdp, userDB.mdp, function (err, result) {
                        if (result) {
                            const token = jwt.sign({id: userDB.id, nom: userDB.nom}, HOTKEY, {expiresIn: '1h'}, {algorithm: 'HS256'})

                            userDB.update({
                                JWT: token,
                                JWT_secret: HOTKEY
                            })
                            res.status(200).send({token, user: userToSend(userDB)})
                        } else {
                            res.status(401).send('password incorrect')
                        }
                    })
                } else {
                    res.status(401).send('identifiant incorrect')
                }
            }
        )
    }
    else if(!tel && (email && mdp)){
        const utilisateur = db['utilisateur']
        utilisateur.findOne({
            where: {
                mail: email
            }
        }).then(
            (userDB) => {
                if (userDB) {
                    bcrypt.compare(mdp, userDB.mdp, function (err, result) {
                        if (result) {
                            const token = jwt.sign(
                                {id: userDB.id, nom: userDB.nom},
                                HOTKEY, {expiresIn: '1h'},
                                {algorithm: 'HS256'}
                            )

                            userDB.update({
                                JWT: token,
                                JWT_secret: HOTKEY
                            })

                            res.status(200).send({token, user: userToSend(userDB)})
                        } else {
                            res.status(401).send('password incorrect')
                        }
                    })
                } else {
                    res.status(401).send('identifiant incorrect')
                }
            }
        )
    }
    else{
        res.status(400).send('Merci de saisir un email ou un numéro de téléphone.')
    }
}

function userToSend(user) {
    return {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        mail: user.mail,
        num: user.num,
        adresse: user.adresse,
        ville: user.ville,
        cp: user.cp,
        pays: user.pays,
        UUID: user.UUID,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
}

function getUser(req, res) {
    const utilisateur = db['utilisateur']
    utilisateur.findOne({
        where: {
            id: req.user.id
        }
    }).then(
        (user) => {
            if (user) {
                res.status(200).send(user)
            } else {
                res.status(400).send('Bad request.')
            }
        }
    )
}

function logoutUser(req, res) {
    const utilisateur = db['utilisateur']
    utilisateur.findOne({
        where: {
            id: req.user.id
        }
    }).then(
        (user) => {
            if (user) {
                user.update({
                    JWT: null,
                    JWT_secret: null
                })
                res.status(200).send('true')
            } else {
                res.status(400).send('Bad request.')
            }
        }
    )
}

module.exports = { createUser, connectUser, getUser, logoutUser }