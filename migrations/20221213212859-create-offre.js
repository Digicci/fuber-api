'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('offres', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date_debut: {
        type: Sequelize.DATE,
        allowNull: false
      },
      date_fin: {
        type: Sequelize.DATE,
        allowNull: false
      },
      pourcentage: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      reduction: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      reccurence: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      code_offre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cummulable: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      nom_offre: {
        type: Sequelize.STRING,
        defaultValue: 'Promotion exceptionnelle'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('offres');
  }
};