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
    prix: DataTypes.FLOAT,
    heure_depart_estime: DataTypes.DATE,
    heure_arriver_estime: DataTypes.DATE,
    adresse_depart: DataTypes.STRING,
    adresse_arrive: DataTypes.STRING,
    heure_depart_reel: DataTypes.DATE,
    heure_arrive_reel: DataTypes.DATE,
    terminer: DataTypes.BOOLEAN,
    note: DataTypes.FLOAT,
    commentaire: DataTypes.STRING,
    date_course: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'course',
  });
  return course;
};