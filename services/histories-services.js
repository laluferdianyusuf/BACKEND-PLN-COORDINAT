const HistoriesRepository = require("../repositories/histories-repository");

class HistoryService {
  static async createHistory({
    user_id,
    category,
    title = null,
    description = null,
    value,
    background,
  }) {
    try {
      if (!user_id || typeof user_id !== "string") {
        return {
          status: false,
          status_code: 400,
          message: "User ID is required and must be a string.",
          data: { history: null },
        };
      }

      if (!category || typeof category !== "string") {
        return {
          status: false,
          status_code: 400,
          message: "Category is required and must be a string.",
          data: { history: null },
        };
      }

      if (!background || typeof background !== "string") {
        return {
          status: false,
          status_code: 400,
          message: "Background is required and must be a string.",
          data: { history: null },
        };
      }

      if (!value || typeof value !== "object") {
        return {
          status: false,
          status_code: 400,
          message: "Data is required and must be a JSON object.",
          data: { history: null },
        };
      }

      const createdHistory = await HistoriesRepository.createHistory({
        user_id: user_id,
        category: category,
        title: title,
        description: description,
        value: value,
        background: background,
      });

      return {
        status: true,
        status_code: 201,
        message: "History created successfully.",
        data: { history: createdHistory },
      };
    } catch (error) {
      console.error("Create History Error:", error);
      return {
        status: false,
        status_code: 500,
        message: "Internal server error: " + error.message,
        data: { history: null },
      };
    }
  }

  static async getHistoryById({ user_id }) {
    try {
      if (!user_id || typeof user_id !== "string") {
        return {
          status: false,
          status_code: 400,
          message: "User ID is required and must be a string.",
          data: { history: null },
        };
      }

      const history = await HistoriesRepository.getHistoryByUserId({
        user_id: user_id,
      });

      return {
        status: true,
        status_code: 200,
        message: "User history retrieved successfully.",
        data: { history: history },
      };
    } catch (error) {
      console.error("Get History By User ID Error:", error);
      return {
        status: false,
        status_code: 500,
        message: "Internal server error: " + error.message,
        data: { history: null },
      };
    }
  }

  static async getHistoryByCategory({ user_id, category }) {
    try {
      if (!user_id || typeof user_id !== "string") {
        return {
          status: false,
          status_code: 400,
          message: "User ID is required and must be a string.",
          data: { history: null },
        };
      }

      if (!category || typeof category !== "string") {
        return {
          status: false,
          status_code: 400,
          message: "Category is required and must be a string.",
          data: { history: null },
        };
      }

      const history = await HistoriesRepository.getHistoryByCategory({
        user_id: user_id,
        category: category,
      });

      return {
        status: true,
        status_code: 200,
        message: `History for category '${category}' retrieved successfully.`,
        data: { history: history },
      };
    } catch (error) {
      console.error("Get History By Category Error:", error);
      return {
        status: false,
        status_code: 500,
        message: "Internal server error: " + error.message,
        data: { history: null },
      };
    }
  }

  static async getHistoryByHistoryId({ id }) {
    try {
      if (!id || typeof id !== "string") {
        return {
          status: false,
          status_code: 400,
          message: "ID is required and must be a string.",
          data: { history: null },
        };
      }

      const history = await HistoriesRepository.getHistoryByHistoryId({
        id: id,
      });

      return {
        status: true,
        status_code: 200,
        message: `History for ID '${id}' retrieved successfully.`,
        data: { history: history },
      };
    } catch (error) {
      console.error("Get History By ID Error:", error);
      return {
        status: false,
        status_code: 500,
        message: "Internal server error: " + error.message,
        data: { history: null },
      };
    }
  }

  static async deleteHistoriesByIds({ ids }) {
    try {
      console.log(ids);

      if (!Array.isArray(ids) || ids.length === 0) {
        return {
          status: false,
          status_code: 400,
          message: "ID history yang dipilih tidak valid.",
          data: { deletedCount: 0 },
        };
      }

      const deletedCount = await HistoriesRepository.deleteHistoriesByIds({
        ids,
      });

      if (deletedCount > 0) {
        return {
          status: true,
          status_code: 200,
          message: `${deletedCount} riwayat berhasil dihapus.`,
          data: { deletedCount },
        };
      } else {
        return {
          status: false,
          status_code: 404,
          message: "Tidak ada riwayat yang dihapus.",
          data: { deletedCount: 0 },
        };
      }
    } catch (error) {
      console.error("Error saat menghapus history:", error);
      return {
        status: false,
        status_code: 500,
        message: "Terjadi kesalahan server: " + error.message,
        data: { deletedCount: 0 },
      };
    }
  }
}

module.exports = HistoryService;
