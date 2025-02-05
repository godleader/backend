// controllers/sheetController.js
import dotenv from 'dotenv';
dotenv.config();

import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'Sheet1';

let sheets;

// Google Sheets API setup (using base64 encoded JSON)
const credentialsBase64 = process.env.GOOGLE_CREDENTIALS_BASE64;

if (!credentialsBase64) {
  throw new Error('GOOGLE_CREDENTIALS_BASE64 environment variable is not set.');
}

try {
  const credentialsJson = JSON.parse(
    Buffer.from(credentialsBase64, 'base64').toString('utf8')
  );
  const auth = new google.auth.GoogleAuth({ credentials: credentialsJson });
  sheets = google.sheets({ version: 'v4', auth });
} catch (error) {
  console.error('Error parsing Google credentials:', error);
  throw new Error('Invalid Google credentials.');
}

/**
 * Endpoint to search data from the spreadsheet.
 * Expects a JSON body with { keyword, country, searchType }.
 */
export const search = async (req, res) => {
  const { keyword, country, searchType } = req.body;

  if (!keyword || !searchType) {
    return res.status(400).json({ error: "Missing keyword or search type" });
  }

  try {
    const rows = await getSpreadsheetData();
    const results = searchData(rows, keyword, searchType, country);

    if (results.length === 0) {
      return res.status(404).json({ message: "No matching records found" });
    }

    res.json(results);
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ error: "Search failed" });
  }
};

/**
 * Fetches data from the Google Spreadsheet.
 */
async function getSpreadsheetData() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:Z`,
    });
    return response.data.values || [];
  } catch (error) {
    console.error("Error fetching spreadsheet data:", error);
    throw error;
  }
}

/**
 * Searches the sheet rows for the given keyword in the specified column.
 * Optionally filters the results by country if provided.
 */
function searchData(rows, keyword, searchType, country) {
  if (!keyword) return [];

  const lowerCaseKeyword = keyword.toLowerCase();

  if (rows.length === 0) return [];
  
  const headers = rows[0];
  const searchColumnIndex = headers.indexOf(searchType);

  if (searchColumnIndex === -1) {
    return [];
  }

  let filteredRows = rows.slice(1).filter((row) => {
    const cellValue = row[searchColumnIndex];
    return cellValue && cellValue.toLowerCase().includes(lowerCaseKeyword);
  });

  if (country) {
    const countryIndex = headers.indexOf("country");
    if (countryIndex !== -1) {
      filteredRows = filteredRows.filter((row) => {
        const cellCountry = row[countryIndex];
        return cellCountry && cellCountry.toLowerCase() === country.toLowerCase();
      });
    }
  }

  return filteredRows;
}
