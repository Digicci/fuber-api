'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      prix: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      heure_depart_estime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      heure_arriver_estime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      adresse_depart: {
        type: Sequelize.STRING,
        allowNull: false
      },
      adresse_arrive: {
        type: Sequelize.STRING,
        allowNull: false
      },
      heure_depart_reel: {
        type: Sequelize.DATE
      },
      heure_arrive_reel: {
        type: Sequelize.DATE
      },
      terminer: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      note: {
        type: Sequelize.FLOAT
      },
      commentaire: {
        type: Sequelize.STRING
      },
      date_course: {
        type: Sequelize.DATE,
        allowNull: false
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
    await queryInterface.dropTable('courses');
  }
};