"use strict";
const bcrypt = require("bcrypt");
const { JWT } = require("../lib/constant");
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("supervisor", JWT.SALT_ROUND);
    const guestPassword = await bcrypt.hash("guest", JWT.SALT_ROUND);

    await queryInterface.bulkInsert("users", [
      {
        userId: uuidv4(),
        name: "Supervisor",
        username: "supervisor",
        email: "supervisor@gmail.com",
        address: "Mataram",
        password: hashedPassword,
        role: "supervisor",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: uuidv4(),
        name: "Guest",
        username: "guest",
        email: "guest@gmail.com",
        address: "Mataram",
        password: guestPassword,
        role: "guest",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("users", null, {});
  },
};
