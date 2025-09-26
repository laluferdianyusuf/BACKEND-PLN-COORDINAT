"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("histories", "category", {
      type: Sequelize.ENUM(
        "maps",
        "mcb_1_phase",
        "mcb_3_phase",
        "fuse_link",
        "fuse_link_branch",
        "nh_fuse_substation",
        "lwbp",
        "wbp",
        "saidi",
        "saifi",
        "ens"
      ),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("histories", "category", {
      type: Sequelize.ENUM(
        "maps",
        "mcb_1_phase",
        "mcb_3_phase",
        "fuse_link",
        "fuse_link_branch",
        "nh_fuse_substation",
        "lwbp",
        "wbp"
      ),
      allowNull: false,
    });
  },
};
