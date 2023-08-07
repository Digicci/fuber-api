'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

        await queryInterface.removeColumn( "entreprises", "status" ,{})
        await queryInterface.addColumn("entreprises", "statut", {
            type: Sequelize.STRING,
            defaultValue: "pending",
            allowNull: false
        })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("entreprises", "statut")
    await queryInterface.addColumn("entreprises", "status", {
        type: Sequelize.STRING,
        defaultValue: "pending",
        allowNull: false
    })
  }
};
