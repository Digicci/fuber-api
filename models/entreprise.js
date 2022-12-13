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
    num: DataTypes.STRING,
    mail: DataTypes.STRING,
    mdp: DataTypes.STRING,
    code_recup: DataTypes.STRING,
    employer: DataTypes.INTEGER,
    UUID: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'entreprise',
  });
  return entreprise;
};