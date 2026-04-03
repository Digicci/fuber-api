function makeAssociations(sequelize) {
    const {
        entreprise,
        offre,
        course,
        utilisateur,
        vehicule,
        User_notification
    } = sequelize.models


    utilisateur.hasMany(course)
    entreprise.hasMany(course)
    course.belongsTo(utilisateur)
    course.belongsTo(entreprise)
    utilisateur.hasMany(User_notification)
    User_notification.belongsTo(utilisateur)
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