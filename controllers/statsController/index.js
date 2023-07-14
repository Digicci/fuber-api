const db = require('../../models/index');
const {contentDisposition} = require("express/lib/utils");

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

module.exports = { getCA };