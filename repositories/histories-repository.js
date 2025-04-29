const { histories } = require("../models");

class HistoryRepository {
  static async createHistory({
    user_id,
    category,
    title,
    description,
    type,
    value,
    background,
  }) {
    const createHistory = await histories.create({
      user_id: user_id,
      category: category,
      title: title,
      description: description,
      type: type,
      value: value,
      background: background,
    });

    return createHistory;
  }

  static async getHistoryByUserId({ id }) {
    const getHistory = await histories.findAll({
      where: {
        id: id,
      },
      order: [["createdAt", "DESC"]],
    });

    return getHistory;
  }

  static async getHistoryByUserId({ user_id }) {
    const getHistory = await histories.findAll({
      where: {
        user_id: user_id,
      },
      order: [["createdAt", "DESC"]],
    });

    return getHistory;
  }

  static async getHistoryByCategory({ user_id, category }) {
    const getHistory = await histories.findAll({
      where: {
        user_id: user_id,
        category: category,
      },
      order: [["createdAt", "DESC"]],
    });

    return getHistory;
  }

  static async getHistoryByHistoryId({ id }) {
    const getHistory = await histories.findOne({
      where: {
        id: id,
      },
      order: [["createdAt", "DESC"]],
    });

    return getHistory;
  }

  static async deleteHistoriesByIds({ ids }) {
    const deleteHistory = await histories.destroy({
      where: {
        id: ids,
      },
    });

    return deleteHistory;
  }
}

module.exports = HistoryRepository;
