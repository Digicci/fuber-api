'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  course.init({
    total: DataTypes.FLOAT,
    promoId: {
        type: DataTypes.INTEGER,
        defaultValue: null,
        allowNull: true
    },
    start: DataTypes.STRING,
    end: DataTypes.STRING,
    startLat: DataTypes.FLOAT,
    startLng: DataTypes.FLOAT,
    endLat: DataTypes.FLOAT,
    endLng: DataTypes.FLOAT,
    driverPrice: DataTypes.FLOAT,
    commissionPrice: DataTypes.FLOAT,
    validNumber: DataTypes.INTEGER,
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    }
  }, {
    sequelize,
    modelName: 'course',
  });
  return course;
};