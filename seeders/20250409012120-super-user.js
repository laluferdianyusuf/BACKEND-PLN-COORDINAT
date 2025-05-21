"use strict";
const bcrypt = require("bcrypt");
const { JWT } = require("../lib/constant");
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("supervisor", JWT.SALT_ROUND);
    const ulp1Password = await bcrypt.hash("ulp_1_pln", JWT.SALT_ROUND);
    const ulp2Password = await bcrypt.hash("ulp_2_pln", JWT.SALT_ROUND);
    const ulp3Password = await bcrypt.hash("ulp_2_pln", JWT.SALT_ROUND);
    const ulp4Password = await bcrypt.hash("ulp_4_pln", JWT.SALT_ROUND);
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
        name: "ULP 1",
        username: "ulp_1",
        email: "ulp1@gmail.com",
        address: "Mataram",
        password: ulp1Password,
        role: "ulp_1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: uuidv4(),
        name: "ULP 2",
        username: "ulp_2",
        email: "ulp2@gmail.com",
        address: "Mataram",
        password: ulp2Password,
        role: "ulp_2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: uuidv4(),
        name: "ULP 3",
        username: "ulp_3",
        email: "ulp3@gmail.com",
        address: "Mataram",
        password: ulp3Password,
        role: "ulp_3",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: uuidv4(),
        name: "ULP 4",
        username: "ulp_4",
        email: "ulp4@gmail.com",
        address: "Mataram",
        password: ulp4Password,
        role: "ulp_4",
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
