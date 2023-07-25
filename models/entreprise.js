'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class entreprise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  entreprise.init({
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    nom_commercial: DataTypes.STRING,
    siret: DataTypes.STRING,
    tva: DataTypes.FLOAT,
    adresse: DataTypes.STRING,
    cp: DataTypes.STRING,
    ville: DataTypes.STRING,
    num: DataTypes.STRING,
    mail: DataTypes.STRING,
    mdp: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    prix: DataTypes.FLOAT,
    socket_token: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    commission: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    statut: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
    },
    code_recup: DataTypes.STRING,
    staff: DataTypes.INTEGER,
    UUID: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'entreprise',
  });
  return entreprise;
};