const db = require('../../models/index');
const bcrypt = require('bcryptjs');  // Import bcryptjs
const jwt = require('jsonwebtoken');  // Import jwt
const HOTKEY = "secret"  // Create a secret key
const stripe = require("stripe")("sk_test_51MP9laGtIjyGGRoGbOoWLpkX4ypXVOrM34hqC0gUpBUTmcZcEUcB4nVEWc4SPRgYMm0AVs6kH52fwiskGYJAWuUh00GvV6vzsp")
const crypto = require('crypto')
const {createCustomer} = require('../cardController/index')
const dotenv = require('dotenv')
dotenv.config()

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
            async (user) => {
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
                        stripe_id: await createCustomer(),
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

function updateUser(req, res) {
    const {mail, nom, num, prenom} = req.body
    const id = req.user.id

    if (id) {
        const utilisateur = db['utilisateur']
        utilisateur.findByPk(id).then((user) => {
            if(mail) {
                user.mail = mail
            }
            if(nom) {
                user.nom = nom
            }
            if(num) {
                user.num = num
            }
            if(prenom) {
                user.prenom = prenom
            }
            const token = jwt.sign({id: user.id, nom: user.nom}, process.env.JWT_SECRET, {expiresIn: '1h'})
            user.JWT = token
            user.JWT_secret = HOTKEY
            user.save().then((user) => {
                res.status(200).send({token, user: userToSend(user)}) // Send the token and the user
            }).catch((err) => {
                res.status(400).send('Bad request.' + err)
            })
        }).catch((err) => {
            res.status(400).send('Bad request.' + err)
        })
    }
    else {
        res.status(400).send('Bad request.')
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
                            const token = jwt.sign({id: userDB.id, nom: userDB.nom}, process.env.JWT_SECRET, {expiresIn: '24h'}, {algorithm: 'HS256'})

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
                                HOTKEY, {expiresIn: '24h'},
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

function getUser(req, res) {
    const utilisateur = db['utilisateur']
    utilisateur.findOne({
        where: {
            id: req.user.id
        }
    }).then(
        (user) => {
            if (user) {
                res.status(200).send(userToSend(user))
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

function requestPasswordReset(req, res) {
    const { email } = req.body
    if (!email) {
        res.status(400).send('Bad request.')
        return
    }

    const utilisateur = db['utilisateur']
    const token = crypto.randomBytes(20).toString('hex')
    const ttlMinutes = parseInt(process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES || '30', 10)
    const expiresAt = Date.now() + ttlMinutes * 60 * 1000

    utilisateur.findOne({
        where: {
            mail: email
        }
    }).then((user) => {
        if (!user) {
            res.status(200).send({ requested: true })
            return
        }
        user.update({
            code_recup: JSON.stringify({ token, expiresAt })
        }).then(() => {
            const response = { requested: true }
            if (process.env.PASSWORD_RESET_DEBUG === 'true') {
                response.token = token
            }
            res.status(200).send(response)
        }).catch((err) => {
            res.status(400).send('Bad request.' + err)
        })
    }).catch((err) => {
        res.status(400).send('Bad request.' + err)
    })
}

function verifyPasswordResetToken(req, res) {
    const { email, token } = req.query
    if (!email || !token) {
        res.status(400).send('Bad request.')
        return
    }

    const utilisateur = db['utilisateur']
    utilisateur.findOne({
        where: {
            mail: email
        }
    }).then((user) => {
        if (!user || !user.code_recup) {
            res.status(400).send({ valid: false })
            return
        }
        let storedToken = user.code_recup
        let expiresAt = null
        try {
            const parsed = JSON.parse(user.code_recup)
            if (parsed && parsed.token) {
                storedToken = parsed.token
                expiresAt = parsed.expiresAt ?? null
            }
        } catch (error) {
            storedToken = user.code_recup
        }
        if (storedToken !== token) {
            res.status(400).send({ valid: false })
            return
        }
        if (expiresAt && Date.now() > expiresAt) {
            res.status(400).send({ valid: false })
            return
        }
        res.status(200).send({ valid: true })
    }).catch((err) => {
        res.status(400).send('Bad request.' + err)
    })
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

module.exports = {
    createUser,
    connectUser,
    getUser,
    logoutUser,
    updateUser,
    requestPasswordReset,
    verifyPasswordResetToken
}
