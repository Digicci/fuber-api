'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('entreprises', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nom: {
        type: Sequelize.STRING
      },
      prenom: {
        type: Sequelize.STRING
      },
      nom_commercial: {
        type: Sequelize.STRING
      },
      siret: {
        type: Sequelize.STRING
      },
      tva: {
        type: Sequelize.FLOAT
      },
      adresse: {
        type: Sequelize.STRING
      },
      num: {
        type: Sequelize.STRING
      },
      mail: {
        type: Sequelize.STRING
      },
      mdp: {
        type: Sequelize.STRING
      },
      code_recup: {
        type: Sequelize.STRING
      },
      employer: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true
      },
      UUID: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
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
    await queryInterface.dropTable('entreprises');
  }
};