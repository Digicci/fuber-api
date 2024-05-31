const db = require('../../models/index');
const bcrypt = require('bcryptjs');  // Import bcryptjs
const jwt = require('jsonwebtoken');  // Import jwt
const HOTKEY = "secret"  // Create a secret key
const stripe = require("stripe")("sk_test_51MP9laGtIjyGGRoGbOoWLpkX4ypXVOrM34hqC0gUpBUTmcZcEUcB4nVEWc4SPRgYMm0AVs6kH52fwiskGYJAWuUh00GvV6vzsp")
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
                            const token = jwt.sign({id: userDB.id, nom: userDB.nom}, process.env.JWT_SECRET, {expiresIn: '24h', algorithm: 'HS256'})
                            const refreshToken = jwt.sign({id: userDB.id, nom: userDB.nom}, process.env.JWT_REFRESH_SECRET, {expiresIn: '7d', algorithm: 'HS256'})

                            // Todo : Envoyer le refresh token au client et mettre a jour le client pour qu'il le garde en mémoire
                            res.status(200).send({refreshToken, token, user: userToSend(userDB)})
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
                            const token = jwt.sign({id: userDB.id, nom: userDB.nom}, process.env.JWT_SECRET, {expiresIn: '24h', algorithm: 'HS256'})
                            const refreshToken = jwt.sign({id: userDB.id, nom: userDB.nom}, process.env.JWT_REFRESH_SECRET, {expiresIn: '7d', algorithm: 'HS256'})
                            

                            res.status(200).send({refreshToken, token, user: userToSend(userDB)})
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

function refreshToken(req,res) {
    
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, {algorithm: 'HS256'},(err, decoded) => {
        if (err || decoded === null || decoded === undefined) {
            return res.status(401).send('Unauthorized')
        }
        req.user = decoded
        console.log('jwt middleware',decoded)
    })
    db["utilisateur"].findByPk(req.user.id).then((user) => {
        if(!user) {
            return res.status(401).send('Unauthorized')
        }
        const token = jwt.sign({id:req.user.id, mail: req.user.mail}, process.env.JWT_SECRET, {expiresIn: '24h'})
        res.status(200).send({token})
    })
    
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
    ).catch(e => {
        return res.status(500).send('Internal server error')
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

module.exports = { createUser, connectUser, getUser, logoutUser, updateUser, refreshToken }