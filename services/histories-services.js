const HistoriesRepository = require("../repositories/histories-repository");
const { google } = require("googleapis");
const UserRepository = require("../repositories/users-repository");

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

const client = auth.getClient();
const googleSheets = google.sheets({ version: "v4", auth: client });

const spreadSheetId = "16NYsv3IOX5qObDatyQdrHJigK2xasUqf-rdglc7GJck";

const CATEGORY_CONFIG = {
  maps: {
    sheet: "SUDUT KOORDINAT",
    headers: [
      "User",
      "Tanggal",
      "Kategori",
      "Titik Koordinat",
      "Konstruksi TM",
    ],
  },
  fuse_link: {
    sheet: "FUSE LINK",
    headers: [
      "User",
      "Tanggal",
      "Kategori",
      "Nama Gardu",
      "Gaya Trafo",
      "Fuselink",
    ],
  },
  fuse_link_branch: {
    sheet: "FUSE LINK",
    headers: [
      "User",
      "tanggal",
      "kategori",
      "nama gardu",
      "gaya trafo",
      "fuselink",
    ],
  },
  nh_fuse_substation: {
    sheet: "NH Fuse",
    headers: [
      "User",
      "Tanggal",
      "Kategori",
      "Nama Gardu",
      "Daya Trafo",
      "Jumlah Jurusan",
      "NH Fuse",
    ],
  },
  mcb_1_phase: {
    sheet: "MCB",
    headers: ["User", "Tanggal", "Kategori", "Daya", "MCB"],
  },
  mcb_3_phase: {
    sheet: "MCB",
    headers: ["User", "Tanggal", "Kategori", "Daya", "MCB"],
  },
  lwbp: {
    sheet: "PENYEIMBANG GARDU",
    headers: [
      "User",
      "Tanggal",
      "Kategori",
      "Nama Gardu",
      "Ir",
      "Is",
      "It",
      "LWBP",
    ],
  },
  wbp: {
    sheet: "PENYEIMBANG GARDU",
    headers: [
      "User",
      "Tanggal",
      "Kategori",
      "Nama Gardu",
      "Ir",
      "Is",
      "It",
      "LWBP",
    ],
  },
  saidi: {
    sheet: "KEANDALAN DISTRIBUSI",
    headers: [
      "User",
      "Tanggal",
      "Kategori",
      "Lama Padam",
      "Total Pelanggan",
      "Jumlah Padam",
      "Total KWH Padam",
      "Hasil",
    ],
  },
  saifi: {
    sheet: "KEANDALAN DISTRIBUSI",
    headers: [
      "User",
      "Tanggal",
      "Kategori",
      "Lama Padam",
      "Total Pelanggan",
      "Jumlah Padam",
      "Total KWH Padam",
      "Hasil",
    ],
  },
  ens: {
    sheet: "KEANDALAN DISTRIBUSI",
    headers: [
      "User",
      "Tanggal",
      "Kategori",
      "Lama Padam",
      "Total Pelanggan",
      "Jumlah Padam",
      "Total KWH Padam",
      "Hasil",
    ],
  },
};

function getDateTime() {
  return new Date().toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
  });
}

function mapValueToRow(category, value, type, userName) {
  const dateTime = getDateTime();

  switch (category) {
    case "maps": {
      let coords = [];
      const tmValue = value.tm ? value.tm : "Diluar Kategori";
      if (Array.isArray(value.points)) {
        coords = value.points.map(
          (p) => `${p.lat || p.latitude}, ${p.lng || p.longitude}`
        );
      } else if (value.points) {
        coords = [
          `${value.points.lat || value.points.latitude}, ${
            value.points.lng || value.points.longitude
          }`,
        ];
      }

      return [userName, dateTime, "MAPS", coords.join(" | "), tmValue || ""];
    }

    case "fuse_link":
    case "fuse_link_branch": {
      return [
        userName,
        dateTime,
        "Fuse Link Gardu",
        value.power || "",
        value.voltage || "",
        value.result || "",
      ];
    }

    case "nh_fuse_substation": {
      return [
        userName,
        dateTime,
        "NH Fuse",
        type || "",
        value.power || "",
        value.jurusan || "",
        value.result || "",
      ];
    }

    case "mcb_1_phase": {
      return [
        userName,
        dateTime,
        "MCB 1 Phase",
        value.power || "",
        value.result || "",
      ];
    }

    case "mcb_3_phase": {
      return [
        userName,
        dateTime,
        "MCB 3 Phase",
        value.power || "",
        value.result || "",
      ];
    }

    case "lwbp": {
      return [
        userName,
        dateTime,
        "LWBP",
        type || "",
        value.ir || "",
        value.is || "",
        value.it || "",
        value.lwbp || "",
      ];
    }

    case "wbp": {
      const perPhase = value["LWBP per fasa"] || {};
      return [
        userName,
        dateTime,
        "WBP",
        type || "",
        perPhase.Ir || "",
        perPhase.Is || "",
        perPhase.It || "",
        value["Rata-rata Arus per fasa"] || "",
      ];
    }

    case "saidi": {
      return [
        userName,
        dateTime,
        "SAIDI",
        value.lama_padam_jam || "",
        value.total_pelanggan || "",
        value.jumlah_terdampak || "",
        "",
        value.result || "",
      ];
    }

    case "saifi": {
      return [
        userName,
        dateTime,
        "SAIFI",
        "",
        value.total_pelanggan || "",
        value.jumlah_gangguan || "",
        "",
        value.result || "",
      ];
    }

    case "ens": {
      return [
        userName,
        dateTime,
        "ENS",
        value.lama_padam_jam || "",
        "",
        "",
        value.total_kwh_padam || "",
        value.hasil_ens_mwh || "",
      ];
    }

    default:
      throw new Error(`Mapper untuk kategori '${category}' belum dibuat.`);
  }
}

