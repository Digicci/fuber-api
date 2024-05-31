'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('courses', 'payment_intent', {
      type: Sequelize.STRING
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('courses', 'payment_intent')
  }
};