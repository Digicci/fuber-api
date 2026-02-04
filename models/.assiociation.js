function makeAssociations(sequelize) {
    const {entreprise, offre, course, utilisateur, vehicule} = sequelize.models


    utilisateur.hasMany(course)
    entreprise.hasMany(course)
    course.belongsTo(utilisateur)
    course.belongsTo(entreprise)

    entreprise.hasOne(vehicule)
    vehicule.belongsTo(entreprise, {
        as: 'entreprise',
        foreignKey: {
            name: 'entrepriseId',
            allowNull: false
        }
    })

    entreprise.belongsTo(entreprise, {
        as: 'employer',
    })

    entreprise.hasMany(entreprise, {
        as: 'employes',
        foreignKey: {
            name: 'employerId',
            allowNull: true
        }
    })

}

module.exports = {makeAssociations}