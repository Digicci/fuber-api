'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn("entreprises", "socket_token", {
      type: Sequelize.STRING,
      defaultValue: null,
      allowNull: true
    })
  }
  ,

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("entreprises", "socket_token")
  }
};