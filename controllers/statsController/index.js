const db = require('../../models/index');

//Recuperation du chiffre d'affaire total depuis inscription
function getCA(req, res) {
    const driver = db['entreprise'];
    const course = db['course'];
    const id = req.user.id;
    driver.findOne({
        where: {
            id: id
        },
        include: [
            {
                model: course,
                as: 'courses'
            }
        ]
    }).then(
        (driver) => {
            if (driver) {
                let ca = 0;
                driver.courses.forEach(course => {
                    ca += course.driverPrice;
                });
                res.status(200).send({ca});
            } else {
                res.status(400).send('Bad request.');
            }
        }
    )
}

module.exports = { getCA };