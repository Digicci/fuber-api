const db = require('../../models/index');
const {contentDisposition} = require("express/lib/utils");
const moment = require("moment");

//Recuperation du chiffre d'affaire total depuis inscription
function getCA(req, res) {
    //Recuperation du model entreprise
    const driver = db['entreprise'];
    //Recuperation du model course
    const course = db['course'];
    //Recuperation de l'id de l'utilisateur connecté
    const id = req.user.id;
    //Recherche de l'utilisateur connecté
    driver.findOne({
        where: {
            id: id
        },
        //Inclusion des courses de l'utilisateur
        include: [
            {
                model: course,
                as: 'courses',
                where: {
                    state: "done"
                }
            },
            //Inclusion des employés de l'utilisateur
            {
                model: db['entreprise'],
                as: 'employes',
                //Inclusion des courses des employés de l'utilisateur
                include: [
                    {
                        model: course,
                        as: 'courses',
                        where: {
                            state: "done"
                        }
                    }
                ]
            },
        ]
    }).then(
        //Si l'utilisateur est trouvé
        (driver) => {
            if (driver) {
                //Initialisation du chiffre d'affaires à 0
                let ca = 0;
                //Ajout du prix de chaque course de l'utilisateur au chiffre d'affaires
                driver.courses.forEach(course => {
                    ca += course.driverPrice;
                });
                //Ajout du prix de chaque course des employés de l'utilisateur au chiffre d'affaires
                driver.employes.forEach(employe => {
                    employe.courses.forEach(course => {
                        ca += course.driverPrice;
                    });
                });
                //Envoi du chiffre d'affaires
                res.status(200).send({ca});
            } else {
                res.status(400).send('Bad request.');
            }
        }
    )
}

//Recuperation du bénéfice total depuis l'inscription
function getBenefice(req, res) {
    //Recuperation du model entreprise
    const driver = db['entreprise'];
    //Recuperation du model course
    const course = db['course'];
    //Recuperation de l'id de l'utilisateur connecté
    const id = req.user.id;
    //Recherche de l'utilisateur connecté
    driver.findOne({
        where: {
            id: id
        },
        //Inclusion des courses de l'utilisateur
        include: [
            {
                model: course,
                as: 'courses'
            },
            //Inclusion des employés de l'utilisateur
            {
                model: db['entreprise'],
                as: 'employes',
                //Inclusion des courses des employés de l'utilisateur
                include: [
                    {
                        model: course,
                        as: 'courses'
                    }
                ]
            },
        ]
    }).then(
        //Si l'utilisateur est trouvé
        (driver) => {
            if (driver) {
                //Initialisation du chiffre d'affaires à 0
                let total = 0;
                //Ajout du prix de chaque course de l'utilisateur au chiffre d'affaires
                driver.courses.forEach(course => {
                    total += course.driverPrice - course.commissionPrice;
                });
                //Ajout du prix de chaque course des employés de l'utilisateur au chiffre d'affaires
                driver.employes.forEach(employe => {
                    employe.courses.forEach(course => {
                        total += course.driverPrice - course.commissionPrice;
                    });
                });
                //Envoi du chiffre d'affaires
                res.status(200).send({total});
            } else {
                res.status(400).send('Bad request.');
            }
        }
    )
}

//Recuperation du chiffre d'affaire total sur une période donnée (par default : dernier mois)
function getCAByPeriod(req, res) {
    const driver = db['entreprise'];
    const course = db['course'];
    const id = req.user.id;
    const startDate = req.query.startDate || moment().subtract(1, 'months').format('YYYY-MM-DD');
    const endDate = req.query.endDate || moment().format('YYYY-MM-DD');

    driver.findOne({
        where: {
            id: id
        },
        include: [
            {
                model: course,
                as: 'courses',
                where: {
                    createdAt: {
                        [db.Sequelize.Op.between]: [startDate, endDate]
                    }
                }
            },
            {
                model: db['entreprise'],
                as: 'employes',
                include: [
                    {
                        model: course,
                        as: 'courses',
                        where: {
                            createdAt: {
                                [db.Sequelize.Op.between]: [startDate, endDate]
                            }
                        }
                    }
                ]
            }
        ]
    }).then((driver) => {
        if (driver) {
            let total = 0;
            driver.courses.forEach(course => {
                total += course.driverPrice;
            });
            driver.employes.forEach(employe => {
                employe.courses.forEach(course => {
                    total += course.driverPrice;
                });
            });
            res.status(200).send({total});
        }
        return res.status(400).send('Bad request.');
    })
}

//Recuperation du bénéfice total sur une période donnée (par default : dernier mois)
function getBeneficeByPeriod(req, res) {
    const driver = db['entreprise'];
    const course = db['course'];
    const id = req.user.id;
    const startDate = req.query.startDate || moment().subtract(1, 'months').format('YYYY-MM-DD');
    const endDate = req.query.endDate || moment().format('YYYY-MM-DD');

    driver.findOne({
        where: {
            id: id
        },
        include: [
            {
                model: course,
                as: 'courses',
                where: {
                    createdAt: {
                        [db.Sequelize.Op.between]: [startDate, endDate]
                    }
                }
            },
            {
                model: db['entreprise'],
                as: 'employes',
                include: [
                    {
                        model: course,
                        as: 'courses',
                        where: {
                            createdAt: {
                                [db.Sequelize.Op.between]: [startDate, endDate]
                            }
                        }
                    }
                ]
            }
        ]
    }).then((driver) => {
        if (driver) {
            let total = 0;
            driver.courses.forEach(course => {
                total += course.driverPrice - course.commissionPrice;
            });
            driver.employes.forEach(employe => {
                employe.courses.forEach(course => {
                    total += course.driverPrice - course.commissionPrice;
                });
            });
            res.status(200).send({total});
        }
        return res.status(400).send('Bad request.');
    })
}

module.exports = { getCA, getBenefice, getCAByPeriod, getBeneficeByPeriod };