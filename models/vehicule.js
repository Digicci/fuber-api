'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vehicule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Vehicule.init({
    immatriculation: DataTypes.STRING,
    places: DataTypes.INTEGER,
    type: DataTypes.STRING,
    img_path: DataTypes.STRING,
    model: DataTypes.STRING,
    marque: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'vehicule',
  });
  return Vehicule;
};