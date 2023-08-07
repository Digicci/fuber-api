'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.addColumn("entreprises", "lat", {
            type: Sequelize.FLOAT,
            defaultValue: null,
            allowNull: true
        })

        await queryInterface.addColumn("entreprises", "lng", {
            type: Sequelize.FLOAT,
            defaultValue: null,
            allowNull: true
        })

        await queryInterface.addColumn("entreprises", "prix", {
            type: Sequelize.FLOAT,
            defaultValue: null,
            allowNull: true
        })

        await queryInterface.addColumn("entreprises", "comission", {
            type: Sequelize.FLOAT,
            defaultValue: null,
            allowNull: true
        })

        await queryInterface.addColumn("entreprises", "status", {
            type: Sequelize.STRING,
            defaultValue: "pending",
            allowNull: false
        })
    },

    async down(queryInterface, Sequelize) {

        await queryInterface.removeColumn("entreprises", "lat")
        await queryInterface.removeColumn("entreprises", "lng")
        await queryInterface.removeColumn("entreprises", "prix")
        await queryInterface.removeColumn("entreprises", "comission")
        await queryInterface.removeColumn("entreprises", "status")
    }
};
