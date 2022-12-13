'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('utilisateurs', {
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
      mail: {
        type: Sequelize.STRING
      },
      mdp: {
        type: Sequelize.STRING
      },
      num: {
        type: Sequelize.STRING
      },
      adresse: {
        type: Sequelize.STRING
      },
      ville: {
        type: Sequelize.STRING
      },
      cp: {
        type: Sequelize.STRING
      },
      pays: {
        type: Sequelize.STRING
      },
      UUID: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      code_recup: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('utilisateurs');
  }
};