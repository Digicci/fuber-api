function makeAssociations(sequelize) {
    const {entreprise, offre, course, utilisateur, wallet, vehicule} = sequelize.models

    entreprise.hasMany(offre)
    offre.belongsTo(entreprise)

    utilisateur.hasMany(course)
    entreprise.hasMany(course)
    course.belongsTo(entreprise)
    course.belongsTo(utilisateur)

    entreprise.hasMany(vehicule)
    vehicule.belongsTo(entreprise)

    entreprise.belongsTo(entreprise, {
        as: 'employer',
        foreignKey: {
            name: 'employerId',
            allowNull: true
        }
    })

    utilisateur.hasMany(wallet)
    wallet.belongsTo(utilisateur)
}

module.exports = {makeAssociations}