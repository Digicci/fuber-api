'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class offre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  offre.init({
    date_debut: {
      type: DataTypes.DATE,
      allowNull: false
    },
    date_fin: {
      type: DataTypes.DATE,
      allowNull: false
    },
    pourcentage: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reduction: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    reccurence: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    code_offre: DataTypes.STRING,
    cummulable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    nom_offre: {
      type: DataTypes.STRING,
      defaultValue: "Promotion exceptionnelle"
    }
  }, {
    sequelize,
    modelName: 'offre',
    tableName: 'offres'
  });
  return offre;
};