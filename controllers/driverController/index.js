const db = require('../../models/index');
const bcrypt = require('bcryptjs');  // Import bcryptjs
const jwt = require('jsonwebtoken');  // Import jwt
const HOTKEY = "secret"  // Create a secret key

// Create a new driver account with pending status

function createDriver(req, res) {
    const {mail, mdp, nom, prenom, tel, nomCommercial, siret, ville, cp, adresse, staff} = req.body
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
    }).then((dbDriver) => {
        if (dbDriver) {
            res.status(400).send('Driver already exists.')
        } else {
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
    const {mail, mdp} = req.body
    if (!mail || !mdp) {
        res.status(400).send('Bad request.')
    }
    const driver = db['entreprise']
    driver.findOne({
        where: {
            mail: mail
        },
        include: [
            {
                model: db['entreprise'],
                as: 'employes',
                include: [
                    'vehicule'
                ]
            },
            'vehicule'
        ]
    }).then((dbDriver) => {
        if (dbDriver) {
            const valid = bcrypt.compareSync(mdp, dbDriver.mdp)
            if (valid) {
                const token = jwt.sign({id: dbDriver.id}, HOTKEY, {algorithm: 'HS256'}, {expiresIn: '24h'})
                res.status(200).send({auth: true, token: token, driver: dbDriver})
            } else {
                res.status(401).send({auth: false, token: null, message: 'Invalid connexion informations'})
            }
        } else {
            res.status(404).send('Driver not found.')
        }
    })
}

function getEntreprise(req, res) {
    const utilisateur = db['entreprise']
    if (req.user) {
        utilisateur.findOne({
            where: {
                id: req.user.id
            },
            include: [
                {
                    model: db['entreprise'],
                    as: 'employes',
                    include: [
                        'vehicule'
                    ]
                },
                'vehicule'
            ]
        }).then(
            (user) => {
                if (user) {
                    res.status(200).send(user)
                } else {
                    res.status(400).send('Bad request.')
                }
            }
        )
    } else {
        res.status(400).send('Bad request.')
    }
}

function getTeam(req, res) {
    const utilisateur = db['entreprise']
    if (req.user) {
        utilisateur.findAll({
            where: {
                employerId: req.user.id
            },
            include: [
                'vehicule',
                'courses'
            ]
        }).then(
            (users) => {
                if (users) {
                    res.status(200).send(users)
                } else {
                    res.status(400).send('Bad request.')
                }
            }
        )
    } else {
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

function addEmployee(req, res) {
    const {adresse, cp, mail, mdp, nom, prenom, tel, ville, immatriculation, marque, modele, place, car} = req.body;
    if (
        !adresse ||
        !cp ||
        !mail ||
        !mdp ||
        !nom ||
        !prenom ||
        !tel ||
        !ville ||
        !immatriculation ||
        !marque ||
        !modele ||
        !place ||
        !car
    ) {
        res.status(400).send('Bad request.')
    }

    const salt = bcrypt.genSaltSync(10)  // Generate a salt
    const hash = bcrypt.hashSync(mdp, salt)  // Hash the password
    const driver = db['entreprise']
    const vehicule = db['vehicule']
    driver.findOne({
        where: {
            mail: mail
        }
    }).then((dbDriver) => {
        if (dbDriver) {
            res.status(400).send('Driver already exists.')
        } else {
            driver.create({
                mail: mail,
                mdp: hash,
                nom: nom,
                prenom: prenom,
                num: tel,
                adresse: adresse,
                ville: ville,
                cp: cp,
                employerId: req.user.id,
                statut: 'confirmed',
                code_recup: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }).then((dbDriver) => {
                if (dbDriver) {
                    vehicule.create({
                        immatriculation: immatriculation,
                        marque: marque,
                        model: modele,
                        places: place,
                        type: car,
                        entrepriseId: dbDriver.id,
                    }).then((dbVehicule) => {
                        db['entreprise'].update({staff: 1}, {where: {id: req.user.id}}).then(() => {
                            res.status(201).send('true')
                        })
                    })
                } else {
                    res.status(400).send('false')
                }
            }).catch((err) => {
                res.status(400).send('Bad request.' + err)
            })
        }
    })
}

function getDriverByNearest(req, res) {
    const {lat, lng} = req.body
    if (!lat || !lng) {
        res.status(400).send('Bad request.')

    }
    const calc = `6371 * acos(cos(radians(${lat})) * cos(radians(lat)) * cos(radians(lng) - radians(${lng})) + sin(radians(${lat})) * sin(radians(lat)))`

    db.sequelize.query(`
                SELECT entreprises.id,
                       img_path,
                       places,
                       prix,
                       model,
                       marque,
                       commission,
                       ${calc} AS distance
                FROM entreprises
                         INNER JOIN vehicules
                                    ON vehicules.entrepriseId = entreprises.id
                HAVING distance < 20
                   AND socket_token != false
                ORDER BY distance ASC`,
        {type: db.sequelize.QueryTypes.SELECT}
    ).then((drivers) => {
        res.status(200).send(drivers)
    })
}

function updateDriver(req, res) {
    const {nom, prenom, num} = req.body
    if (!nom || !prenom || !num) {
        res.status(400).send('Bad request.')
    }

    const entreprise = db['entreprise']
    const id = req.user.id
    entreprise.findByPk(id).then((driver) => {
        driver.update({
            nom: nom,
            prenom: prenom,
            num: num
        }).then((driver) => {
            if (
                driver.nom === nom
                && driver.prenom === prenom
                && driver.num === num
            ) {
                res.status(200).send({
                    nom: driver.nom,
                    prenom: driver.prenom,
                    num: driver.num
                })
            }
        }).catch((err) => {
            res.status(401).send(`an error occured : ${err}`)
        })
    })
}

module.exports = {
    createDriver,
    login,
    getEntreprise,
    logout,
    addEmployee,
    getDriverByNearest,
    getTeam,
    updateDriver
}