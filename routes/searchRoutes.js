import express from "express";
import { GoogleSpreadsheet } from "google-spreadsheet";

const router = express.Router();

/**
 * Loads Google credentials from an environment variable.
 */
async function loadCreds() {
  const base64Creds = process.env.GOOGLE_CREDENTIALS_BASE64;
  if (!base64Creds) {
    throw new Error("GOOGLE_CREDENTIALS_BASE64 environment variable is not set.");
  }
  const jsonString = Buffer.from(base64Creds, "base64").toString("utf8");
  return JSON.parse(jsonString);
}

/**
 * POST /api/users/search
 * Expects a JSON payload with:
 *   - keyword: The value to search for (e.g., "xiao lee")
 *   - country: The country code or name (e.g., "my")
 *   - searchType: The field to search on (e.g., "name", "phone", "idcard")
 */
router.post("/", async (req, res) => {
  try {
    const { keyword, country, searchType } = req.body;

    // Validate required parameters.
    if (!keyword || !country || !searchType) {
      return res.status(400).json({
        message: "缺少必要的搜索参数：keyword, country, searchType",
      });
    }

    // Load credentials and initialize the Google Spreadsheet.
    const creds = await loadCreds();
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    let matchedRow;

    // Search based on the provided searchType.
    if (searchType === "name") {
      matchedRow = rows.find(
        (row) =>
          row.name &&
          row.name.toLowerCase() === keyword.toLowerCase()
      );
    } else if (searchType === "phone") {
      matchedRow = rows.find(
        (row) => row.phone && row.phone === keyword
      );
    } else if (searchType === "idcard") {
      matchedRow = rows.find(
        (row) => row.idcard && row.idcard === keyword
      );
    } else {
      return res.status(400).json({ message: "无效的搜索类型" });
    }

    // Optional: Check that the row's country (if available) matches the provided country.
    if (matchedRow && matchedRow.country) {
      if (matchedRow.country.toLowerCase() !== country.toLowerCase()) {
        matchedRow = undefined;
      }
    }

    if (!matchedRow) {
      return res.status(404).json({ message: "未找到匹配的记录" });
    }

    // Respond with the matched record.
    res.json({
      name: matchedRow.name,
      phone: matchedRow.phone,
      idcard: matchedRow.idcard,
      country: matchedRow.country,

    });
  } catch (error) {
    console.error("搜索接口错误：", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
