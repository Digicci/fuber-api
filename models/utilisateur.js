'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class utilisateur extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  utilisateur.init({
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    mail: DataTypes.STRING,
    mdp: DataTypes.STRING,
    num: DataTypes.STRING,
    adresse: DataTypes.STRING,
    ville: DataTypes.STRING,
    cp: DataTypes.STRING,
    pays: DataTypes.STRING,
    JWT: {
        type: DataTypes.STRING,
        defaultValue: '',
        allowNull: true
    },
    JWT_secret: {
        type: DataTypes.STRING,
        defaultValue: '',
        allowNull: true
    },
    UUID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    code_recup: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.NONE
    },
    stripe_id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.NONE,
        allowNull: true
    },
    stripe_card_id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.NONE,
        allowNull: true
    },
    socket_token: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.NONE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'utilisateur',
    tableName: 'utilisateurs'
  });
  return utilisateur;
};