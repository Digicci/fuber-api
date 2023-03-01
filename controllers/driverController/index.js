const db = require('../../models/index');
const bcrypt = require('bcryptjs');  // Import bcryptjs
const jwt = require('jsonwebtoken');  // Import jwt
const HOTKEY = "secret"  // Create a secret key

// Create a new driver account with pending status

function createDriver(req, res) {
    const { mail, mdp, nom, prenom, tel, nomCommercial, siret, ville, cp, adresse, staff } = req.body
    if (
        !mail ||
        !mdp ||
        !nom ||
        !prenom ||
        !tel ||
        !nomCommercial ||
        !siret ||
        !ville ||
        !cp ||
        !adresse ||
        !staff
    ) {
        res.status(400).send('Bad request.')
    }

    const salt = bcrypt.genSaltSync(10)  // Generate a salt
    const hash = bcrypt.hashSync(mdp, salt)  // Hash the password
    const driver = db['entreprise']
    driver.findOne({
        where: {
            mail: mail
        }
    }).then((dbDriver) =>{
        if(dbDriver){
            res.status(400).send('Driver already exists.')
        }else{
            driver.create({
                mail: mail,
                mdp: hash,
                nom: nom,
                prenom: prenom,
                num: tel,
                nom_commercial: nomCommercial,
                siret: siret,
                adresse: adresse,
                ville: ville,
                cp: cp,
                staff: staff,
                pays: 'France',
                statut: 'pending',
                code_recup: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }).then((dbDriver) => {
                if (dbDriver) {
                    res.status(201).send('true')
                } else {
                    res.status(400).send('false')
                }
            }).catch((err) => {
                res.status(400).send('Bad request.' + err)
            })
        }
    })
}

function login(req, res) {
    const { mail, mdp } = req.body
    if (!mail || !mdp) {
        res.status(400).send('Bad request.')
    }
    const driver = db['entreprise']
    driver.findOne({
        where: {
            mail: mail
        }
    }).then((dbDriver) => {
        if (dbDriver) {
            const valid = bcrypt.compareSync(mdp, dbDriver.mdp)
            if (valid) {
                const token = jwt.sign({ id: dbDriver.id }, HOTKEY, {algorithm: 'HS256'}, { expiresIn: '24h' })
                res.status(200).send({ auth: true, token: token, driver: dbDriver })
            } else {
                res.status(401).send({ auth: false, token: null, message: 'Invalid connexion informations' })
            }
        } else {
            res.status(404).send('Driver not found.')
        }
    })
}

function getEntreprise(req, res) {
    const utilisateur = db['entreprise']
    if(req.user){
        utilisateur.findOne({
            where: {
                id: req.user.id
            }
        }).then(
            (user) => {
                if (user) {
                    res.status(200).send(driverToSend(user))
                } else {
                    res.status(400).send('Bad request.')
                }
            }
        )
    }
    else {
        res.status(400).send('Bad request.')
    }
}

function logout(req, res) {
    const utilisateur = db['entreprise']
    utilisateur.findOne({
        where: {
            id: req.user.id
        }
    }).then(
        (user) => {
            if (user) {
                res.status(200).send('true')
            } else {
                res.status(400).send('Bad request.')
            }
        }
    )
}

function driverToSend(driver) {
    return {
        id: driver.id,
        nom: driver.nom,
        prenom: driver.prenom,
        nom_commercial: driver.nom_commercial,
        siret: driver.siret,
        tva: driver.tva,
        adresse: driver.adresse,
        cp: driver.cp,
        ville: driver.ville,
        num: driver.num,
        mail: driver.mail,
        statut: driver.statut,
        code_recup: driver.code_recup,
        employer: driver.employer,
        staff: driver.staff,
        UUID: driver.UUID
    }
}

module.exports = { createDriver, login, getEntreprise, logout }