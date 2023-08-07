'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.removeColumn( "entreprises", "comission" ,{})
    await queryInterface.addColumn("entreprises", "commission", {
        type: Sequelize.FLOAT,
        defaultValue: null,
        allowNull: true
    })
  },


  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("entreprises", "commission")
    await queryInterface.addColumn("entreprises", "comission", {
        type: Sequelize.FLOAT,
        defaultValue: null,
        allowNull: true
    })
  }
};
