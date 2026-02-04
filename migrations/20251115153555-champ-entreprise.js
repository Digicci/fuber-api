'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("entreprises", "statut", {
      type: Sequelize.STRING
    })
    await queryInterface.addColumn("entreprises", "staff", {
      type: Sequelize.INTEGER
    })
    await queryInterface.addColumn("entreprises", "pays", {
      type: Sequelize.STRING
    })
    await queryInterface.addColumn("entreprises", "cp", {
      type: Sequelize.STRING
    })
    await queryInterface.addColumn("entreprises", "ville", {
      type: Sequelize.STRING
    })
    await queryInterface.addColumn("entreprises", "lat", {
      type: Sequelize.FLOAT
    })
    await queryInterface.addColumn("entreprises", "lng", {
      type: Sequelize.FLOAT
    })
    await queryInterface.addColumn("entreprises", "prix", {
      type: Sequelize.FLOAT
    })
    await queryInterface.addColumn("entreprises", "commission", {
      type: Sequelize.FLOAT
    })
    await queryInterface.addColumn("entreprises", "socket_token", {
      type: Sequelize.STRING
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("entreprises", "statut")
    await queryInterface.removeColumn("entreprises", "staff")
    await queryInterface.removeColumn("entreprises", "pays")
    await queryInterface.removeColumn("entreprises", "cp")
    await queryInterface.removeColumn("entreprises", "ville")
    await queryInterface.removeColumn("entreprises", "lat")
    await queryInterface.removeColumn("entreprises", "lng")
    await queryInterface.removeColumn("entreprises", "prix")
    await queryInterface.removeColumn("entreprises", "commission")
    await queryInterface.removeColumn("entreprises", "socket_token")
  }
};