async function ensureSheetExists(sheetName, headers) {
  const spreadsheet = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId: spreadSheetId,
  });

  const sheetExists = spreadsheet.data.sheets.some(
    (s) => s.properties.title === sheetName
  );

  if (!sheetExists) {
    await googleSheets.spreadsheets.batchUpdate({
      auth,
      spreadsheetId: spreadSheetId,
      resource: {
        requests: [
          {
            addSheet: {
              properties: { title: sheetName },
            },
          },
        ],
      },
    });

    await googleSheets.spreadsheets.values.update({
      auth,
      spreadsheetId: spreadSheetId,
      range: `${sheetName}!A1:${String.fromCharCode(65 + headers.length - 1)}1`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [headers] },
    });
  }
}
class HistoryService {
  static async createHistory({
    user_id,
    category,
    title = null,
    description = null,
    type = null,
    value,
    background,
  }) {
    try {
      if (!CATEGORY_CONFIG[category]) {
        throw new Error(`Kategori '${category}' belum dikonfigurasi.`);
      }

      const user = await UserRepository.findUserNameById({ userId: user_id });
      const nameMap = {
        Supervisor: "SUPERADMIN",
        "ULP 1": "ULP ALAS",
        "ULP 2": "ULP SUMBAWA",
        "ULP 3": "ULP TALIWANG",
      };

      const userName = nameMap[user.name] || user.name;

      const { sheet, headers } = CATEGORY_CONFIG[category];

      await ensureSheetExists(sheet, headers);

      const row = mapValueToRow(category, value, type, userName);

      const createdHistory = await HistoriesRepository.createHistory({
        user_id: user_id,
        category: category,
        title: title,
        description: description,
        type: type,
        value: value,
        background: background,
      });

      await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId: spreadSheetId,
        range: `${sheet}!A:Z`,
        valueInputOption: "USER_ENTERED",
        resource: { values: [row] },
      });

      return {
        status: true,
        status_code: 201,
        message: `History untuk kategori '${category}' berhasil disimpan.`,
        data: { history: createdHistory },
      };
    } catch (error) {
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
      return {
        status: false,
        status_code: 500,
        message: "Internal server error: " + error.message,
        data: { history: null },
      };
    }
  }

  static async getAllHistories() {
    try {
      const history = await HistoriesRepository.getAllHistories();

      return {
        status: true,
        status_code: 200,
        message: "Histories retrieved successfully.",
        data: { history: history },
      };
    } catch (error) {
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
      return {
        status: false,
        status_code: 500,
        message: "Internal server error: " + error.message,
        data: { history: null },
      };
    }
  }

  static async deleteHistoriesByIds({ ids, category }) {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        return {
          status: false,
          status_code: 400,
          message: "ID history yang dipilih tidak valid.",
          data: { deletedCount: 0 },
        };
      }

      if (!CATEGORY_CONFIG[category]) {
        return {
          status: false,
          status_code: 400,
          message: `Kategori '${category}' belum dikonfigurasi.`,
          data: { deletedCount: 0 },
        };
      }

      const deletedCount = await HistoriesRepository.deleteHistoriesByIds({
        ids,
      });

      // TODO: bisa ditambahkan penghapusan dari sheet kategori jika perlu

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
