const HistoriesService = require("../services/histories-services");

const createHistory = async (req, res) => {
  const { user_id } = req.params;
  const { category, title, description, type, value, background } = req.body;

  const { status, status_code, message, data } =
    await HistoriesService.createHistory({
      user_id: user_id,
      category: category,
      title: title,
      description: description,
      type: type,
      value: value,
      background: background,
    });

  res.status(status_code).send({
    status: status,
    message: message,
    data: data,
  });
};

const getHistoryByUserId = async (req, res) => {
  const { user_id } = req.params;

  const { status, status_code, message, data } =
    await HistoriesService.getHistoryById({
      user_id: user_id,
    });

  res.status(status_code).send({
    status: status,
    message: message,
    data: data,
  });
};

const getHistoryByCategory = async (req, res) => {
  const { user_id } = req.params;
  const { category } = req.query;

  const { status, status_code, message, data } =
    await HistoriesService.getHistoryByCategory({
      user_id: user_id,
      category: category,
    });

  res.status(status_code).send({
    status: status,
    message: message,
    data: data,
  });
};

const getHistoryByHistoryId = async (req, res) => {
  const { id } = req.params;

  const { status, status_code, message, data } =
    await HistoriesService.getHistoryByHistoryId({
      id: id,
    });

  res.status(status_code).send({
    status: status,
    message: message,
    data: data,
  });
};

const deleteHistoryById = async (req, res) => {
  const { ids } = req.body;

  const { status, status_code, message, data } =
    await HistoriesService.deleteHistoriesByIds({
      ids: ids,
    });

  res.status(status_code).send({
    status: status,
    message: message,
    data: data,
  });
};

module.exports = {
  createHistory: createHistory,
  getHistoryByUserId: getHistoryByUserId,
  getHistoryByCategory: getHistoryByCategory,
  deleteHistoryById: deleteHistoryById,
  getHistoryByHistoryId: getHistoryByHistoryId,
};
