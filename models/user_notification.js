'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_notification.init({
    message: DataTypes.STRING,
    titre: DataTypes.STRING,
    type: DataTypes.STRING,
    read: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User_notification',
    tableName: "user_notification"
  });
  return User_notification;
};