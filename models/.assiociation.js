function makeAssociations(sequelize) {
    const {entreprise, offre, course, utilisateur} = sequelize.models

    entreprise.hasMany(offre)
    offre.belongsTo(entreprise)

    utilisateur.hasMany(course)
    entreprise.hasMany(course)
    course.belongsTo(entreprise)
    course.belongsTo(utilisateur)
}

module.exports = {makeAssociations}