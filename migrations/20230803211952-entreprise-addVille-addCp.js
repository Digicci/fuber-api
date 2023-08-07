'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn("entreprises", "cp", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    })

    await queryInterface.addColumn("entreprises", "ville", {
      type: Sequelize.STRING,
      defaultValue: "",
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("entreprises", "cp")
    await queryInterface.removeColumn("entreprises", "ville")
  }
};
