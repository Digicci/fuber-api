function makeAssociations(sequelize) {
    const {entreprise, offre, course, utilisateur, wallet} = sequelize.models

    entreprise.hasMany(offre)
    offre.belongsTo(entreprise)

    utilisateur.hasMany(course)
    entreprise.hasMany(course)
    course.belongsTo(entreprise)
    course.belongsTo(utilisateur)

    utilisateur.hasMany(wallet)
    wallet.belongsTo(utilisateur)
}

module.exports = {makeAssociations}