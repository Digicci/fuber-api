const db = require('../../models/index');
const bcrypt = require('bcryptjs');  // Import bcryptjs
const jwt = require('jsonwebtoken');  // Import jwt
const HOTKEY = "secret"  // Create a secret key

// Create a new driver account with pending status

function createDriver(req, res) {
    const { mail, mdp, nom, prenom, tel, nomCommercial, siret, ville, cp, adresse } = req.body
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
        !adresse
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

module.exports = { createDriver }