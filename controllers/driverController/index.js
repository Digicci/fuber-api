const db = require('../../models/index');
const bcrypt = require('bcryptjs');  // Import bcryptjs
const jwt = require('jsonwebtoken');  // Import jwt
const dotenv = require('dotenv');

dotenv.config()

//Clean driver info before sending it to the client

function cleanDriver(driver) {
    const {
        nom,
        prenom,
        num,
        mail,
        nom_commercial,
        siret,
        adresse,
        ville,
        cp,
        pays,
        staff,
        statut,
        employes,
        vehicule,
        id,
        courses,
        prix
    } = driver
    return {
        nom: nom,
        prenom: prenom,
        num: num,
        mail: mail,
        nom_commercial: nom_commercial,
        siret: siret,
        adresse: adresse,
        ville: ville,
        cp: cp,
        pays: pays,
        staff: staff,
        statut: statut,
        employes: employes,
        vehicule: vehicule,
        id: id,
        courses,
        prix
    }
}

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
                    'vehicule',
                    {
                        model: db['course'],
                        as: 'courses',
                        include: [
                            {
                                model: db['utilisateur'],
                                as: 'utilisateur',
                                attributes: {
                                    exclude: [
                                        'mdp',
                                        'code_recup',
                                        'JWT',
                                        'stripe_id',
                                        'JWT_secret',
                                        'UUID'
                                    ]
                                }
                            }
                        ]
                    }
                ]
            },
            'vehicule',
            {
                model: db['course'],
                as: 'courses',
                include: [
                    {
                        model: db['utilisateur'],
                        as: 'utilisateur',
                        attributes: {
                            exclude: [
                                'mdp',
                                'code_recup',
                                'JWT',
                                'stripe_id',
                                'JWT_secret',
                                'UUID'
                            ]
                        }
                    }
                ]
            }
        ]
    }).then((dbDriver) => {
        if (dbDriver) {
            console.log(dbDriver.courses)
            const valid = bcrypt.compareSync(mdp, dbDriver.mdp)
            if (valid) {
                const token = jwt.sign({id: dbDriver.id}, process.env.JWT_SECRET, {algorithm: 'HS256', expiresIn: '24h'})
                res.status(200).send({auth: true, token: token, driver: cleanDriver(dbDriver)})
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
                    attributes: {
                      exclude: [
                          'mdp',
                          'code_recup'
                      ]
                    },
                    include: [
                        'vehicule',
                        {
                            model: db['course'],
                            as: 'courses',
                            include: [
                                {
                                    model: db['utilisateur'],
                                    as: 'utilisateur',
                                    attributes: {
                                        exclude: [
                                            'mdp',
                                            'code_recup',
                                            'JWT',
                                            'stripe_id',
                                            'JWT_secret',
                                            'UUID'
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                },
                'vehicule',
                {
                    model: db['course'],
                    as: "courses",
                    include: [
                        {
                            model: db['utilisateur'],
                            as: 'utilisateur',
                            attributes: {
                                exclude: [
                                    'mdp',
                                    'code_recup',
                                    'JWT',
                                    'stripe_id',
                                    'JWT_secret',
                                    'UUID'
                                ]
                            }
                        }
                    ]
                }
            ]
        }).then(
            (user) => {
                if (user) {
                    res.status(200).send(cleanDriver(user))
                } else {
                    res.status(400).send('Bad request.')
                }
            }
        )
    } else {
        res.status(400).send('Bad request.')
    }
}

function getRaces(req, res) {
    const course = db["course"]
    course.findAll({
        where: {
            entrepriseId: req.user.id
        },
        include: [
            {
                model: db['utilisateur'],
                as: 'utilisateur',
                attributes: {
                    exclude: [
                        'mdp',
                        'code_recup',
                        'JWT',
                        'stripe_id',
                        'JWT_secret',
                        'UUID'
                    ]
                }
            }
        ]
    }).then((courses) => {
        if(courses.length) {
            return res.status(200).send(courses)
        }
        else {
            return res.status(200).send([])
        }
    }).catch((e) => {
        return res.status(500).send(`Internal server error : ${e.message}`)
    })
}

function getTeam(req, res) {
    const utilisateur = db['entreprise']
    if (req.user) {
        utilisateur.findAll({
            where: {
                employerId: req.user.id
            },
            attributes: {
                exclude: [
                    'mdp',
                    'code_recup'
                ]
            },
            include: [
                'vehicule',
                {
                    model: db['course'],
                    as: 'courses',
                    include: [
                        {
                            model: db['utilisateur'],
                            as: 'utilisateur',
                            attributes: {
                                exclude: [
                                    'mdp',
                                    'code_recup',
                                    'JWT',
                                    'stripe_id',
                                    'JWT_secret',
                                    'UUID'
                                ]
                            }
                        }
                    ]
                }
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

function addEmployee(req, res) {
    const { adresse, cp, mail, mdp, nom, prenom, tel, ville, immatriculation, marque, modele, place, car, prix } = req.body;

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
        return res.status(400).send('Bad request.');
    }

    const salt = bcrypt.genSaltSync(10); // Generate a salt
    const hash = bcrypt.hashSync(mdp, salt); // Hash the password
    const driver = db['entreprise'];
    const vehicule = db['vehicule'];

    driver.findOne({
        where: { mail: mail }
    }).then((dbDriver) => {
        if (dbDriver) {
            return res.status(400).send('Driver already exists.');
        } else {
            // Vérifiez si le prix est fourni
            let prixEmploye = prix;

            if (!prixEmploye) {
                // Si le prix n'est pas fourni, récupérez le prix du patron
                driver.findOne({
                    where: { id: req.user.id }
                }).then((dbPatron) => {
                    if (dbPatron) {
                        prixEmploye = dbPatron.prix; // Remplacez 'prix' par le champ correct du prix du patron

                        createEmployeeAndVehicle(prixEmploye);
                    } else {
                        return res.status(400).send('Patron not found.');
                    }
                }).catch((err) => {
                    return res.status(400).send('Error fetching patron price.' + err);
                });
            } else {
                createEmployeeAndVehicle(prixEmploye);
            }
        }
    }).catch((err) => {
        return res.status(400).send('Error checking driver.' + err);
    });

    function createEmployeeAndVehicle(prixEmploye) {
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
            updatedAt: new Date(),
            prix: prixEmploye // Utilisation du prix fourni ou celui du patron
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
                    db['entreprise'].update({ staff: db.Sequelize.literal('staff + 1') }, { where: { id: req.user.id } }).then(() => {
                        return res.status(201).send('true');
                    }).catch((err) => {
                        return res.status(400).send('Error updating staff count.' + err);
                    });
                }).catch((err) => {
                    return res.status(400).send('Error creating vehicle.' + err);
                });
            } else {
                return res.status(400).send('false');
            }
        }).catch((err) => {
            return res.status(400).send('Bad request.' + err);
        });
    }
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
                       ${calc} AS distance,
                       socket_token,
                       nom,
                       prenom,
                       vehicules.*
                FROM entreprises
                         INNER JOIN vehicules
                                    ON vehicules.entrepriseId = entreprises.id
                HAVING distance < 40
                   AND socket_token IS NOT NULL
                ORDER BY distance ASC`,
        {type: db.sequelize.QueryTypes.SELECT}
    ).then((drivers) => {
        res.status(200).send(drivers)
    })
}

function updateDriverLocation(driverId, location) {
    const entreprise = db['entreprise'];
    return entreprise.findByPk(driverId).then((driver) => {
        if (driver) {
            return driver.update({'lat': location.lat, 'lng': location.lng})
                .then(() => {
                    return true
                })
                .catch((err) => {
                    console.log(err)
                    return false
                })
        }
        return false
    })
}

function updateDriver(req, res) {
    const {nom, prenom, num, prix} = req.body
    if (!nom || !prenom || !num || !prix) {
        res.status(400).send('Bad request.')
    }

    const entreprise = db['entreprise']
    const id = req.user.id
    entreprise.findByPk(id).then((driver) => {
        driver.update({
            nom: nom,
            prenom: prenom,
            num: num,
            prix: prix
        }).then((driver) => {
            if (
                driver.nom === nom
                && driver.prenom === prenom
                && driver.num === num
                && driver.prix === prix
            ) {
                res.status(200).send({
                    nom: driver.nom,
                    prenom: driver.prenom,
                    num: driver.num,
                    prix: driver.prix
                })
            }
        }).catch((err) => {
            res.status(401).send(`an error occured : ${err}`)
        })
    })
}

function setIsOnline(id, socket_id = null) {
    const entreprise = db['entreprise'];
    return entreprise.findByPk(id).then((driver) => {
        return driver.update({'socket_token': socket_id}).then(() => {
            return socket_id !== null
        })
    }).catch((err) => {
        console.log(err)
        return false
    })
}

function addVehiculeToSelf(req, res) {
    const {
        marque,
        immatriculation,
        modele,
        places,
        car
    } = req.body;

    if (!marque || !immatriculation || !modele || !places || !car) {
        res.status(400).send('Malformed request.')
    }
    const {id} = req.user
    const vehicule = db['vehicule'];

    vehicule.create({
        immatriculation,
        places,
        type: car,
        model: modele,
        marque,
        img_path: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        entrepriseId: id
    }).then((newVehicule) => {
        if (newVehicule) {
            res.status(200).send(true)
        } else {
            res.status(400).send(false)
        }
    }).catch((e) => {
        res.status(400).send(e)
    })
}


function getDriverSocketTokenById(driverId) {
    const entreprise = db['entreprise'];
    return entreprise.findByPk(driverId).then((driver) => {
        if(driver) {
            console.log('driver found');
            return driver.socket_token ? driver.socket_token : null
        } else {
            console.log('driver not found');
            return null
        }
    })
}


module.exports = {
    createDriver,
    login,
    getEntreprise,
    getRaces,
    addEmployee,
    getDriverByNearest,
    getTeam,
    updateDriver,
    addVehiculeToSelf,
    setIsOnline,
    updateDriverLocation,
    getDriverSocketTokenById
}